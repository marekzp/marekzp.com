interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const acceptsMarkdown = (accept: string | null) =>
  accept
    ?.split(',')
    .some((value) => {
      const [type, ...parameters] = value.trim().toLowerCase().split(';');
      const quality = parameters.find((parameter) => parameter.trim().startsWith('q='));
      return type === 'text/markdown' && (quality === undefined || Number(quality.trim().slice(2)) > 0);
    }) ?? false;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!acceptsMarkdown(request.headers.get('Accept'))) return env.ASSETS.fetch(request);

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const markdownPath =
      path === ''
        ? '/index.md'
        : path === '/blog'
          ? '/blog/index.md'
          : path === '/cv'
            ? '/cv.md'
            : `/markdown${path}/index.md`;
    const markdown = await env.ASSETS.fetch(new Request(new URL(markdownPath, url), request));

    if (!markdown.ok) return env.ASSETS.fetch(request);

    const headers = new Headers(markdown.headers);
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
    headers.set('Vary', headers.has('Vary') ? `${headers.get('Vary')}, Accept` : 'Accept');
    return new Response(markdown.body, { status: markdown.status, headers });
  },
};
