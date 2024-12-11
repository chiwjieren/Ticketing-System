const getDeviceId = async () => {
  try {
    // Get various device information
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const colorDepth = window.screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Create a unique device fingerprint by combining multiple device characteristics
    const deviceInfo = [
      userAgent,        // Browser and OS info
      platform,         // Operating system platform
      screenResolution, // Screen dimensions
      colorDepth,      // Screen color depth
      timezone         // User's timezone
    ].join('|');
    
    // Create a SHA-256 hash of the device info
    const encoder = new TextEncoder();
    const data = encoder.encode(deviceInfo);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const deviceId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return deviceId;
  } catch (error) {
    console.error('Error generating device ID:', error);
    return null;
  }
};

export default getDeviceId; 