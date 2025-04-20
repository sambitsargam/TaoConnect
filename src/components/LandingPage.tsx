import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Globe, Zap, Lock, Server, Clock } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Secure Your Connection
              <span className="text-primary-600 dark:text-primary-400"> Anywhere</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Generate and manage WireGuard configurations through TPN validators with ease.
              Enhanced security, global access, and seamless integration.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10"
            >
              <a
                href="#config"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg 
                         shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Get Started</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2
                        bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl" />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose TPN Frontend?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Experience the perfect blend of security, performance, and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Globe}
              title="Global Access"
              description="Connect through validators worldwide for optimal performance and reliability."
              delay={0.2}
            />
            <FeatureCard
              icon={Lock}
              title="Enhanced Security"
              description="WireGuard protocol ensures your connection remains private and secure."
              delay={0.4}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Quick configuration generation and minimal connection overhead."
              delay={0.6}
            />
            <FeatureCard
              icon={Server}
              title="Multiple Validators"
              description="Choose from various validators to ensure the best connection for your needs."
              delay={0.8}
            />
            <FeatureCard
              icon={Clock}
              title="Flexible Leases"
              description="Customize lease durations and receive expiry notifications."
              delay={1.0}
            />
            <FeatureCard
              icon={Shield}
              title="Easy Management"
              description="Simple interface for generating and managing your configurations."
              delay={1.2}
            />
          </div>
        </div>
      </section>

      {/* Config Section */}
      <section id="config" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Generate Your Configuration
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Get started with your secure connection in just a few clicks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;