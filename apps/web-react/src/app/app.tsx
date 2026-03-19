import { useEffect, useState } from 'react';
import { fetchProfile } from '@hunqz/shared/images';
import type { Profile } from '@hunqz/shared/images';

// Browser cannot read JSON from hunqz.com cross-origin (CORS). Use same-origin `/api/...`;
// Vite proxies `/api` → hunqz.com (see vite.config.mts). Next.js app fetches from the server instead.

type LoadState = 'loading' | 'success' | 'error';

export default function App() {
  const [state, setState] = useState<LoadState>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProfile({ baseUrl: '' })
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setState('success');
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load profile';
          setErrorMessage(message);
          setProfile(null);
          setState('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const images = profile?.images.slice(0, 6) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Hunqz profile images</h1>
        <p className="mt-3 text-sm text-slate-600">Client-rendered SPA using shared domain data.</p>
      </header>

      {state === 'loading' && (
        <p className="mt-8 text-slate-600" role="status" aria-live="polite">
          Loading profile images…
        </p>
      )}

      {state === 'error' && (
        <div
          className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-medium">Could not load images</p>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      )}

      {state === 'success' && profile && (
        <section className="mt-8" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="sr-only">
            {profile.name} gallery
          </h2>
          {images.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700">
              No public images are available for this profile.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <li
                  key={image.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <figure>
                    <img
                      src={image.imageUrl}
                      alt={`${profile.name}, gallery item ${index + 1}`}
                      width={image.width ?? undefined}
                      height={image.height ?? undefined}
                      className="h-72 w-full object-cover"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <figcaption className="px-3 py-2 text-xs text-slate-600">
                      {image.rating ? `Rating: ${image.rating}` : 'Rating unavailable'}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
