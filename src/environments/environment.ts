export const environment = {
  production: false,
  geminiApiKey: ''
};

// Load from Replit environment variables
declare const process: any;
if (typeof process !== 'undefined' && process.env) {
  environment.geminiApiKey = process.env['GEMINI_API_KEY'] || '';
}

// For browser environments, try to get from global window object
declare const window: any;
if (typeof window !== 'undefined' && window._env) {
  environment.geminiApiKey = window._env.GEMINI_API_KEY || environment.geminiApiKey;
}