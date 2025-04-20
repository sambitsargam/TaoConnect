import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { downloadConfig } from '../utils/api';

interface ConfigDisplayProps {
  config: string | null;
  expiresAt: number | null;
}

const ConfigDisplay: React.FC<ConfigDisplayProps> = ({ config, expiresAt }) => {
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (!config) return;
    
    navigator.clipboard.writeText(config)
      .then(() => toast.success('Config copied to clipboard!'))
      .catch(() => toast.error('Failed to copy config'));
  };

  const handleDownload = () => {
    if (!config) return;
    downloadConfig(config);
  };

  if (!config) return null;

  const formattedExpiryTime = expiresAt 
    ? format(new Date(expiresAt), 'MMMM d, yyyy h:mm:ss a')
    : 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 glass-card overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium">WireGuard Configuration</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 rounded-md text-primary-700 dark:text-primary-300 transition-colors"
            title="Download config"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <pre
          ref={preRef}
          className="p-4 bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono rounded-b-xl"
        >
          {config}
        </pre>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm">
        <span className="font-medium">Expires at:</span> {formattedExpiryTime}
      </div>
    </motion.div>
  );
};

export default ConfigDisplay;