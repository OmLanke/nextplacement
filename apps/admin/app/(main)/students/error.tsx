'use client';

import { useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Students page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="text-muted-foreground text-center">
          Failed to load students data. Please try again.
        </p>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}
