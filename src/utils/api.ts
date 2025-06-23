import toast from 'react-hot-toast';
import { APIResponse, Country, WireGuardConfig } from '../types';

// Constants
const TIMEOUT_DURATION = 5000;
const COUNTRY_NAMES: Record<string, string> = {
  'DE': 'Germany', 'TR': 'Turkey', 'FI': 'Finland', 'MD': 'Moldova', 'MM': 'Myanmar',
  'BR': 'Brazil', 'EG': 'Egypt', 'AT': 'Austria', 'ZA': 'South Africa', 'AZ': 'Azerbaijan',
  'MT': 'Malta', 'CO': 'Colombia', 'PE': 'Peru', 'KR': 'South Korea', 'KZ': 'Kazakhstan',
  'BY': 'Belarus', 'KG': 'Kyrgyzstan', 'KH': 'Cambodia', 'SG': 'Singapore', 'QA': 'Qatar',
  'CA': 'Canada', 'IN': 'India', 'UZ': 'Uzbekistan', 'PH': 'Philippines', 'HU': 'Hungary',
  'HR': 'Croatia', 'KW': 'Kuwait', 'NL': 'Netherlands', 'OM': 'Oman', 'NO': 'Norway',
  'IL': 'Israel', 'US': 'United States', 'NP': 'Nepal', 'NG': 'Nigeria', 'FR': 'France',
  'GE': 'Georgia', 'PY': 'Paraguay', 'PK': 'Pakistan', 'IS': 'Iceland', 'TH': 'Thailand',
  'BE': 'Belgium', 'VN': 'Vietnam', 'GR': 'Greece', 'BG': 'Bulgaria', 'CY': 'Cyprus',
  'IQ': 'Iraq', 'TW': 'Taiwan', 'BH': 'Bahrain', 'SA': 'Saudi Arabia', 'JM': 'Jamaica',
  'MK': 'North Macedonia', 'SI': 'Slovenia', 'AM': 'Armenia', 'IE': 'Ireland',
  'GT': 'Guatemala', 'LT': 'Lithuania', 'CR': 'Costa Rica', 'PT': 'Portugal', 'DK': 'Denmark',
  'UA': 'Ukraine', 'MY': 'Malaysia', 'RO': 'Romania', 'CZ': 'Czech Republic', 'RU': 'Russia',
  'MX': 'Mexico', 'AL': 'Albania', 'AE': 'United Arab Emirates', 'LU': 'Luxembourg',
  'MA': 'Morocco', 'GB': 'United Kingdom', 'ID': 'Indonesia', 'CL': 'Chile',
  'BA': 'Bosnia and Herzegovina', 'IT': 'Italy', 'SK': 'Slovakia', 'SE': 'Sweden',
  'RS': 'Serbia', 'ES': 'Spain', 'EE': 'Estonia', 'NZ': 'New Zealand', 'PR': 'Puerto Rico',
  'JP': 'Japan', 'AU': 'Australia', 'LV': 'Latvia', 'EC': 'Ecuador',
};

// Helpers
const handleApiError = (error: unknown): string => {
  console.error('API Error:', error);
  let errorMessage = 'An unknown error occurred';

  if (error instanceof Error) {
    errorMessage = error.message;
    if (error.message === 'Failed to fetch') {
      errorMessage = 'Network error: Unable to connect to validator. Please ensure the validator is running and accessible.';
    }
  }

  toast.error(errorMessage);
  return errorMessage;
};

const fetchWithTimeout = async (url: string, timeout = TIMEOUT_DURATION): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// API Functions
export const fetchCountries = async (validator: string): Promise<Country[]> => {
  try {
    const url = `http://localhost:5001/proxy/api/config/countries?target=${validator}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const countryCodes: string[] = await response.json();

    return countryCodes.map(code => ({
      code,
      name: COUNTRY_NAMES[code] || code,
    }));
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    handleApiError(isTimeout ? new Error('Request timeout: Validator did not respond in time') : error);
    return [];
  }
};

export const generateConfig = async (
  validator: string,
  country: string,
  leaseMinutes: number,
  format: 'text' | 'json'
): Promise<WireGuardConfig | null> => {
  try {
    const url = `http://localhost:5001/proxy/api/config/new?target=${validator}&format=${format}&geo=${country}&lease_minutes=${leaseMinutes}`;
    const response = await fetchWithTimeout(url, 100000);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const raw = await response.json();
    toast.success('Config generated successfully!');

    return {
      config: raw.peer_config,
      expiresAt: raw.expires_at,
    };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    handleApiError(isTimeout ? new Error('Request timeout: Validator did not respond in time') : error);
    return null;
  }
};

export const downloadConfig = (config: string): void => {
  const blob = new Blob([config], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tpn.conf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
  toast.success('Config downloaded successfully!');
};
