import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Info, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';

import ValidatorSelector from './components/ValidatorSelector';
import CountrySelector from './components/CountrySelector';
import LeaseConfig from './components/LeaseConfig';
import ConfigDisplay from './components/ConfigDisplay';
import ThemeToggle from './components/ThemeToggle';
import NotificationControl from './components/NotificationControl';
import LandingPage from './components/LandingPage';

import { Country, LeaseConfig as LeaseConfigType, Validator, WireGuardConfig } from './types';
import { fetchCountries, generateConfig } from './utils/api';
import useLocalStorage from './hooks/useLocalStorage';
import useNotifications from './hooks/useNotifications';

// Mock validators - in a real app these could be fetched or configured
const VALIDATORS: Validator[] = [
  { value: '185.189.44.166:3000', label: 'Validator 1 (185.189.44.166:3000)' },
  { value: '185.141.218.102:3000', label: 'Validator 2 (185.141.218.102:3000)' },
  { value: 'localhost:3000', label: 'Local (Development)' },
];

const DEFAULT_CONFIG: LeaseConfigType = {
  validator: VALIDATORS[0].value,
  country: 'any',
  leaseMinutes: 60,
  format: 'json',
  alertBeforeExpiry: 60,
};

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useLocalStorage('tpn-darkMode', window.matchMedia('(prefers-color-scheme: dark)').matches);

  // User preferences
  const [config, setConfig] = useLocalStorage<LeaseConfigType>('tpn-config', DEFAULT_CONFIG);

  // UI states
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isGeneratingConfig, setIsGeneratingConfig] = useState(false);

  // Generated config
  const [wireGuardConfig, setWireGuardConfig] = useState<WireGuardConfig | null>(null);

  // Notification timer
  const notificationTimerRef = useRef<number>(-1);
  const { scheduleNotification, cancelNotification } = useNotifications();

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch countries when validator changes
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoadingCountries(true);
      setCountries([]);

      try {
        const fetchedCountries = await fetchCountries(config.validator);
        setCountries(fetchedCountries);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, [config.validator]);

  // Schedule notification for config expiry
  useEffect(() => {
    if (notificationTimerRef.current > 0) {
      cancelNotification(notificationTimerRef.current);
      notificationTimerRef.current = -1;
    }

    if (wireGuardConfig && config.alertBeforeExpiry > 0) {
      const expiryTime = wireGuardConfig.expiresAt;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      const notificationTime = timeUntilExpiry - (config.alertBeforeExpiry );

      // console all
      console.log('Current Time:', new Date(currentTime).toLocaleString());
      console.log('Expiry Time:', new Date(expiryTime).toLocaleString());
      console.log('Time Until Expiry:', timeUntilExpiry / 1000, 'seconds');
      console.log('Notification Time:', notificationTime / 1000, 'seconds');
      console.log('Alert Before Expiry:', config.alertBeforeExpiry, 'seconds');
      console.log('Notification Time:', notificationTime / 1000, 'seconds');

      if (notificationTime > 0) {
        notificationTimerRef.current = scheduleNotification(
          'TPN Lease Expiring',
          `Your TPN lease expires in ${config.alertBeforeExpiry} seconds.`,
          notificationTime
        );
      }
    }

    return () => {
      if (notificationTimerRef.current > 0) {
        cancelNotification(notificationTimerRef.current);
      }
    };
  }, [wireGuardConfig, config.alertBeforeExpiry, cancelNotification, scheduleNotification]);

  const handleValidatorChange = (validator: string) => {
    setConfig({ ...config, validator });
    setWireGuardConfig(null);
  };

  const handleCountryChange = (country: string) => {
    setConfig({ ...config, country });
    setWireGuardConfig(null);
  };

  const handleLeaseMinutesChange = (leaseMinutes: number) => {
    setConfig({ ...config, leaseMinutes });
    setWireGuardConfig(null);
  };

  const handleFormatChange = (format: 'text' | 'json') => {
    setConfig({ ...config, format });
    setWireGuardConfig(null);
  };

  const handleAlertBeforeExpiryChange = (alertBeforeExpiry: number) => {
    setConfig({ ...config, alertBeforeExpiry });
  };

  const handleGenerateConfig = async () => {
    setIsGeneratingConfig(true);

    try {
      const result = await generateConfig(
        config.validator,
        config.country,
        config.leaseMinutes,
        config.format
      );

      if (result) {
        setWireGuardConfig(result);
      }
    } catch (error) {
      toast.error('Failed to generate config');
      console.error(error);
    } finally {
      setIsGeneratingConfig(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <WifiOff className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Tao Connect</h1>
            </div>
            <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      <LandingPage />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lease Configuration */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Lease Configuration</h2>

              <div className="space-y-6">
                <ValidatorSelector
                  validators={VALIDATORS}
                  selectedValidator={config.validator}
                  onValidatorChange={handleValidatorChange}
                  isLoading={isLoadingCountries}
                />

                <CountrySelector
                  countries={countries}
                  selectedCountry={config.country}
                  onCountryChange={handleCountryChange}
                  isLoading={isLoadingCountries}
                />

                <LeaseConfig
                  leaseMinutes={config.leaseMinutes}
                  onLeaseMinutesChange={handleLeaseMinutesChange}
                  format={config.format}
                  onFormatChange={handleFormatChange}
                  alertBeforeExpiry={config.alertBeforeExpiry}
                  onAlertBeforeExpiryChange={handleAlertBeforeExpiryChange}
                  onGenerateConfig={handleGenerateConfig}
                  isGenerating={isGeneratingConfig}
                />

                <NotificationControl hasConfig={!!wireGuardConfig} />
              </div>
            </div>

            {/* WireGuard Configuration */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">WireGuard Configuration</h2>

              {wireGuardConfig ? (
                <ConfigDisplay
                  config={wireGuardConfig.config}
                  expiresAt={wireGuardConfig.expiresAt}
                />
              ) : (
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center h-60 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                  <Info className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Configuration</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                    Select a validator, choose your settings, and click "Generate Config" to create a new WireGuard configuration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}

export default App;