import { registerAs } from '@nestjs/config';

export default registerAs('googleSheets', () => ({
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  sheetsScope: process.env.GOOGLE_SHEETS_SCOPE,
  privateKey: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  sheetIds: process.env.GOOGLE_SHEET_IDS
    ? process.env.GOOGLE_SHEET_IDS.split(',')
    : [],
}));
