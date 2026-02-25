# Waitlist Google Sheets Integration

## Quick Setup

### 1. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Lock In Waitlist" (or whatever you prefer)
3. Create headers in row 1:
   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Timestamp | Name | Email | Phone | Product | Source |

### 2. Add Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy and paste the contents of `Code.gs` from this folder
4. Save (Ctrl+S)

### 3. Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Configure:
   - Description: "Lock In Waitlist API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Authorize the app when prompted
6. **Copy the Web App URL** (looks like `https://script.google.com/macros/s/xxx/exec`)

### 4. Update Frontend

Open `src/components/WaitlistModal.tsx` and update the API URL:

```typescript
const WAITLIST_API = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

### 5. Test

1. Run `testAddEntry()` in Apps Script to verify it works
2. Check your Google Sheet for the test entry
3. Deploy your frontend and test the waitlist form

## Data Collected

| Field | Required | Description |
|-------|----------|-------------|
| Timestamp | Auto | When they signed up |
| Name | Yes | Customer name |
| Email | Yes | Customer email |
| Phone | No | Optional phone number |
| Product | Auto | Which product they're interested in |
| Source | No | How they heard about Lock In |

## Troubleshooting

### "Authorization required"
- Make sure you authorized the script when deploying
- Try redeploying with a new version

### No data appearing
- Check Apps Script execution logs: **View > Executions**
- Make sure the sheet name matches `SHEET_NAME` in the code

### CORS errors
- The frontend uses `mode: 'no-cors'` which should work
- If issues persist, the data might still be saving (check sheet)
