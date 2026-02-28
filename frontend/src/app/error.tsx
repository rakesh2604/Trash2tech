'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-4 max-w-md">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
