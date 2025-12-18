import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Resume Worker', () => {
	it('returns HTML response', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const text = await response.text();
		expect(text).toContain('Ricardo Amaro, Ph.D.');
		expect(text).toContain('Senior Engineering Manager');
		expect(response.headers.get('content-type')).toBe('text/html');
	});

	it('includes architecture demo footer', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const text = await response.text();
		expect(text).toContain('Edge Architecture');
		expect(text).toContain('Cloudflare Worker → Hyperdrive → Tunnel');
		expect(text).toContain('GitHub');
	});
});
