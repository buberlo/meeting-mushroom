import { NextResponse } from 'next/server';

import { listSpores } from '@/lib/spores';
import { buildAuditReport } from '@/lib/audit';
import type { AuditReport } from '@/types/spore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const spores = await listSpores();
    const report: AuditReport = await buildAuditReport(spores);

    const url = new URL(request.url);
    const download = url.searchParams.get('download') === '1';

    const headers: Record<string, string> = {
      'Cache-Control': 'no-store',
    };

    if (download) {
      headers['Content-Disposition'] = 'attachment; filename="spore-audit.json"';
    }

    return NextResponse.json(report, { headers });
  } catch (error) {
    console.error('[audit] failed to generate audit report', error);

    return NextResponse.json(
      {
        error: 'Failed to generate audit report',
      },
      { status: 500 }
    );
  }
}