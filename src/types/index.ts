export interface Validator {
  value: string;
  label: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface LeaseConfig {
  validator: string;
  country: string;
  leaseMinutes: number;
  format: 'text' | 'json';
  alertBeforeExpiry: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WireGuardConfig {
  config: string;
  expiresAt: number; // Unix timestamp
}

export interface UserPreferences extends LeaseConfig {
  darkMode: boolean;
}