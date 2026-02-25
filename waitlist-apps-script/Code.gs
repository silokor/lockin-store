/**
 * Lock In Coffee - Waitlist Apps Script
 * Uses GET with URL parameters to avoid CORS issues
 */

const SPREADSHEET_ID = '1_g_vIOWUl8kboi_oDnEOsfBqHk7mTKi32rsuczIW7D8';
const SHEET_NAME = 'Waitlist';

function doGet(e) {
  try {
    // Check if this is a data submission or just a status check
    if (!e.parameter.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'Lock In Waitlist API is running' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Product', 'Source']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    
    const timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    sheet.appendRow([
      timestamp,
      e.parameter.name || '',
      e.parameter.email || '',
      e.parameter.phone || '',
      e.parameter.product || '',
      e.parameter.source || ''
    ]);
    
    // Return JSONP callback if provided, otherwise JSON
    const callback = e.parameter.callback;
    const result = JSON.stringify({ success: true });
    
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + result + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(result)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    const result = JSON.stringify({ success: false, error: error.message });
    const callback = e.parameter.callback;
    
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + result + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(result)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Redirect POST to GET handler
  return doGet(e);
}

// Test function
function testAddEntry() {
  const mockEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '010-1234-5678',
      product: 'Signature',
      source: 'instagram'
    }
  };
  
  const result = doGet(mockEvent);
  Logger.log(result.getContent());
}
