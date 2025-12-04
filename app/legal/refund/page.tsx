import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - Mystical Vacations',
  description: 'Refund and cancellation policy for Mystical Vacations travel services',
};

export default function RefundPage() {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-navy prose-headings:font-serif prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-navy">
      <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
      <p className="text-slate-600 text-lg mb-8">
        Please review our refund and cancellation policies carefully before making a booking.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
        <p className="text-amber-800 font-semibold mb-2">Important Notice</p>
        <p className="text-amber-700 text-sm">
          Refund policies vary by service type. Please read the specific policy for your booking below. 
          All refund requests must be submitted in writing through our{' '}
          <a href="/contact" className="font-semibold">contact page</a>.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Standard Gauge Railway (SGR) / Train Tickets</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold">
            <strong>Strictly Non-Refundable once issued.</strong>
          </p>
        </div>
        <p>
          SGR train tickets are non-refundable and non-transferable once issued. This policy applies regardless of 
          the reason for cancellation, including but not limited to:
        </p>
        <ul>
          <li>Change of travel plans</li>
          <li>Medical emergencies</li>
          <li>Force majeure events</li>
          <li>No-show on the travel date</li>
        </ul>
        <p className="mt-4">
          We strongly recommend that you verify your travel dates and details before confirming your SGR booking. 
          Please ensure you have valid identification and arrive at the station at least 30 minutes before departure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Accommodation Bookings</h2>
        <p>
          Refund eligibility for accommodation bookings is <strong>subject to the specific hotel's cancellation policy</strong>. 
          Policies vary by property, but generally:
        </p>
        <ul>
          <li>
            <strong>Cancellation more than 7 days before check-in:</strong> Typically eligible for a 50% refund of 
            the accommodation cost (subject to the hotel's specific policy)
          </li>
          <li>
            <strong>Cancellation 7 days or less before check-in:</strong> Typically non-refundable (subject to the 
            hotel's specific policy)
          </li>
          <li>
            <strong>No-show:</strong> Non-refundable
          </li>
        </ul>
        <p className="mt-4">
          The exact cancellation policy for your specific accommodation will be clearly stated in your booking 
          confirmation email. We will communicate the hotel's policy to you at the time of booking.
        </p>
        <p className="mt-4">
          <strong>Processing Time:</strong> Approved refunds for accommodation bookings are typically processed within 
          14-21 business days, depending on the hotel's refund processing time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Safari Packages</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <p className="text-slate-800">
            <strong>20% Deposit is non-refundable</strong> once the booking is confirmed.
          </p>
        </div>
        <p>
          Safari package bookings require a 20% deposit to secure your reservation. This deposit is non-refundable 
          under normal circumstances. The remaining balance is due as specified in your booking confirmation.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Cancellation Timeline</h3>
        <ul>
          <li>
            <strong>More than 30 days before departure:</strong> 20% deposit is non-refundable. The remaining 80% 
            may be refunded, subject to a 10% administrative fee.
          </li>
          <li>
            <strong>15-30 days before departure:</strong> 20% deposit is non-refundable. 50% of the remaining balance 
            may be refunded, subject to a 10% administrative fee.
          </li>
          <li>
            <strong>7-14 days before departure:</strong> 20% deposit is non-refundable. 25% of the remaining balance 
            may be refunded, subject to a 10% administrative fee.
          </li>
          <li>
            <strong>Less than 7 days before departure:</strong> No refund available.
          </li>
          <li>
            <strong>No-show or early departure:</strong> No refund available.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Partial Cancellations</h3>
        <p>
          If you cancel part of your safari package (e.g., one person from a group booking), the refund policy above 
          applies proportionally. Additional fees may apply for itinerary modifications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Force Majeure and Exceptional Circumstances</h2>
        <p>
          In exceptional circumstances, exceptions to our standard refund policies may be considered. These exceptions 
          are evaluated on a case-by-case basis and require appropriate documentation.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Medical Emergencies</h3>
        <p>
          Refund requests due to medical emergencies may be considered if:
        </p>
        <ul>
          <li>You provide <strong>proof of medical emergency</strong> (e.g., medical certificate from a licensed physician)</li>
          <li>The medical emergency prevents you or a member of your travel party from traveling</li>
          <li>The request is submitted within 7 days of the medical emergency</li>
        </ul>
        <p className="mt-4">
          Even in medical emergencies, the 20% safari deposit remains non-refundable. However, we may offer credit 
          vouchers or partial refunds for the remaining balance, subject to review.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Force Majeure Events</h3>
        <p>
          Force majeure events are circumstances beyond our control that make travel impossible or unsafe. These include:
        </p>
        <ul>
          <li>Political instability, civil unrest, or government travel advisories</li>
          <li>Natural disasters (earthquakes, floods, severe weather)</li>
          <li>Pandemics or public health emergencies</li>
          <li>War, terrorism, or security threats</li>
          <li>Airport or border closures</li>
          <li>Other events that make travel impossible or unsafe</li>
        </ul>
        <p className="mt-4">
          In the event of force majeure:
        </p>
        <ul>
          <li>We will work with you to reschedule your travel (subject to availability)</li>
          <li>If rescheduling is not possible, we may offer credit vouchers valid for 12-24 months</li>
          <li>Partial refunds may be considered, minus non-refundable costs already paid to service providers</li>
          <li><strong>SGR tickets remain non-refundable even in force majeure situations</strong></li>
        </ul>
        <p className="mt-4">
          <strong>Note:</strong> Force majeure determinations are made at our sole discretion based on official 
          advisories and circumstances. We are not responsible for additional costs incurred due to force majeure 
          events (e.g., alternative flights, accommodation).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Refund Processing</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">5.1 How to Request a Refund</h3>
        <p>To request a refund:</p>
        <ol>
          <li>Submit your request in writing through our{' '}
            <a href="/contact">contact page</a>
          </li>
          <li>Include your booking reference number</li>
          <li>Provide a clear reason for cancellation</li>
          <li>Attach any required documentation (e.g., medical certificates for medical emergencies)</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Processing Time</h3>
        <p>
          Refund requests are typically reviewed within 5-7 business days. Once approved:
        </p>
        <ul>
          <li>Refunds to the original payment method: 14-21 business days</li>
          <li>Refunds to M-Pesa: 5-10 business days</li>
          <li>Credit vouchers: Issued within 3-5 business days</li>
        </ul>
        <p className="mt-4">
          Processing times may vary depending on your payment provider and banking institution.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Refund Method</h3>
        <p>
          Refunds will be processed to the original payment method used for the booking. If the original payment 
          method is no longer available, we will contact you to arrange an alternative refund method.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Administrative Fees</h2>
        <p>
          The following administrative fees may apply to refunds:
        </p>
        <ul>
          <li>Safari package cancellations: 10% of the refundable amount</li>
          <li>Accommodation cancellations: As specified by the hotel (typically included in the cancellation policy)</li>
          <li>Payment processing fees: Non-refundable (as per our Terms of Service)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Travel Insurance</h2>
        <p>
          We strongly recommend that you purchase comprehensive travel insurance that covers trip cancellation, 
          medical emergencies, and force majeure events. Travel insurance may provide coverage for non-refundable 
          costs that are not covered by our refund policy.
        </p>
        <p className="mt-4">
          Mystical Vacations is not responsible for refunding costs that should be covered by your travel insurance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
        <p>
          We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with 
          an updated "Last Updated" date. The policy in effect at the time of your booking will apply to your 
          reservation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>
          If you have questions about our refund policy or need to submit a refund request, please contact us through 
          our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          By making a booking with Mystical Vacations, you acknowledge that you have read, understood, and agree to 
          be bound by this Refund Policy.
        </p>
      </div>
    </div>
  );
}

