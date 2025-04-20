import toast from 'react-hot-toast';
import { APIResponse, Country, WireGuardConfig } from '../types';

const handleApiError = (error: unknown): string => {
  console.error('API Error:', error);

  // Provide more specific error messages based on error type
  let errorMessage = 'An unknown error occurred';

  if (error instanceof Error) {
    errorMessage = error.message;

    // Handle network errors specifically
    if (error.message === 'Failed to fetch') {
      errorMessage = 'Network error: Unable to connect to validator. Please ensure the validator is running and accessible.';
    }
  }

  toast.error(errorMessage);
  return errorMessage;
};

export const fetchCountries = async (validator: string): Promise<Country[]> => {
  try {
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Use this instead of directly hitting http://${validator}
    const response = await fetch(`http://localhost:5001/proxy/api/config/countries?target=${validator}`, {
      signal: controller.signal
    });
    


    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
 // Assuming the response is an array of country codes
 const countryCodes: string[] = await response.json();
    
 const countryNames: { [key: string]: string } = {
  'DE': 'Germany',
  'TR': 'Turkey',
  'FI': 'Finland',
  'MD': 'Moldova',
  'MM': 'Myanmar',
  'BR': 'Brazil',
  'EG': 'Egypt',
  'AT': 'Austria',
  'ZA': 'South Africa',
  'AZ': 'Azerbaijan',
  'MT': 'Malta',
  'CO': 'Colombia',
  'PE': 'Peru',
  'KR': 'South Korea',
  'KZ': 'Kazakhstan',
  'BY': 'Belarus',
  'KG': 'Kyrgyzstan',
  'KH': 'Cambodia',
  'SG': 'Singapore',
  'QA': 'Qatar',
  'CA': 'Canada',
  'IN': 'India',
  'UZ': 'Uzbekistan',
  'PH': 'Philippines',
  'HU': 'Hungary',
  'HR': 'Croatia',
  'KW': 'Kuwait',
  'NL': 'Netherlands',
  'OM': 'Oman',
  'NO': 'Norway',
  'IL': 'Israel',
  'US': 'United States',
  'NP': 'Nepal',
  'NG': 'Nigeria',
  'FR': 'France',
  'GE': 'Georgia',
  'PY': 'Paraguay',
  'PK': 'Pakistan',
  'IS': 'Iceland',
  'TH': 'Thailand',
  'BE': 'Belgium',
  'VN': 'Vietnam',
  'GR': 'Greece',
  'BG': 'Bulgaria',
  'CY': 'Cyprus',
  'IQ': 'Iraq',
  'TW': 'Taiwan',
  'BH': 'Bahrain',
  'SA': 'Saudi Arabia',
  'JM': 'Jamaica',
  'MK': 'North Macedonia',
  'SI': 'Slovenia',
  'AM': 'Armenia',
  'IE': 'Ireland',
  'GT': 'Guatemala',
  'LT': 'Lithuania',
  'CR': 'Costa Rica',
  'PT': 'Portugal',
  'DK': 'Denmark',
  'UA': 'Ukraine',
  'MY': 'Malaysia',
  'RO': 'Romania',
  'CZ': 'Czech Republic',
  'RU': 'Russia',
  'MX': 'Mexico',
  'AL': 'Albania',
  'AE': 'United Arab Emirates',
  'LU': 'Luxembourg',
  'MA': 'Morocco',
  'GB': 'United Kingdom',
  'ID': 'Indonesia',
  'CL': 'Chile',
  'BA': 'Bosnia and Herzegovina',
  'IT': 'Italy',
  'SK': 'Slovakia',
  'SE': 'Sweden',
  'RS': 'Serbia',
  'ES': 'Spain',
  'EE': 'Estonia',
  'NZ': 'New Zealand',
  'PR': 'Puerto Rico',
  'JP': 'Japan',
  'AU': 'Australia',
  'LV': 'Latvia',
  'EC': 'Ecuador'
};


 // Map country codes to names
 const countries: Country[] = countryCodes.map(code => ({
   code,
   name: countryNames[code] || code,  // If country name not found, use code
 }));

 return countries;
} catch (error) {
 if (error instanceof DOMException && error.name === 'AbortError') {
   handleApiError(new Error('Request timeout: Validator did not respond in time'));
 } else {
   handleApiError(error);
 }
 
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
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const proxyUrl = `http://localhost:5001/proxy/api/config/new?target=${validator}&format=${format}&geo=${country}&lease_minutes=${leaseMinutes}`;
    const response = await fetch(proxyUrl, { signal: controller.signal });



    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: APIResponse<WireGuardConfig> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to generate config');
    }

    toast.success('Config generated successfully!');
    return data.data;
  } catch (error) {
    // Handle AbortError specifically
    if (error instanceof DOMException && error.name === 'AbortError') {
      handleApiError(new Error('Request timeout: Validator did not respond in time'));
    } else {
      handleApiError(error);
    }

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