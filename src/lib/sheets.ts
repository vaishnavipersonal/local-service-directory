import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export interface DirectoryRow {
  id: string;
  category: string;
  sub_category: string;
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
    
    return rows.map((row) => {
      const data = row.toObject();
      return {
        id: data['id'] || '',
        category: data['category'] || '',
        sub_category: data['sub-category'] || data['sub category'] || '',
        business_name: data['business_name'] || '',
        contact_number: data['contact_number'] || '',
        whatsapp_number: data['whatsapp_number'] || '',
        address: data['address'] || '',
        locality: data['locality'] || '',
        meta_title: data['meta_title'] || '',
        meta_description: data['meta_description'] || '',
        is_verified: data['is_verified'] === 'TRUE' || data['is_verified'] === 'true',
        is_featured: data['is_featured'] === 'TRUE' || data['is_featured'] === 'true',
        rating: data['rating'] ? parseFloat(data['rating']) : undefined,
        experience_years: data['experience_years'] ? parseInt(data['experience_years'], 10) : undefined,
        image_url: convertDriveLinkToDirectImage(data['image_url'] || ''),
        badges: data['badges'] || '',
        services: data['services'] || '',
      };
    });
  } catch (error) {
    console.error('Error fetching directory data:', error);
    return [];
  }
}

// Helper to convert Google Drive share links to direct image links
function convertDriveLinkToDirectImage(url: string): string {
  if (!url) return '';
  
  // Match standard /file/d/ID/view links
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  }
  
  // Match open?id=ID links
  const openIdMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch && openIdMatch[1] && url.includes('drive.google.com')) {
    return `https://drive.google.com/uc?export=view&id=${openIdMatch[1]}`;
  }

  return url;
}
