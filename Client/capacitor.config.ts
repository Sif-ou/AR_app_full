import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arsmartretail.app',   
  appName: 'AR Smart Retail',
  webDir: 'out', 
  server: {
    androidScheme: 'https',
    // 🚀 Explicitly authorize the WebView to hand off AR operations to the OS
    allowNavigation: [
      'arvr.google.com',
      '*.githubusercontent.com',
      'cdn.jsdelivr.net'
    ]
  }
};

export default config;