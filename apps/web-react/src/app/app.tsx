import { useEffect, useState } from 'react';
import { getJson } from '@hunqz/shared/api';
import type { Profile } from '@hunqz/shared/images';
import { ProfileCard } from '@hunqz/shared/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type LoadState = 'loading' | 'success' | 'error';

export default function App() {
  const [state, setState] = useState<LoadState>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getJson<Profile>('/profiles/msescortplus', { baseUrl: API_BASE_URL })
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hunqz profile images</h1>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3">
          Client-rendered SPA using shared domain data.
        </p>
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
            <ul className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <li key={image.id}>
                  <ProfileCard
                    imageSrc={image.imageUrl}
                    imageAlt={`${profile.name}, gallery item ${index + 1}`}
                    meta={image.rating ? `Rating: ${image.rating}` : 'Rating unavailable'}
                    imageProps={{
                      width: image.width ?? 700,
                      height: image.height ?? 700,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
