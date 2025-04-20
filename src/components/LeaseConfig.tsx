import React from 'react';
import { Clock, FileText } from 'lucide-react';

interface LeaseConfigProps {
  leaseMinutes: number;
  onLeaseMinutesChange: (value: number) => void;
  format: 'text' | 'json';
  onFormatChange: (format: 'text' | 'json') => void;
  alertBeforeExpiry: number;
  onAlertBeforeExpiryChange: (value: number) => void;
  onGenerateConfig: () => void;
  isGenerating: boolean;
}

const LeaseConfig: React.FC<LeaseConfigProps> = ({
  leaseMinutes,
  onLeaseMinutesChange,
  format,
  onFormatChange,
  alertBeforeExpiry,
  onAlertBeforeExpiryChange,
  onGenerateConfig,
  isGenerating
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Lease Duration (minutes)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={leaseMinutes}
            onChange={(e) => onLeaseMinutesChange(parseFloat(e.target.value))}
            min="0.5"
            step="0.5"
            className="input pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Config Format
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as 'text' | 'json')}
            className="select pl-10"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alert Before Expiry (seconds)
        </label>
        <input
          type="number"
          value={alertBeforeExpiry}
          onChange={(e) => onAlertBeforeExpiryChange(parseInt(e.target.value))}
          min="0"
          className="input"
        />
      </div>

      <button
        onClick={onGenerateConfig}
        disabled={isGenerating || leaseMinutes < 0.5}
        className="btn-primary w-full mt-4 flex items-center justify-center transition-transform active:scale-95"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Config'
        )}
      </button>
    </div>
  );
};

export default LeaseConfig;