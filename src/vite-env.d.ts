/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:pwa-register' {
    export interface RegisterSWOptions {
        immediate?: boolean
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
    }

    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}

declare module 'vue-tel-input';
declare module 'vue-chartjs';
declare module 'chart.js';
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@vue/runtime-dom' {
    interface IntrinsicElements {
        'md-filled-button': any;
        'md-outlined-button': any;
        'md-text-button': any;
        'md-filled-tonal-button': any;
        'md-icon': any;
        'md-ripple': any;
        'md-switch': any;
        'md-checkbox': any;
        'md-outlined-text-field': any;
        'md-outlined-select': any;
        'md-select-option': any;
        'md-icon-button': any;
        [key: string]: any;
    }
}
