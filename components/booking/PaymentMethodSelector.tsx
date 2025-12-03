'use client';

import { motion } from 'framer-motion';
import { getAllPaymentProviders } from '@/lib/payments';
import type { PaymentProviderName } from '@/lib/payments';

interface PaymentMethodSelectorProps {
  selectedProvider: PaymentProviderName | null;
  onProviderSelect: (provider: PaymentProviderName) => void;
}

export default function PaymentMethodSelector({
  selectedProvider,
  onProviderSelect,
}: PaymentMethodSelectorProps) {
  const providers = getAllPaymentProviders();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy mb-4">Choose Payment Gateway</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => {
          const isSelected = selectedProvider === provider.name;
          
          return (
            <motion.button
              key={provider.name}
              type="button"
              onClick={() => onProviderSelect(provider.name)}
              className={`p-6 border-2 rounded-lg transition-all text-left ${
                isSelected
                  ? 'border-gold bg-gold/10 shadow-md'
                  : 'border-slate-300 hover:border-gold/50 bg-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-gold bg-gold'
                          : 'border-slate-400'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <h4 className="font-semibold text-navy text-lg">
                      {provider.displayName}
                    </h4>
                  </div>
                  
                  {provider.name === 'pesapal' && (
                    <div className="text-sm text-slate-600 space-y-1 ml-8">
                      <p>✓ Native M-Pesa Experience</p>
                      <p>✓ Trusted Local Standard</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Fees: ~3.5% (Card) / ~2.9-3.5% (M-Pesa)
                      </p>
                    </div>
                  )}
                  
                  {provider.name === 'flutterwave' && (
                    <div className="text-sm text-slate-600 space-y-1 ml-8">
                      <p>✓ Modern & Easy Integration</p>
                      <p>✓ Superior Recurring Billing</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Fees: 3.2% (Card) / 2.9% (M-Pesa)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
        >
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Selected:</span>{' '}
            {providers.find((p) => p.name === selectedProvider)?.displayName}
          </p>
        </motion.div>
      )}
    </div>
  );
}

