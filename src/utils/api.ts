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
    
    const response = await fetch(`http://${validator}/api/config/countries`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: APIResponse<Country[]> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch countries');
    }
    
    return data.data;
  } catch (error) {
    // Handle AbortError specifically
    if (error instanceof DOMException && error.name === 'AbortError') {
      handleApiError(new Error('Request timeout: Validator did not respond in time'));
    } else {
      handleApiError(error);
    }
    
    // Return empty array as fallback
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
    
    const url = `http://${validator}/api/config/new?format=${format}&geo=${country}&lease_minutes=${leaseMinutes}`;
    const response = await fetch(url, {
      signal: controller.signal
    });
    
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