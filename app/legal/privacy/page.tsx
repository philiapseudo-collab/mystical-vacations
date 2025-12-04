import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Mystical Vacations',
  description: 'Privacy policy explaining how Mystical Vacations collects, uses, and protects your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-navy prose-headings:font-serif prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-navy">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-slate-600 text-lg mb-8">
        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Mystical Vacations ("we," "our," or "us") is committed to protecting your privacy and personal data. This Privacy 
          Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
        </p>
        <p className="mt-4">
          This policy complies with the <strong>General Data Protection Regulation (GDPR)</strong> and the{' '}
          <strong>Data Protection Act, 2019 (Kenya)</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p>We collect the following types of personal information:</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Identification Information</h3>
        <ul>
          <li><strong>Name:</strong> To process your bookings and communicate with you</li>
          <li><strong>Phone Number:</strong> Required for M-Pesa payment processing and to contact you regarding your bookings</li>
          <li><strong>Email Address:</strong> To send booking confirmations, updates, and important travel information</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Booking Information</h3>
        <ul>
          <li>Travel dates and destinations</li>
          <li>Accommodation preferences</li>
          <li>Number of travelers</li>
          <li>Special requests or requirements</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Payment Information</h3>
        <p>
          We do not store your full payment card details. Payment processing is handled securely by our payment providers 
          (PesaPal and Flutterwave). We only receive confirmation of successful payments.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.4 Technical Information</h3>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Website usage data (cookies and similar technologies)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p>We use your personal information for the following purposes:</p>
        <ul>
          <li>To process and manage your bookings</li>
          <li>To communicate with you about your travel arrangements</li>
          <li>To process payments through M-Pesa and card payment systems</li>
          <li>To send booking confirmations and travel documents</li>
          <li>To provide customer support and respond to inquiries</li>
          <li>To improve our services and website functionality</li>
          <li>To comply with legal obligations</li>
          <li>To send marketing communications (only with your consent)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
        <p>We share your personal information only with the following parties:</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Payment Processors</h3>
        <p>
          We share necessary payment information with <strong>PesaPal</strong> to process M-Pesa and card transactions. 
          PesaPal handles all payment processing securely and in accordance with their own privacy policies.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Service Providers</h3>
        <p>
          We share booking information with our service providers to fulfill your travel arrangements:
        </p>
        <ul>
          <li><strong>Hotels and Accommodation Providers:</strong> To secure your reservations</li>
          <li><strong>Standard Gauge Railway (SGR):</strong> To book train tickets</li>
          <li><strong>Tour Operators and Safari Companies:</strong> To arrange your safari experiences</li>
          <li><strong>Transport Providers:</strong> To organize transfers and transportation</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Legal Requirements</h3>
        <p>
          We may disclose your information if required by law, court order, or government regulation, or to protect our 
          rights, property, or safety, or that of our customers or others.
        </p>

        <p className="mt-4">
          <strong>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul>
          <li>Encryption of data in transit (SSL/TLS)</li>
          <li>Secure storage of data</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication</li>
          <li>Staff training on data protection</li>
        </ul>
        <p className="mt-4">
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to 
          protect your information, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
          policy, unless a longer retention period is required or permitted by law. Booking information is typically 
          retained for 7 years for accounting and legal compliance purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
        <p>Under GDPR and the Data Protection Act, 2019 (Kenya), you have the following rights:</p>
        <ul>
          <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal obligations)</li>
          <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your information</li>
          <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service provider</li>
          <li><strong>Right to Object:</strong> Object to processing of your information for certain purposes</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please contact us through our{' '}
          <a href="/contact">contact page</a>. We will respond to your request within 30 days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and 
          personalize content. You can control cookie preferences through your browser settings. For more information, 
          please refer to our cookie policy or contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries outside Kenya and Tanzania, including countries 
          that may not have the same data protection laws. We ensure that appropriate safeguards are in place to protect 
          your information in accordance with this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 18. We do not knowingly collect personal 
          information from children. If you believe we have collected information from a child, please contact us 
          immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 
          "Last Updated" date. We encourage you to review this policy periodically to stay informed about how we 
          protect your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please 
          contact us through our{' '}
          <a href="/contact">contact page</a>.
        </p>
        <p className="mt-4">
          You also have the right to lodge a complaint with the relevant data protection authority:
        </p>
        <ul>
          <li><strong>Kenya:</strong> Office of the Data Protection Commissioner</li>
          <li><strong>EU:</strong> Your local data protection authority</li>
        </ul>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          By using Mystical Vacations services, you acknowledge that you have read and understood this Privacy Policy 
          and consent to the collection, use, and disclosure of your information as described herein.
        </p>
      </div>
    </div>
  );
}

