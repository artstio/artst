export class Measurer {
  #measures = new Set<{
    name: string;
    duration: number;
  }>();

  async time<Result>(name: string, fn: () => Promise<Result>): Promise<Result> {
    const start = Date.now();
    try {
      return await fn();
    } finally {
      const duration = Date.now() - start;
      this.#measures.add({ name, duration });
    }
  }

  async toHeaders(headers = new Headers()) {
    for (const { name, duration } of this.#measures) {
      const localName = name.includes("/") ? encodeURIComponent(name) : name;
      headers.append("Server-Timing", `${localName};dur=${duration}`);
    }
    return headers;
  }
}
