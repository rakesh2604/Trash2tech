import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata = {
  title: "India's Traceable E-Waste Network | Compliance-Grade Collection",
  description: 'Compliance-grade e-waste collection and traceability infrastructure. Citizens, hubs, recyclers, EPR. Book pickup via WhatsApp or missed call.',
  icons: { icon: '/favicon.svg', type: 'image/svg+xml' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Suppress unhandled errors from browser extensions (e.g. MetaMask) so they don't break the app overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                function isExtensionError(src) {
                  return String(src || '').indexOf('chrome-extension://') === 0 || String(src || '').indexOf('moz-extension://') === 0;
                }
                window.addEventListener('error', function(e) {
                  var src = e.filename || (e.error && e.error.stack) || '';
                  if (isExtensionError(src)) { e.preventDefault(); e.stopPropagation(); return true; }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var stack = (e.reason && (e.reason.stack || e.reason.message)) || '';
                  if (isExtensionError(stack) || (e.reason && /MetaMask|ethereum|wallet/i.test(String(e.reason.message)))) {
                    e.preventDefault();
                  }
                });
              } catch (_) {}
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:text-white focus:outline-none">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

