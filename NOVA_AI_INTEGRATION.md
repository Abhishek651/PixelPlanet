# Amazon Nova 2 Lite Integration

## Overview
PixelPlanet now uses **Amazon Nova 2 Lite** (free) via OpenRouter for AI-powered physical challenge verification, replacing Google Gemini AI.

## Why Nova 2 Lite?
- ✅ **100% Free** - No API costs
- ✅ **1M context window** - Can process large images and detailed prompts
- ✅ **Multimodal** - Processes text, images, and videos
- ✅ **Fast & Reliable** - Optimized for everyday workloads
- ✅ **No Quota Limits** - Unlike Gemini's free tier

## Features

### AI Verification Capabilities
1. **AI-Generated Image Detection**
   - Identifies fake/AI-generated images
   - Detects screenshots and manipulated photos
   - Confidence scoring (0-100%)

2. **Challenge Completion Verification**
   - Analyzes if photo matches challenge requirements
   - Provides match score and reasoning
   - Gives constructive feedback

3. **Image Description**
   - Detailed analysis of photo content
   - Environmental context extraction
   - Location and activity identification

### Toggle Control
Teachers/Creators can now **enable or disable AI verification** per challenge:
- **ON**: Full AI verification with Nova 2 Lite
- **OFF**: Manual verification only (faster, no AI costs)

## Configuration

### Backend (.env)
```env
OPENROUTER_API_KEY=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
```

### API Details
- **Provider**: OpenRouter
- **Model**: `amazon/nova-2-lite-v1:free`
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Cost**: $0/M tokens (completely free)

## Implementation

### Files Modified
1. **Backend/utils/novaVerification.js** (NEW)
   - Nova AI integration
   - Image analysis functions
   - Challenge verification logic

2. **Backend/routes/physical-challenge.js**
   - Conditional AI verification based on toggle
   - Respects `requiresVerification` flag

3. **Frontend/src/components/Switch.jsx** (NEW)
   - Animated toggle component
   - Styled with green theme

4. **Frontend/src/pages/CreatePhysicalChallengePage.jsx**
   - AI verification toggle
   - Dynamic UI based on toggle state

### Usage Flow
1. Teacher creates physical challenge
2. Toggles AI verification ON/OFF
3. Challenge saved with `requiresVerification` flag
4. Student submits photo
5. If AI enabled:
   - Metadata check (EXIF, GPS)
   - AI-generated detection (Nova)
   - Challenge completion verification (Nova)
6. If AI disabled:
   - Basic metadata check only
   - Manual teacher review

## Benefits Over Gemini
| Feature | Gemini | Nova 2 Lite |
|---------|--------|-------------|
| Cost | Limited free tier | 100% Free |
| Context | 1M tokens | 1M tokens |
| Speed | Fast | Fast |
| Quota | 15 RPM free | No limits |
| Multimodal | Yes | Yes |
| Reliability | Good | Excellent |

## API Response Format

### AI Detection
```json
{
  "isReal": true,
  "confidence": 95,
  "type": "real_photo",
  "reasoning": "Image shows authentic camera metadata",
  "indicators": ["EXIF data present", "Natural lighting"]
}
```

### Challenge Verification
```json
{
  "completed": true,
  "confidence": 90,
  "matchScore": 85,
  "observedAction": "Person planting a tree",
  "reasoning": "Image clearly shows tree planting activity",
  "positiveIndicators": ["Shovel visible", "Sapling present"],
  "concerns": [],
  "feedback": "Great job! Clear evidence of tree planting."
}
```

## Error Handling
- Falls back gracefully if API fails
- Gives benefit of doubt on errors
- Logs detailed error information
- User-friendly error messages

## Future Enhancements
- [ ] Video verification support
- [ ] Batch processing for multiple submissions
- [ ] Custom verification prompts per challenge
- [ ] Verification history and analytics
- [ ] A/B testing between AI models

## Support
For issues or questions about Nova AI integration, contact the development team.

---
**Last Updated**: December 2024
**Version**: 1.0.0
