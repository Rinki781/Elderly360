import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Toast } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'ELDERLY360 | Proactive Elderly Care Continuity & Routine Drift Detection',
  description:
    'Noticing when elderly care quietly slips. Care Continuity Score, routine drift detection, explainable factors, and automated escalation ladder.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AppProvider>
          {children}
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
