import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface BookingReceiptProps {
  reference: string;
  customerName: string;
  amount: number;
  currency: string;
  tripDate: string;
  items: string[];
  link: string;
}

export default function BookingReceipt({
  reference,
  customerName,
  amount,
  currency,
  tripDate,
  items,
  link,
}: BookingReceiptProps) {
  // Format amount with currency
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency || 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Html>
      <Head />
      <Preview>Your Mystical Vacations trip is confirmed! Reference: {reference}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={headerText}>MYSTICAL VACATIONS</Heading>
          </Section>

          {/* Greeting */}
          <Section style={contentSection}>
            <Text style={greeting}>Jambo {customerName},</Text>
            <Text style={bodyText}>
              Your journey to East Africa is confirmed. We are thrilled to welcome you.
            </Text>
          </Section>

          {/* Summary Table */}
          <Section style={tableSection}>
            <table style={table} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={tableLabel}>Reference:</td>
                  <td style={tableValue}>{reference}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Amount Paid:</td>
                  <td style={tableValue}>{formattedAmount}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Status:</td>
                  <td style={tableValue}>
                    <span style={statusBadge}>PAID</span>
                  </td>
                </tr>
                <tr>
                  <td style={tableLabel}>Trip Start Date:</td>
                  <td style={tableValue}>{tripDate}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Items List */}
          {items.length > 0 && (
            <Section style={itemsSection}>
              <Text style={itemsHeading}>Your Booking Includes:</Text>
              <ul style={itemsList}>
                {items.map((item, index) => (
                  <li key={index} style={itemStyle}>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Link href={link} style={button}>
              Manage My Booking
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>Questions? Reply to this email.</Text>
            <Text style={footerText}>
              We're here to help make your journey unforgettable.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const headerSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '2px solid #D4AF37',
};

const headerText = {
  color: '#D4AF37',
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0',
  padding: '0',
};

const contentSection = {
  marginBottom: '32px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#0A192F',
  margin: '0 0 16px 0',
};

const bodyText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#475569',
  margin: '0 0 16px 0',
};

const tableSection = {
  marginBottom: '32px',
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '8px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#64748b',
  padding: '8px 12px 8px 0',
  textAlign: 'left' as const,
  verticalAlign: 'top',
};

const tableValue = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#0A192F',
  padding: '8px 0',
  textAlign: 'right' as const,
};

const statusBadge = {
  display: 'inline-block',
  backgroundColor: '#10b981',
  color: '#ffffff',
  padding: '4px 12px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
};

const itemsSection = {
  marginBottom: '32px',
};

const itemsHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0A192F',
  margin: '0 0 12px 0',
};

const itemsList = {
  margin: '0',
  paddingLeft: '20px',
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
};

const itemStyle = {
  marginBottom: '8px',
};

const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#D4AF37',
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footerSection = {
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '8px 0',
  lineHeight: '20px',
};

