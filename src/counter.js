/**
 * Counter Durable Object
 * Tracks resume page views with persistent state
 */
export class Counter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/increment':
        return this.handleIncrement();

      case '/get':
        return this.handleGet();

      case '/reset':
        return this.handleReset();

      default:
        // Default: increment on any GET
        return this.handleIncrement();
    }
  }

  async handleIncrement() {
    const currentCount = (await this.state.storage.get('count')) || 0;
    const newCount = currentCount + 1;
    await this.state.storage.put('count', newCount);

    return new Response(JSON.stringify({ count: newCount }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async handleGet() {
    const currentCount = (await this.state.storage.get('count')) || 0;

    return new Response(JSON.stringify({ count: currentCount }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async handleReset() {
    await this.state.storage.delete('count');

    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
