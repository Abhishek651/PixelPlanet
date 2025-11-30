# Admin Panel Guide

## How API Key Management Works

### Architecture
```
Admin Panel (Frontend) → Backend API → Database/Environment
                                    ↓
                            External APIs (OpenAI, Gemini, etc.)
```

### Workflow

1. **Admin Updates Keys**
   - Admin logs into the admin panel
   - Navigates to Settings/API Configuration
   - Updates API keys (OpenAI, Gemini, etc.)
   - Clicks "Save"

2. **Backend Stores Keys**
   - Backend receives the new keys
   - Stores them securely in database or updates environment
   - No frontend redeployment needed!

3. **Services Use Updated Keys**
   - EcoBot automatically uses new keys
   - All API calls go through backend
   - Users see updated functionality immediately

## Benefits

✅ **No Redeployment**: Change keys without redeploying frontend
✅ **Secure**: Keys never exposed to users or frontend code
✅ **Centralized**: One place to manage all API keys
✅ **Instant Updates**: Changes take effect immediately
✅ **Audit Trail**: Track who changed what and when

## Admin Panel Features

### API Key Management
- Add/Update OpenAI API key
- Add/Update Gemini API key
- Add/Update other service keys
- Test API connections
- View usage statistics

### How to Update Keys

1. Login as admin
2. Go to Admin Dashboard → Settings
3. Click "API Configuration"
4. Enter new API key
5. Click "Test Connection" (optional)
6. Click "Save"
7. Done! No redeployment needed

## For Developers

### Adding New API Services

1. **Backend**: Add endpoint to handle new service
   ```javascript
   // Backend: routes/api.js
   router.post('/api/newservice', async (req, res) => {
       const apiKey = await getApiKey('newservice'); // From DB
       // Use apiKey to call external service
   });
   ```

2. **Frontend**: Add to api.js
   ```javascript
   // Frontend: services/api.js
   export const newServiceAPI = {
       callService: async (data) => {
           return apiRequest('/api/newservice', {
               method: 'POST',
               body: JSON.stringify(data),
           });
       },
   };
   ```

3. **Admin Panel**: Add UI to manage the key
   - No frontend env changes needed!

## Security Best Practices

✅ API keys stored in backend only
✅ Keys encrypted in database
✅ Admin authentication required
✅ Audit logging enabled
✅ Rate limiting on API endpoints
✅ CORS properly configured

## Troubleshooting

### EcoBot Not Working
1. Check if API key is set in admin panel
2. Test API connection in admin panel
3. Check backend logs for errors
4. Verify backend is deployed and running

### Admin Can't Save Keys
1. Check admin permissions
2. Verify backend API is accessible
3. Check browser console for errors
4. Ensure proper authentication token

## Summary

The admin panel is fully functional and allows you to:
- Update API keys without touching code
- No redeployment needed
- Secure key management
- Instant updates across the platform

Just make sure your backend has the proper endpoints to store and retrieve API keys!
