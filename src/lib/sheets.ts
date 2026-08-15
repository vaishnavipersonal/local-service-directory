import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export interface DirectoryRow {
  id: string;
  category: string;
  business_name: string;
  contact_number: string;
  whatsapp_number: string;
  locality: string;
  rating: string;
  experience_years: string;
  is_verified: boolean;
  is_featured: boolean;
  image_url: string;
  badges: string;
  services: string;
  meta_title: string;
  meta_description: string;
}

export async function getDirectoryData(): Promise<DirectoryRow[]> {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !key || !sheetId) {
      console.error('Missing Google Sheets credentials');
      return [];
    }

    const serviceAccountAuth = new JWT({
      email: email,
      key: key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0]; 

    const rows = await sheet.getRows();
    
    return rows.map((row) => ({
      id: row.get('id') || '',
      category: row.get('category') || '',
      business_name: row.get('business_name') || '',
      contact_number: row.get('contact_number') || '',
      whatsapp_number: row.get('whatsapp_number') || '',
      locality: row.get('locality') || '',
      rating: row.get('rating') || '',
      experience_years: row.get('experience_years') || '',
      is_verified: row.get('is_verified') === 'TRUE' || row.get('is_verified') === 'true' || row.get('is_verified') === true,
      is_featured: row.get('is_featured') === 'TRUE' || row.get('is_featured') === 'true' || row.get('is_featured') === true,
      image_url: row.get('image_url') || '',
      badges: row.get('badges') || '',
      services: row.get('services') || '',
      meta_title: row.get('meta_title') || '',
      meta_description: row.get('meta_description') || '',
    }));
  } catch (error) {
    console.error('Error fetching directory data:', error);
    return [];
  }
}
