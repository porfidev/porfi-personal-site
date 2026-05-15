interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (errorCode: any) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

interface Turnstile {
  render: (element: string | HTMLElement, options: TurnstileRenderOptions) => string;

  reset: (widgetId?: string) => void;

  remove: (widgetId?: string) => void;

  getResponse: (widgetId?: string) => string;
}

declare const turnstile: Turnstile;
