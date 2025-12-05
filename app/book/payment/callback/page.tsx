'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 20; // Maximum 20 retries (60 seconds total)

  useEffect(() => {
    // Get booking params from URL (passed back from payment gateway)
    const packageId = searchParams.get('packageId');
    const guests = searchParams.get('guests');
    const dateFrom = searchParams.get('dateFrom');

    // Reconstruct booking data from URL params if sessionStorage is empty
    const stored = sessionStorage.getItem('bookingDetails');
    if (!stored && packageId && guests && dateFrom) {
      // Reconstruct booking details from URL params
      const reconstructedDetails = {
        packageId,
        guests: parseInt(guests),
        dateFrom,
        specialRequests: '', // Not available from URL
      };
      sessionStorage.setItem('bookingDetails', JSON.stringify(reconstructedDetails));
    }

    // Get PesaPal payment gateway query parameters
    const orderTrackingId = searchParams.get('OrderTrackingId');

    // Determine transaction ID
    if (orderTrackingId) {
      setTransactionId(orderTrackingId);
      // Verify the payment with PesaPal
      verifyPayment(orderTrackingId);
    } else {
      // No transaction ID found
      setStatus('failed');
      setMessage('Invalid payment callback. No transaction ID found.');
    }
  }, [searchParams]);

  const verifyPayment = async (txId: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: txId,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const paymentStatus = data.data.paymentStatus;
        
        if (paymentStatus === 'completed') {
          setStatus('success');
          setMessage('Payment completed successfully!');
          setRetryCount(0); // Reset retry count on success
          
          // Get booking details from sessionStorage or reconstruct from URL
          const stored = sessionStorage.getItem('bookingDetails');
          const packageId = searchParams.get('packageId');
          const guests = searchParams.get('guests');
          const dateFrom = searchParams.get('dateFrom');
          
          let bookingDetails: any = null;
          if (stored) {
            bookingDetails = JSON.parse(stored);
          } else if (packageId && guests && dateFrom) {
            // Reconstruct from URL params
            bookingDetails = {
              packageId,
              guests: parseInt(guests),
              dateFrom,
              specialRequests: '',
            };
          }

          // Update or create booking confirmation in sessionStorage
          const bookingConfirmation = sessionStorage.getItem('bookingConfirmation');
          if (bookingConfirmation && bookingDetails) {
            const confirmation = JSON.parse(bookingConfirmation);
            confirmation.paymentStatus = 'completed';
            confirmation.transactionId = txId;
            // Ensure booking details are included
            confirmation.packageId = bookingDetails.packageId;
            confirmation.guests = bookingDetails.guests;
            confirmation.dateFrom = bookingDetails.dateFrom;
            sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmation));
          } else if (bookingDetails) {
            // Create new confirmation if it doesn't exist
            const confirmation = {
              ...bookingDetails,
              paymentStatus: 'completed',
              transactionId: txId,
              paymentProvider: 'pesapal',
            };
            sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmation));
          }

          // Redirect to confirmation page after 2 seconds
          setTimeout(() => {
            router.push('/book/confirm');
          }, 2000);
        } else if (paymentStatus === 'pending') {
          // Check if we've exceeded max retries
          if (retryCount >= MAX_RETRIES) {
            setStatus('failed');
            setMessage(
              'Payment verification timed out after multiple attempts. Your payment may still be processing on PesaPal\'s side. Please check your M-Pesa account or try again later.'
            );
            return;
          }
          
          setStatus('processing');
          setMessage(`Payment is still being processed. Please wait... (Checking ${retryCount + 1}/${MAX_RETRIES})`);
          
          // Increment retry count
          setRetryCount((prev) => prev + 1);
          
          // Retry verification with exponential backoff (3s, 4s, 5s, etc., max 10s)
          const delay = Math.min(3000 + (retryCount * 1000), 10000);
          setTimeout(() => {
            verifyPayment(txId);
          }, delay);
        } else {
          setStatus('failed');
          setMessage(data.data.message || 'Payment verification failed.');
        }
      } else {
        setStatus('failed');
        setMessage(data.error?.message || 'Failed to verify payment.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage('An error occurred while verifying payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <>
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto"></div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy mb-4">
              Processing Payment
            </h1>
            <p className="text-slate-600 mb-2">{message}</p>
            {transactionId && (
              <p className="text-sm text-slate-500">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            )}
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy mb-4">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-4">{message}</p>
            {transactionId && (
              <p className="text-sm text-slate-500 mb-6">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            )}
            <p className="text-sm text-slate-600 mb-6">
              Redirecting to confirmation page...
            </p>
            <Link href="/book/confirm">
              <button className="btn-primary w-full">
                Go to Confirmation →
              </button>
            </Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy mb-4">
              Payment Failed
            </h1>
            <p className="text-slate-600 mb-6">{message}</p>
            {transactionId && (
              <p className="text-sm text-slate-500 mb-4">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            )}
            {transactionId && (
              <div className="mb-6">
                <button
                  onClick={() => verifyPayment(transactionId)}
                  className="btn-outline w-full mb-2"
                >
                  Check Status Again
                </button>
                <p className="text-xs text-slate-400 text-center">
                  If payment was successful, click above to refresh status
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Link href="/book/payment" className="flex-1">
                <button className="btn-outline w-full">Try New Payment</button>
              </Link>
              <Link href="/packages" className="flex-1">
                <button className="btn-primary w-full">Back to Packages</button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

