import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Server } from 'lucide-react';
import { Validator } from '../types';

interface ValidatorSelectorProps {
  validators: Validator[];
  selectedValidator: string;
  onValidatorChange: (validator: string) => void;
  isLoading: boolean;
}

const ValidatorSelector: React.FC<ValidatorSelectorProps> = ({
  validators,
  selectedValidator,
  onValidatorChange,
  isLoading
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    onValidatorChange(value);
    setIsOpen(false);
  };

  const selectedLabel = validators.find(v => v.value === selectedValidator)?.label || 'Select Validator';

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Validator
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 
                  border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:border-primary-400 
                  dark:hover:border-primary-500 transition-all duration-200"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 truncate">
          <Server className="h-4 w-4 text-primary-500" />
          <span>{selectedLabel}</span>
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                    rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1" role="listbox">
            {validators.map((validator) => (
              <li
                key={validator.value}
                role="option"
                aria-selected={validator.value === selectedValidator}
                onClick={() => handleSelect(validator.value)}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 
                          ${validator.value === selectedValidator ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span>{validator.label}</span>
                </span>
                {validator.value === selectedValidator && (
                  <Check className="h-4 w-4 text-primary-500" />
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default ValidatorSelector;