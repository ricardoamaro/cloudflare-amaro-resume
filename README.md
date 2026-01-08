# Cloudflare Resume

**Live:** [https://resume.amaro.com.pt](https://resume.amaro.com.pt)

A Cloudflare Worker serving an ATS-friendly resume directly from the edge.
This project demonstrates edge-native architecture patterns for migrating
legacy monolith content to a modern serverless platform.

## Current State

| Milestone | Status |
|-----------|--------|
| DNS Migration (`amaro.com.pt`) | ✓ Complete |
| SSL/TLS (Full Strict) | ✓ Active |
| WAF (AI Bot Protection) | ✓ Enabled |
| Worker Deployment | ✓ Live |
| Durable Objects Counter | ✓ Live |
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

The production configuration uses Cloudflare Tunnel + Hyperdrive to connect
to a private MySQL database without public exposure:

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

**Why this stack?** I treated this project as an adventure in "dogfooding" the
modern edge stack. Instead of spinning up a VPS or a container, I wanted to see
if I could replicate a full tech stack (Compute, Security, State, database coding)
entirely using Cloudflare's primitives.

---

## Implementation

### Phase 1: DNS Migration

Migrated `amaro.com.pt` nameservers to Cloudflare:

```text
Primary NS:   jonah.ns.cloudflare.com
Secondary NS: lola.ns.cloudflare.com
```

**The Entry Point:** Everything starts with DNS. By moving the nameservers to
Cloudflare, I wasn't just managing records; I was putting the entire site behind
their global network. It's the prerequisite that unlocks SSL, Caching, and
Security features instantly.

Configuration:

- SSL mode set to `Full (Strict)` to prevent redirect loops with origin
- Imported existing `A` and `MX` records (zero-downtime migration)
- Proxied status enabled for edge caching

### Phase 2: Security Hardening

Implemented a **Defense-in-Depth** strategy to prevent unauthorized LLM
training on personal research data, utilizing Cloudflare's Bot controls.

**The AI Invasion:** As I analyzed my logs, I realized my personal data was being
scraped by LLMs. I used **WAF** and **Bot Management** to turn the edge network
into a shield. Instead of handling these requests in my application code (and
paying for the CPU cycles), Cloudflare drops them at the network edge.

#### 1. Managed Protection (Layer 7)

- **Dashboard:** Security → Bots
- **Action:** Enabled **"Block AI bots"**.
- **Effect:** Automatically blocks verified AI crawlers including `GPTBot`
  (OpenAI), `ClaudeBot` (Anthropic), `Bytespider` (ByteDance/TikTok),
  and `CCBot` (Common Crawl).

#### 2. Bot Fight Mode (Behavioral Analysis)

- **Dashboard:** Security → Bots → Bot Fight Mode
- **Action:** Enabled.
- **Effect:** Injects JavaScript challenges to detect and block simple
  script-based scrapers that don't execute JS.

#### 3. Custom WAF Rule (Explicit Deny)

While the managed rule covers verified bots, I added a custom WAF rule to
explicitly drop connections from aggressive scrapers based on User-Agent
strings, ensuring coverage even if the managed rule updates are delayed.

- **Rule Name:** `Block AI Scrapers`
- **Action:** `Block`
- **Expression:**

```sql
(http.user_agent contains "Bytespider") or
(http.user_agent contains "GPTBot") or
(http.user_agent contains "ClaudeBot") or
(http.user_agent contains "Omgilibot") or
(http.user_agent contains "FacebookBot")
```

> **Rationale:** Targets specific AI training bots while preserving SEO
> crawlers (Googlebot, Bingbot) and social preview fetchers. We avoid
> `(cf.client.bot)` which would indiscriminately block legitimate indexing.

### Phase 3: Worker Deployment

Initialize and deploy:

```bash
npm install -g wrangler
wrangler login
npm create cloudflare@latest amaro-resume
```

**Global Compute:** **Cloudflare Workers** are the heart of this setup. Unlike
traditional Lambda functions or containers, they run on V8 Isolates. This means
0ms cold starts. It felt like deploying code to hundreds of data centers
simultaneously with a single command.

The Worker (`src/index.js`) implements a layered architecture:

- **Data Layer:** Hybrid strategy supporting both Hyperdrive (production)
  and mock data (development)
- **Presentation Layer:** Server-rendered HTML with Spearmint resume
  template

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

## View Counter (Durable Objects)

My resume uses **Cloudflare Durable Objects** to maintain a persistent
view counter that survives Worker deployments and data center failures.

**State in a Stateless World:** Serverless is great, but where do you store the
numbers? I didn't want to spin up a SQL server just for a hit counter. **Durable
Objects** provided the answer: strongly consistent storage attached to a specific
class. It's like having a tiny, dedicated server that pops into existence just
to count hits and then sleeps.

### How I found it works

1. **Counter Object** (`src/counter.js`) stores state in Durable Objects
2. **Worker** increments counter on each page view
3. **Persistent** — State survives Worker redeploys
4. **No Database Needed** — Uses Cloudflare's global state system

### Usage

```bash
# View current count (development)
curl http://localhost:8787/?action=get

# Reset counter (admin endpoint)
curl http://localhost:8787/?action=reset
```

The counter is displayed in the footer as **Views: N**.

---

## Hyperdrive + Tunnel Setup (Optional)

Securely connect to a private MySQL database without exposing it to the internet.

**Bridging the Gap:** My Drupal database lives in a private network in Lisbon.
Exposing port 3306 to the internet is a security nightmare.

- **Cloudflare Tunnel** creates a secure outbound connection, so no firewall
  ports needed opening.
- **Hyperdrive** solves the physics problem. Connecting to a database across
  the ocean is slow. Hyperdrive maintains a connection pool and caches the
  results globally, making my legacy database feel like it's running next to
  the user.

### 1. Create Cloudflare Tunnel

In [Cloudflare One](https://one.dash.cloudflare.com/) → Networks →
Tunnels:

```bash
# Install cloudflared on your database server
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o cloudflared
chmod +x cloudflared

# Authenticate and create tunnel
./cloudflared tunnel login
./cloudflared tunnel create drupal-db-tunnel
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

In Cloudflare One → Access → Applications, create an application for
`db-tunnel.amaro.com.pt` with a Service Auth policy to restrict access to
Hyperdrive only.

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
```

### Build & Deploy Lifecycle

Use the Makefile for common tasks:

```bash
# Run all CI checks
make ci

# Deploy to Cloudflare
make cd

# Run full CI/CD pipeline
make cicd
```

**CI Pipeline** (`make ci`) runs:

- **test** — Execute Vitest suite in CI mode
- **lint** — Markdownlint on README.md for formatting
- **audit** — npm audit for vulnerable dependencies
- **validate** — wrangler types to verify Worker configuration

**Individual commands:**

```bash
make test      # Run tests
make lint      # Lint markdown
make audit     # Check dependencies
make validate  # Build validation
make cd        # Deploy to production
```

Or manually:

```bash
# Deploy to production
npx wrangler deploy
```

---

## Security Roadmap: Zero Trust Database Access

The production implementation follows Cloudflare's Zero Trust model,
eliminating IP allowlisting in favor of identity-based access control.
Based on [Hyperdrive: Connect to a Private Database](
https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/).

![Hyperdrive Private Database Architecture](https://developers.cloudflare.com/_astro/hyperdrive-private-database-architecture.BrGTjEln_2iaw6y.webp)

### Architecture Rationale

Traditional database access requires exposing port 3306 and maintaining IP
allowlists—a pattern that scales poorly and introduces operational overhead.
The Tunnel approach inverts this model:

| Traditional | Zero Trust |
|-------------|------------|
| Inbound firewall rules | Outbound-only connections |
| IP allowlist management | Identity-based policies |
| Public endpoint exposure | Private tunnel ingress |

### Implementation Details

1. **Connector:** `cloudflared` daemon on database host establishes
   outbound tunnel
2. **Edge:** Cloudflare terminates tunnel, applies Access policies
3. **Hyperdrive:** Connection pooling to tunnel hostname as internal
   endpoint
