import { NextRequest, NextResponse } from 'next/server';
import http from 'http';
import https from 'https';
import { PassThrough } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const target = req.nextUrl.searchParams.get('url');
    if (!target) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
    }

    // Only allow proxying to our admin domain
    const url = new URL(target);
    if (url.hostname !== 'adminpanel.shreebandhu.com') {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 400 });
    }

    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    const options: https.RequestOptions = {
      method: 'GET',
      hostname: url.hostname,
      path: `${url.pathname}${url.search}`,
      headers: {
        'Accept': 'application/json, image/*,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      agent: isHttps ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    };

    return await new Promise<Response>((resolve) => {
      const upstream = client.request(options, (res) => {
        const pass = new PassThrough();
        res.pipe(pass);

        const headers = new Headers();
        headers.set('content-type', (res.headers['content-type'] as string) || 'application/octet-stream');
        if (res.headers['cache-control']) headers.set('cache-control', String(res.headers['cache-control']));

        resolve(new Response(pass as any, {
          status: res.statusCode || 200,
          headers,
        }));
      });

      upstream.on('error', (e) => {
        console.error('Proxy Upstream Error:', e);
        resolve(NextResponse.json({ error: 'Proxy error', details: e.message }, { status: 502 }));
      });
      upstream.end();
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy error', details: err?.message || 'unknown' }, { status: 502 });
  }
}
