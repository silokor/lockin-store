/**
 * Lock In Coffee - Waitlist Apps Script
 * 
 * Setup:
 * 1. Create a Google Sheet with headers in row 1:
 *    A: Timestamp | B: Name | C: Email | D: Phone | E: Product | F: Source
 * 
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and update WAITLIST_API in WaitlistModal.tsx
 */

const SPREADSHEET_ID = '1_g_vIOWUl8kboi_oDnEOsfBqHk7mTKi32rsuczIW7D8';
const SHEET_NAME = 'Waitlist';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Product', 'Source']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    
    const targetSheet = ss.getSheetByName(SHEET_NAME);
    
    // Format timestamp for readability
    const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    
    // Append row
    targetSheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.product || '',
      data.source || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// For testing via GET request
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Lock In Waitlist API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function testAddEntry() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '010-1234-5678',
        product: 'Signature',
        source: 'instagram',
        timestamp: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
