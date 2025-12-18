// MySQL client for Hyperdrive (install: npm i mysql2)
// import mysql from 'mysql2/promise';

// Mock data for development/demo
async function getMockData() {
  await new Promise(r => setTimeout(r, 15)); // Simulate latency
  return {
    status: "Online",
    latency: "~15ms",
    total_nodes: 153,
    featured_article: "The Journey to Achieve Successful DevOps Adoption in IT Organizations",
    db_version: "10.6.22-MariaDB",
    source: "Mock (Tunnel not configured)"
  };
}

export default {
  async fetch(request, env, ctx) {
    let dbData;

    // Check if Hyperdrive binding exists (production with tunnel)
    if (env.HYPERDRIVE) {
      try {
        // Connect via Hyperdrive (connection pooled through Cloudflare Tunnel)
        // const connection = await mysql.createConnection(env.HYPERDRIVE.connectionString);
        // 
        // const [nodes] = await connection.execute(
        //   `SELECT COUNT(nid) as total FROM node_field_data WHERE status = 1`
        // );
        // 
        // const [latest] = await connection.execute(
        //   `SELECT title FROM node_field_data WHERE status = 1 ORDER BY created DESC LIMIT 1`
        // );
        // 
        // const [version] = await connection.execute(`SELECT VERSION() as version`);
        // 
        // dbData = {
        //   status: "Online",
        //   latency: "~15ms",
        //   total_nodes: nodes[0].total,
        //   featured_article: latest[0].title,
        //   db_version: version[0].version,
        //   source: "Hyperdrive → Tunnel → MySQL"
        // };
        // 
        // await connection.end();

        // Fallback to mock until Hyperdrive is configured
        dbData = await getMockData();
      } catch (error) {
        console.error('Database error:', error);
        dbData = { status: "Error", error: error.message };
      }
    } else {
      // Development mode: use mock data
      dbData = await getMockData();
    }

    // Render the resume HTML
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ricardo Amaro, Ph.D. - Resume</title>
      <style>
        /* Spearmint-inspired: Clean, Single Column, High Readability */
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; }
        
        /* Typography */
        h1 { font-size: 36px; margin-bottom: 5px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px; }
        .role { font-size: 18px; color: #666; margin-bottom: 30px; font-weight: 500; }
        h2 { font-size: 14px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px; color: #1a1a1a; letter-spacing: 1px; font-weight: 700; }
        
        /* Job Blocks */
        .job-block { margin-bottom: 25px; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; }
        .job-title { font-weight: 700; font-size: 16px; color: #000; }
        .job-date { color: #666; font-size: 14px; }
        .company { font-style: italic; color: #444; margin-bottom: 8px; font-size: 15px; }
        
        /* Lists & Skills */
        ul { margin-top: 5px; padding-left: 18px; }
        li { margin-bottom: 6px; font-size: 14px; color: #444; }
        .tech-stack { font-size: 14px; color: #444; line-height: 1.8; }
        
        /* THE DEMO FOOTER (The "Flex") */
        .demo-footer {
          margin-top: 60px;
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          border-radius: 4px;
          font-size: 13px;
          color: #555;
        }
        .demo-badge {
          display: inline-block;
          background: #f6821f; /* Cloudflare Orange */
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .terminal {
          background: #1e1e1e;
          color: #00ff00;
          padding: 15px;
          border-radius: 6px;
          font-family: 'Courier New', Courier, monospace;
          margin-top: 10px;
          white-space: pre-wrap;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .cmd { color: #fff; }
        .comment { color: #888; }
      </style>
    </head>
    <body>

      <header>
        <h1>Ricardo Amaro, Ph.D.</h1>
        <div class="role">Senior Engineering Manager | Platform Strategy</div>
        <div style="font-size: 14px; color: #555;">
          Lisbon, Portugal • <a href="https://ricardoamaro.com" style="color:#f6821f; text-decoration:none;">ricardoamaro.com</a> • [Email] • [LinkedIn]
        </div>
      </header>

      <h2>Summary</h2>
      <p style="font-size: 14px;">
        Scholar-Practitioner bridging the gap between Core Platform engineering and Product velocity. 
        Experienced in managing high-scale infrastructure (22k+ nodes) and leading engineering teams 
        through legacy-to-modern migrations.
      </p>

      <h2>Experience</h2>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Senior Engineering Manager, Platform Engineering</span>
          <span class="job-date">2011 – Present</span>
        </div>
        <div class="company">Acquia (Remote / Lisbon)</div>
        <ul>
          <li>Leading platform engineering teams to deliver high-availability infrastructure solutions.</li>
          <li>Managed the migration of legacy monoliths to containerized microservices.</li>
          <li>Oversaw fleet management of 22,800+ nodes, ensuring 99.99% uptime.</li>
        </ul>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Internet Director</span>
          <span class="job-date">[Dates]</span>
        </div>
        <div class="company">Global Media Group</div>
        <ul>
          <li>Directed web strategy and infrastructure for major media properties.</li>
        </ul>
      </div>

      <h2>Technical Skills</h2>
      <div class="tech-stack">
        <strong>Infrastructure:</strong> Kubernetes, AWS, Terraform, Linux (RHEL/Debian), Docker.<br>
        <strong>Development:</strong> Go, Python, PHP (Drupal), Cloudflare Workers (JS/TS).<br>
        <strong>Leadership:</strong> Agile/Scrum, Incident Management, Strategic Planning.
      </div>

      <h2>Education</h2>
      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Ph.D. in Information Science</span>
          <span class="job-date">[Year]</span>
        </div>
        <div class="company">ISCTE-IUL</div>
      </div>

      <!-- Live Architecture Demo -->
      <div class="demo-footer">
        <span class="demo-badge">Edge Architecture</span>
        <p>
          <strong>Stack:</strong> Cloudflare Worker → Hyperdrive → Tunnel → Private MySQL (Drupal)
        </p>
        
        <div class="terminal">
<span class="comment"># Connection: Worker → Hyperdrive → Tunnel → MySQL</span>
<span class="cmd">SELECT COUNT(nid), title FROM node_field_data WHERE status=1;</span>

<span class="comment"># Response (${dbData.latency || 'N/A'}):</span>
{
  "source":      "${dbData.source || 'Mock Data'}",
  "db_version":  "${dbData.db_version || 'N/A'}",
  "total_nodes": ${dbData.total_nodes || 0},
  "latest":      "${dbData.featured_article || 'N/A'}"
}
        </div>
      </div>

    </body>
    </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html' },
    });
  },
};