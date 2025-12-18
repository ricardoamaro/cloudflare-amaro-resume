# Cloudflare Resume

**Live:** https://resume.amaro.com.pt

A Cloudflare Worker serving an ATS-friendly resume directly from the edge. This project demonstrates edge-native architecture patterns for migrating legacy monolith content to a modern serverless platform.

## Current State

| Milestone | Status |
|-----------|--------|
| DNS Migration (`amaro.com.pt`) | ✓ Complete |
| SSL/TLS (Full Strict) | ✓ Active |
| WAF (AI Bot Protection) | ✓ Enabled |
| Worker Deployment | ✓ Live |
| Hyperdrive + Tunnel | Planned |

## Architecture

| Component | Configuration |
|-----------|---------------|
| DNS | Cloudflare (Free Tier) |
| Compute | Cloudflare Workers (V8 Isolate) |
| SSL | Full (Strict) |
| WAF | Custom Rule: Block AI Scrapers |
| Tunnel | Cloudflare Tunnel (Zero Trust) |

### Target Architecture: Private Database Access

The production configuration uses Cloudflare Tunnel + Hyperdrive to connect to a private MySQL database without public exposure:

```mermaid
flowchart TB
    subgraph Internet
        User["User"]
    end

    subgraph Edge["Cloudflare Edge (Global)"]
        Worker["Worker<br/>resume.amaro.com.pt"]
        WAF["WAF<br/>AI Bot Block"]
        HD["Hyperdrive<br/>Connection Pool"]
        Access["Access<br/>Zero Trust"]
    end

    subgraph Private["Private Network (Lisbon)"]
        Tunnel["cloudflared<br/>Outbound Tunnel"]
        DB[("MariaDB<br/>Drupal Database")]
    end

    User -->|HTTPS| WAF
    WAF --> Worker
    Worker --> HD
    HD --> Access
    Access <-->|Encrypted| Tunnel
    Tunnel --> DB
```

**Design Decisions:**
- Database remains on private network (no public IP exposure)
- Connection pooling via Hyperdrive reduces cold-start latency
- Zero Trust policies restrict tunnel access to Hyperdrive service tokens
- WAF blocks known AI scraper user agents at the edge

---

## Implementation

### Phase 1: DNS Migration

Migrated `amaro.com.pt` nameservers to Cloudflare:

```
Primary NS:   art.ns.cloudflare.com
Secondary NS: ella.ns.cloudflare.com
```

Configuration:
- SSL mode set to `Full (Strict)` to prevent redirect loops with origin
- Imported existing `A` and `MX` records (zero-downtime migration)
- Proxied status enabled for edge caching

### Phase 2: Security Hardening

Added WAF rule to block AI training scrapers:

**Dashboard:** Security → WAF → Custom Rules

```
Rule: Block AI Bots
Expression: (cf.client.bot) or (http.user_agent contains "GPTBot") or 
            (http.user_agent contains "ChatGPT") or 
            (http.user_agent contains "anthropic")
Action: Block
```

### Phase 3: Worker Deployment

Initialize and deploy:

```bash
npm install -g wrangler
wrangler login
npm create cloudflare@latest amaro-resume
```

The Worker (`src/index.js`) implements a layered architecture:
- **Data Layer:** Hybrid strategy supporting both Hyperdrive (production) and mock data (development)
- **Presentation Layer:** Server-rendered HTML with Spearmint resume template

### Phase 4: Custom Domain

Add route configuration to `wrangler.jsonc`:

```jsonc
"routes": [
  {
    "pattern": "resume.amaro.com.pt",
    "custom_domain": true
  }
]
```

Alternative: Dashboard → Workers → Triggers → Custom Domains

This triggers automatic SSL certificate issuance and CNAME propagation.

---

## Hyperdrive + Tunnel Setup (Optional)

Securely connect to a private MySQL database without exposing it to the internet.

### 1. Create Cloudflare Tunnel

In [Cloudflare One](https://one.dash.cloudflare.com/) → Networks → Tunnels:

```bash
# Install cloudflared on your database server
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Authenticate and create tunnel
./cloudflared tunnel login
./cloudflared tunnel create drupal-db-tunnel
```

Configure the tunnel (`~/.cloudflared/config.yml`):

```yaml
tunnel: <TUNNEL_ID>
credentials-file: ~/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: db-tunnel.amaro.com.pt
    service: tcp://localhost:3306
  - service: http_status:404
```

Run the tunnel:

```bash
./cloudflared tunnel run drupal-db-tunnel
```

### 2. Create Hyperdrive Configuration

```bash
# Create Hyperdrive pointing to the tunnel hostname
npx wrangler hyperdrive create drupal-link \
  --connection-string="mysql://USER:PASS@db-tunnel.amaro.com.pt:3306/drupal"
```

### 3. Configure Access Policy

In Cloudflare One → Access → Applications, create an application for `db-tunnel.amaro.com.pt` with a Service Auth policy to restrict access to Hyperdrive only.

### 4. Add Worker Binding

Add to `wrangler.jsonc`:

```jsonc
"hyperdrive": [
  {
    "binding": "HYPERDRIVE",
    "id": "<HYPERDRIVE_ID>"
  }
],
"compatibility_flags": ["nodejs_compat"]
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npx wrangler dev
# → http://localhost:8787

# Deploy to production
npx wrangler deploy
```

---

## Security Roadmap: Zero Trust Database Access

The production implementation follows Cloudflare's Zero Trust model, eliminating IP allowlisting in favor of identity-based access control.

### Architecture Rationale

Traditional database access requires exposing port 3306 and maintaining IP allowlists—a pattern that scales poorly and introduces operational overhead. The Tunnel approach inverts this model:

| Traditional | Zero Trust |
|-------------|------------|
| Inbound firewall rules | Outbound-only connections |
| IP allowlist management | Identity-based policies |
| Public endpoint exposure | Private tunnel ingress |

### Implementation

1. **Connector:** `cloudflared` daemon on database host establishes outbound tunnel
2. **Edge:** Cloudflare terminates tunnel, applies Access policies
3. **Hyperdrive:** Connection pooling to tunnel hostname as internal endpoint
