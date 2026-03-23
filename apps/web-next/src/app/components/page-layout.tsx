import type { ReactNode } from 'react';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      aria-labelledby="profile-images-heading"
    >
      {children}
    </section>
  );
}
