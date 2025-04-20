import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Country } from '../types';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  isLoading: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onCountryChange,
  isLoading
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    onCountryChange(value);
    setIsOpen(false);
  };

  const selectedName = isLoading 
    ? 'Loading countries...' 
    : countries.length === 0 
    ? 'No countries available' 
    : countries.find(c => c.code === selectedCountry)?.name || 'Any country';

  const allCountries = [{code: 'any', name: 'Any country'}, ...countries];

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Country
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || countries.length === 0}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 
                  border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:border-primary-400 
                  dark:hover:border-primary-500 transition-all duration-200"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 truncate">
          <Globe className="h-4 w-4 text-primary-500" />
          <span>{selectedName}</span>
        </span>
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
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
            {allCountries.map((country) => (
              <li
                key={country.code}
                role="option"
                aria-selected={country.code === selectedCountry}
                onClick={() => handleSelect(country.code)}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 
                          ${country.code === selectedCountry ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <span>{country.name}</span>
                </span>
                {country.code === selectedCountry && (
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

export default CountrySelector;