import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new Request('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`
			"
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

			      <!-- Architecture Demo -->
			      <div class="demo-footer">
			        <span class="demo-badge">Edge Architecture</span>
			        <p>
			          <strong>Stack:</strong> Cloudflare Worker → Hyperdrive → Tunnel → Private MySQL (Drupal)
			        </p>
			        
			        <div class="terminal">
			<span class="comment"># Connection: Worker → Hyperdrive → Tunnel → MySQL</span>
			<span class="cmd">SELECT COUNT(nid), title FROM node_field_data WHERE status=1;</span>

			<span class="comment"># Response (~15ms):</span>
			{
			  "source":      "Mock (Tunnel not configured)",
			  "db_version":  "10.6.22-MariaDB",
			  "total_nodes": 153,
			  "latest":      "The Journey to Achieve Successful DevOps Adoption in IT Organizations"
			}
			        </div>
			      </div>

			    </body>
			    </html>
			    "
		`);
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('http://example.com');
		expect(await response.text()).toMatchInlineSnapshot(`
			"
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

			      <!-- Architecture Demo -->
			      <div class="demo-footer">
			        <span class="demo-badge">Edge Architecture</span>
			        <p>
			          <strong>Stack:</strong> Cloudflare Worker → Hyperdrive → Tunnel → Private MySQL (Drupal)
			        </p>
			        
			        <div class="terminal">
			<span class="comment"># Connection: Worker → Hyperdrive → Tunnel → MySQL</span>
			<span class="cmd">SELECT COUNT(nid), title FROM node_field_data WHERE status=1;</span>

			<span class="comment"># Response (~15ms):</span>
			{
			  "source":      "Mock (Tunnel not configured)",
			  "db_version":  "10.6.22-MariaDB",
			  "total_nodes": 153,
			  "latest":      "The Journey to Achieve Successful DevOps Adoption in IT Organizations"
			}
			        </div>
			      </div>

			    </body>
			    </html>
			    "
		`);
	});
});
