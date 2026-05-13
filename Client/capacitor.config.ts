import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arsmartretail.app',   
  appName: 'AR Smart Retail',
  webDir: 'out', 
  server: {
    androidScheme: 'https'
  }
};

export default config;