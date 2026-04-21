import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Spreadsheet name and sheet mapping
const SPREADSHEET_NAME = 'Salinan dari NEW GDOC WSA FULFILLMENT';
const SHEET_MAP: Record<string, string> = {
  WSA: '0', // first sheet (index)
  WAPPR: '0', // first sheet (index)
  MODOROSO: 'MODOROSO_JAKTIMSEL',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode } = req.query;
  if (!mode || typeof mode !== 'string') {
    return res.status(400).json({ error: 'Missing mode parameter' });
  }

  try {
    // Build credentials from env vars
    const credentials = {
      type: process.env.GCP_TYPE || 'service_account',
      project_id: process.env.GCP_PROJECT_ID,
      private_key_id: process.env.GCP_PRIVATE_KEY_ID,
      private_key: (process.env.GCP_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      client_email: process.env.GCP_CLIENT_EMAIL,
      client_id: process.env.GCP_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    // Find the spreadsheet by name
    const driveRes = await drive.files.list({
      q: `name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet'`,
      fields: 'files(id, name)',
      pageSize: 1,
    });

    const files = driveRes.data.files;
    if (!files || files.length === 0) {
      return res.status(404).json({ error: `Spreadsheet "${SPREADSHEET_NAME}" not found` });
    }

    const spreadsheetId = files[0].id!;

    // Get worksheet
    let range: string;
    const sheetTarget = SHEET_MAP[mode.toUpperCase()] ?? '0';

    if (mode.toUpperCase() === 'MODOROSO') {
      // Named sheet
      range = `${sheetTarget}!A:ZZ`;
    } else {
      // First sheet — get its title first
      const metaRes = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties' });
      const firstSheet = metaRes.data.sheets?.[0]?.properties?.title || 'Sheet1';
      range = `${firstSheet}!A:ZZ`;
    }

    const dataRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = dataRes.data.values || [];
    if (rows.length < 2) {
      return res.status(200).json({ ids: [], checkColumn: '', sheetName: range.split('!')[0] });
    }

    const headers = rows[0] as string[];
    const WORKORDER_COL = 'Workorder';
    const SC_COL = 'SC Order No/Track ID/CSRM No';

    const checkCol = mode.toUpperCase() === 'MODOROSO' ? WORKORDER_COL : SC_COL;
    const colIdx = headers.indexOf(checkCol);

    let ids: string[] = [];
    if (colIdx >= 0) {
      ids = rows
        .slice(1)
        .map((r) => String(r[colIdx] ?? '').replace(/\.0$/, '').trim())
        .filter(Boolean);
    }

    return res.status(200).json({
      ids,
      checkColumn: checkCol,
      sheetName: range.split('!')[0],
      totalRows: rows.length - 1,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/sheets] Error:', message);
    return res.status(500).json({ error: message });
  }
}
