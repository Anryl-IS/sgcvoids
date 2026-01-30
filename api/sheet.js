// Serverless proxy to fetch published Google Sheets CSV and return with CORS headers
// Deploy this to Vercel (api/sheet.js) and client can fetch /api/sheet?src=<encoded_sheet_url>

const DEFAULT_SHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeTaEHJsuYfXHSBK1DePr0wjxElZZtEMnObZ5_iRdyYAt-1SvfPGbKVrsHRtUMOFI5_LyJiWnySn80/pub?output=csv';

module.exports = async (req, res) => {
  try {
    const src = req.query.src || req.query.url;
    const target = src ? decodeURIComponent(src) : DEFAULT_SHEET;

    // Basic validation - allow only docs.google.com spreadsheets
    const parsed = new URL(target);
    if (!parsed.hostname.endsWith('docs.google.com') || !parsed.pathname.includes('/spreadsheets/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid source URL' }));
      return;
    }

    const upstream = await fetch(target);
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Upstream error ${upstream.status}` }));
      return;
    }

    const text = await upstream.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.statusCode = 200;
    res.end(text);

  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};
