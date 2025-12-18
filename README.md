# Cloudflare Resume

**Live:** https://resume.amaro.com.pt

A Cloudflare Worker serving an ATS-friendly resume (Spearmint layout) directly from the edge.

## Architecture

| Component | Details |
|-----------|---------|
| DNS | Cloudflare (Free Tier) |
| Compute | Cloudflare Workers (V8 Isolate) |
| SSL | Full (Strict) |
| Tunnel | Cloudflare Tunnel (Zero Trust) |

### Future State: Secure Database Connection

Using Cloudflare Tunnel + Hyperdrive to connect to a private MySQL database without exposing it to the internet:

```mermaid
flowchart LR
    subgraph Internet
        User["User"]
    end

    subgraph Cloudflare["Cloudflare Edge"]
        Worker["Worker\n(resume.amaro.com.pt)"]
        Access["Access\n(Zero Trust)"]
        HD["Hyperdrive\n(Connection Pool)"]
    end

    subgraph Private["Private Network (Lisbon)"]
        Tunnel["cloudflared\n(Tunnel Connector)"]
        DB[("MySQL/MariaDB\nDrupal Database")]
    end

    User -->|HTTPS| Worker
    Worker --> HD
    HD --> Access
    Access <-->|Encrypted Tunnel| Tunnel
    Tunnel --> DB
```

**Benefits:**
- Database never exposed to the public internet
- Connection pooling reduces latency from edge locations
- Zero Trust access policies via Cloudflare Access
- All traffic encrypted end-to-end

---

## Implementation

### Step 1: DNS Setup

Move nameservers to Cloudflare:

- Set SSL mode to `Full (Strict)` to prevent redirect loops with existing backends
- Import existing `A` and `MX` records for zero downtime

### Step 2: Initialize Worker

```bash
# Install CLI
npm install -g wrangler

# Authenticate
wrangler login

# Create project
npm create cloudflare@latest amaro-resume
# Template: "Hello World"
# Type: Worker
# Language: JavaScript
```

The Worker (`src/index.js`) returns server-rendered HTML using a single-column layout for ATS compatibility.

### Step 3: Deploy

```bash
npx wrangler deploy
```

Output:
```
Total Upload: 0.19 KiB / gzip: 0.16 KiB
Uploaded amaro-resume (5.53 sec)
Deployed amaro-resume triggers (4.84 sec)
  https://amaro-resume.ricardoamaropt.workers.dev
```

### Step 4: Custom Domain

Add to `wrangler.jsonc`:

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

Following Cloudflare best practices (and advice from the team), the production iteration of this project moves beyond IP Allowlisting to a **Zero Trust** model using **Cloudflare Tunnel**.

### The "Magic" Architecture

Instead of exposing port 3306 on the legacy firewall, we utilize `cloudflared` to create a private, outbound-only tunnel.

1. **Legacy Host:** Runs `cloudflared` daemon (Connector).
2. **Tunnel:** Establishes a secure connection to Cloudflare Edge (`tunnel.ricardoamaro.com`).
3. **Hyperdrive:** Connects internally to the Tunnel, treating the remote DB as if it were local.
