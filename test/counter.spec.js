import { describe, it, expect } from 'vitest';
import { Counter } from '../src/counter.js';

class MockDOState {
	constructor() {
		this._kv = new Map();
		this.storage = {
			get: async (key) => this._kv.get(key),
			put: async (key, value) => {
				this._kv.set(key, value);
			},
			delete: async (key) => {
				this._kv.delete(key);
			},
		};
	}
}

describe('Counter Durable Object', () => {
  it('increments view count', async () => {
    const state = new MockDOState();
    const counter = new Counter(state, {});

    const request = new Request('http://localhost/');
    const response = await counter.fetch(request);
    const data = await response.json();

    expect(data.count).toBe(1);
  });

  it('persists count across requests', async () => {
    const state = new MockDOState();
    const counter = new Counter(state, {});

    const req1 = new Request('http://localhost/');
    await counter.fetch(req1);

    const req2 = new Request('http://localhost/');
    const response = await counter.fetch(req2);
    const data = await response.json();

    expect(data.count).toBe(2);
  });

  it('gets current count', async () => {
    const state = new MockDOState();
    const counter = new Counter(state, {});

    await counter.fetch(new Request('http://localhost/'));
    await counter.fetch(new Request('http://localhost/'));

    const request = new Request('http://localhost/get');
    const response = await counter.fetch(request);
    const data = await response.json();

    expect(data.count).toBe(2);
  });

  it('resets count to zero', async () => {
    const state = new MockDOState();
    const counter = new Counter(state, {});

    await counter.fetch(new Request('http://localhost/'));
    await counter.fetch(new Request('http://localhost/'));

    const request = new Request('http://localhost/reset');
    const response = await counter.fetch(request);
    const data = await response.json();

    expect(data.count).toBe(0);

    // Verify it's actually reset
    const checkRequest = new Request('http://localhost/get');
    const checkResponse = await counter.fetch(checkRequest);
    const checkData = await checkResponse.json();
    expect(checkData.count).toBe(0);
  });
});
