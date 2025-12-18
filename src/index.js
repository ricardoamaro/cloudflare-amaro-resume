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
        
        /* Demo Footer */
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
          Lisbon, Portugal • 
					<a href="https://ricardoamaro.com" style="color:#f6821f; text-decoration:none;">ricardoamaro.com</a> • 
					<a href="https://github.com/ricardoamaro" style="color:#f6821f; text-decoration:none;">github.com/ricardoamaro</a> • 
					<a href="https://www.linkedin.com/in/ricardoamaro" style="color:#f6821f; text-decoration:none;">linkedin.com/in/ricardoamaro</a> • [Email] 
        </div>
      </header>

      <h2>Summary</h2>
      <p style="font-size: 14px;">
        Scholar-Practitioner bridging the gap between Core Platform engineering and Product velocity. 
        Experienced in managing high-scale infrastructure (22k+ nodes) and leading engineering teams 
        through legacy-to-modern migrations. 
				Combining technical depth in Cloud-Native systems (Kubernetes, Terraform, IAM/RBAC) with the strategic leadership required to scale distributed teams and drive cross-departmental standardization.
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
          <span class="job-date">2006-2011</span>
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

      <h2>Published Work</h2>
      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Book Chapter</span>
        </div>
        <div class="company"><em>Seeking SRE</em>, O'Reilly Media, Chapter 18 (2018)</div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;">
          AI Agents, LSTM, and Machine Learning approaches in SRE. 
          <a href="https://www.oreilly.com/library/view/seeking-sre/9781491978856/ch18.html" style="color: #f6821f; text-decoration: none;">ISBN: 9781491978856</a>
        </p>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Scientific Articles</span>
        </div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;">
          <strong>Published:</strong> <em>Mapping DevOps Capabilities to the Software Life Cycle</em> (Information and Software Technology) • 
          <em>DevOps Metrics and KPIs</em> (ACM Computing Surveys) • 
          <em>Capabilities and Metrics in DevOps: A Design Science Study</em> (Information & Management) • 
          <em>Capabilities and Practices in DevOps</em> (IEEE Transactions on Software Engineering).<br>
          <a href="https://orcid.org/0000-0003-2649-8102" style="color: #f6821f; text-decoration: none;">Full publication list (ORCID)</a>
        </p>
      </div>

      <h2>Education & Research</h2>
      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Ph.D. in Information Science and Technology</span>
          <span class="job-date">2025</span>
        </div>
        <div class="company">ISCTE-IUL</div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;"><em>Achieving successful DevOps adoption in IT organizations.</em> Thesis Grade: A+</p>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Researcher, Intelligent Information Systems</span>
          <span class="job-date">2023</span>
        </div>
        <div class="company">INESC INOV</div>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">M.Sc. in Management Information Systems</span>
          <span class="job-date">2021</span>
        </div>
        <div class="company">IST</div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;">Thesis Grade: 20/20</p>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">B.Sc. in Computer Science & Engineering</span>
          <span class="job-date">2019</span>
        </div>
        <div class="company">UAb</div>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">B.A. in Arts</span>
          <span class="job-date">1998</span>
        </div>
        <div class="company">Instituto Politécnico de Lisboa</div>
      </div>

      <h2>Teaching & Leadership</h2>
      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Lead Instructor, DevOps Implementation in Kubernetes</span>
          <span class="job-date">2024 – Present</span>
        </div>
        <div class="company">Técnico+ (IST)</div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;">
          Architected and delivered 75-hour specialization on Cloud Native, GitOps, and CI/CD. 
          Prepares professionals for CKA/CKAD and GitLab certifications.
        </p>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Scientific Reviewer & Mentor</span>
          <span class="job-date">2024 – Present</span>
        </div>
        <div class="company">ISCTE-IUL & IST</div>
        <p style="font-size: 14px; color: #444; margin: 8px 0;">
          Reviewer for IEEE, ACM, and top-tier journals. Mentor for MSc/PhD students in DevOps, AI, and cloud architectures.
        </p>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">President</span>
          <span class="job-date">2011 – Present</span>
        </div>
        <div class="company">Portuguese Drupal Association (ADP)</div>
      </div>

      <div class="job-block">
        <div class="job-header">
          <span class="job-title">Track Chair (DevOps & Infrastructure)</span>
          <span class="job-date">2015 – 2020</span>
        </div>
        <div class="company">DrupalCon (Global/Local)</div>
      </div>

      <h2>Conference Speaking</h2>
      <ul style="font-size: 14px; color: #444;">
        <li><strong>KCD Porto 2024:</strong> Autoscaling Kubernetes with KEDA, Karpenter, HPA and VPA</li>
        <li><strong>DrupalCon:</strong> Munich, Prague, Amsterdam, Barcelona, Dublin, Vienna (2012–2023)</li>
        <li><strong>DrupalCamp Spain:</strong> Caceres 2013</li>
        <li><strong>DrupalCamp Portugal:</strong> Lisbon 2011, Porto 2012</li>
        <li><strong>DrupalDay Portugal:</strong> Lisboa 2013–2024, Aveiro 2016–2017</li>
        <li><strong>ICMA:</strong> Berlin 2010 (OpenClassifieds Web Strategy), Budapest 2009 (SEO for Classifieds)</li>
      </ul>

      <h2>Languages</h2>
      <p style="font-size: 14px; color: #444;">
        <strong>Portuguese</strong> (Native) • <strong>English</strong> (Fluent) • <strong>Spanish</strong> (Professional) • 
        <strong>French</strong> (Professional) • <strong>German</strong> (Basic)
      </p>

      <!-- Architecture Demo -->
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

      <footer style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #e9ecef; text-align: center; font-size: 13px; color: #888;">
        <a href="https://github.com/ricardoamaro/cloudflare-amaro-resume" style="color: #333; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; hover: {color: #000;}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Source on GitHub
        </a>
      </footer>

    </body>
    </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html' },
    });
  },
};