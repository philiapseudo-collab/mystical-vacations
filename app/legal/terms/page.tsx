import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Mystical Vacations',
  description: 'Terms and conditions for booking travel services with Mystical Vacations',
};

export default function TermsPage() {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-navy prose-headings:font-serif prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-navy">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-slate-600 text-lg mb-8">
        Please read these terms carefully before booking with Mystical Vacations.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
        <p>
          By accessing and using the services of Mystical Vacations, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Jurisdiction and Governing Law</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the <strong>Republic of Kenya</strong>. 
          Any disputes arising from or relating to these terms or our services shall be subject to the exclusive jurisdiction 
          of the courts of the Republic of Kenya.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Booking and Payment</h2>
        <p>
          When you make a booking through Mystical Vacations, you agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Pay all applicable fees and charges in full</li>
          <li>Comply with all travel requirements, including visas and health documentation</li>
        </ul>
        <p className="mt-4">
          <strong>Transaction Fees:</strong> The Customer is responsible for all applicable transaction fees charged by 
          payment providers (e.g., M-Pesa, Credit Card processors). These fees are separate from the booking amount and 
          will be clearly displayed during the payment process.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Service Modifications</h2>
        <p>
          Mystical Vacations reserves the right to modify, cancel, or reschedule services due to circumstances beyond our 
          control, including but not limited to weather conditions, political instability, or force majeure events. In such 
          cases, we will make reasonable efforts to provide alternative arrangements or refunds as per our Refund Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Customer Responsibilities</h2>
        <p>You are responsible for:</p>
        <ul>
          <li>Ensuring you have valid travel documents (passport, visas, health certificates)</li>
          <li>Arriving on time for scheduled services (flights, tours, transfers)</li>
          <li>Complying with local laws and regulations in Kenya and Tanzania</li>
          <li>Respecting the environment and local communities during your travels</li>
          <li>Obtaining appropriate travel insurance</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p>
          Mystical Vacations acts as an intermediary between you and service providers (hotels, airlines, tour operators). 
          We are not liable for any loss, damage, injury, or expense arising from:
        </p>
        <ul>
          <li>Acts or omissions of third-party service providers</li>
          <li>Force majeure events beyond our control</li>
          <li>Your failure to comply with travel requirements or local laws</li>
          <li>Personal belongings or valuables</li>
        </ul>
        <p className="mt-4">
          Our liability is limited to the amount paid for the specific service in question.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
        <p>
          All content on the Mystical Vacations website, including text, images, logos, and designs, is the property of 
          Mystical Vacations and is protected by copyright and trademark laws. You may not reproduce, distribute, or use 
          any content without our written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
        <p>
          Your use of our services is also governed by our{' '}
          <a href="/legal/privacy">Privacy Policy</a>, which explains how we collect, use, and protect your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
        <p>
          Mystical Vacations reserves the right to modify these Terms of Service at any time. Changes will be effective 
          immediately upon posting on our website. Your continued use of our services after changes are posted constitutes 
          acceptance of the modified terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us through our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          By using Mystical Vacations services, you acknowledge that you have read, understood, and agree to be bound by 
          these Terms of Service.
        </p>
      </div>
    </div>
  );
}

