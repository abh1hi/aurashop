export interface DeviceInfo {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    colorDepth: number;
    pixelRatio: number;
    timezone: string;
    cookiesEnabled: boolean;
    browser: string;
    os: string;
    deviceType: 'Mobile' | 'Tablet' | 'Desktop';
}

export const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';

    // Simple Browser Detection
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    // Simple OS Detection
    if (ua.indexOf("Win") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "MacOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("like Mac") > -1) os = "iOS";

    // Device Type Detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);

    if (isTablet) deviceType = 'Tablet';
    else if (isMobile) deviceType = 'Mobile';

    return {
        userAgent: ua,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        browser,
        os,
        deviceType
    };
};
