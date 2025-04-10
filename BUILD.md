# Build Instructions

This document provides detailed instructions for building and deploying the Secure Notes application.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Expo CLI (`npm install -g expo-cli`)
- For iOS builds: macOS with Xcode 14+
- For Android builds: Android Studio with SDK 33+

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the app:
- Web: Open browser to the displayed URL
- iOS/Android: Scan QR code with Expo Go app

## Building for Production

### Web

1. Create a production build:
```bash
npx expo export:web
```

2. The build will be available in the `web-build` directory

### Android

1. Configure app.json:
- Update `android.package`
- Set `android.versionCode`

2. Build APK:
```bash
npm run build:android
```

3. Build Production Release:
```bash
npm run build:android-prod
```

### iOS

1. Configure app.json:
- Update `ios.bundleIdentifier`
- Set `ios.buildNumber`

2. Build for TestFlight:
```bash
eas build --platform ios --profile preview
```

3. Build Production Release:
```bash
eas build --platform ios --profile production
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_API_KEY=your_api_key
```

## Troubleshooting

### Common Issues

1. Build fails with node modules error:
```bash
rm -rf node_modules
npm install
```

2. Metro bundler issues:
```bash
npx expo start --clear
```

3. Android build fails:
- Check Android SDK installation
- Verify gradle configuration

4. iOS build fails:
- Update Xcode
- Verify certificates and provisioning profiles

## Deployment

### Web Deployment

1. Build the web version:
```bash
npx expo export:web
```

2. Deploy to your hosting service:
```bash
cd web-build
# Deploy using your preferred hosting service
```

### Mobile Deployment

1. Configure EAS:
```bash
eas build:configure
```

2. Submit to stores:
```bash
eas submit -p ios
eas submit -p android
```

## Testing

Run tests:
```bash
npm test
```

## Performance Optimization

1. Enable production mode
2. Implement code splitting
3. Optimize images
4. Enable caching
5. Minimize bundle size

## Security Considerations

- Keep environment variables secure
- Regular security audits
- Update dependencies
- Follow security best practices