'use client';

import { useState, useTransition } from 'react';
import { initiateTestPayment } from './actions';

/**
 * Test Payment Page
 * 
 * Simple page to test PesaPal payment integration with a 10 KES payment
 */
export default function TestPaymentPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    // Clear previous errors
    setError(null);

    // Start the server action
    startTransition(async () => {
      const result = await initiateTestPayment();

      // If we get here, it means there was an error
      // (successful calls will redirect and never return)
      if (result && !result.success) {
        // Display error
        setError(result.error);
      }
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          PesaPal Payment Test
        </h1>

        <p style={{ marginBottom: '30px', color: '#666' }}>
          Click the button below to initiate a test payment of 10 KES
        </p>

        {/* Error Display */}
        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isPending}
          style={{
            backgroundColor: isPending ? '#ccc' : '#0A192F',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '4px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = '#112240';
            }
          }}
          onMouseOut={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = '#0A192F';
            }
          }}
        >
          {isPending ? 'Processing...' : 'Pay 10 KES (Test)'}
        </button>

        {/* Info Text */}
        <p
          style={{
            marginTop: '30px',
            fontSize: '12px',
            color: '#999',
          }}
        >
          This will redirect you to PesaPal checkout page
        </p>
      </div>
    </div>
  );
}

