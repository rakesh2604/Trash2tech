'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
        <h1 style={{ color: '#b91c1c', marginBottom: '1rem' }}>Something went wrong</h1>
        <p style={{ color: '#374151', marginBottom: '1rem' }}>{error.message}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1e3a5f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
