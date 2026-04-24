'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ResidentialDesignPlatformRedirect() {
  useEffect(() => {
    window.location.replace('/projects/bloom-hub');
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-24">
      <div className="mx-auto max-w-xl">
        <p className="label mb-4 block">Redirecting</p>
        <h1 className="mb-6 text-3xl font-light">Residential Design Platform moved to Bloom Hub.</h1>
        <Link
          href="/projects/bloom-hub"
          className="text-sm text-muted transition-colors duration-300 hover:text-black dark:hover:text-white"
        >
          Open Bloom Hub
        </Link>
      </div>
    </main>
  );
}
