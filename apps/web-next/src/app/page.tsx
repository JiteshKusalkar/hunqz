import type { Metadata } from 'next';
import { getJson } from '@hunqz/shared/api';
import type { Profile } from '@hunqz/shared/images';
import { ProfileCard } from '@hunqz/shared/ui';

const API_BASE_URL = process.env['NEXT_API_SERVER_URL'] ?? 'http://localhost:3333';

export const metadata: Metadata = {
  title: 'Hunqz Profile Images',
  description: 'Server-rendered profile image gallery built from shared Hunqz data.',
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const profile = await getJson<Profile>('/profiles/msescortplus', {
      baseUrl: API_BASE_URL,
    });
    const images = profile.images.slice(0, 6);

    return (
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="profile-images-heading">
        <header>
          <h1 id="profile-images-heading" className="text-3xl font-semibold tracking-tight">
            {profile.name} profile images
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Server-rendered gallery using shared domain and transport libraries.
          </p>
        </header>

        {images.length === 0 ? (
          <p className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700">
            No public images are currently available for this profile.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => {
              const width = image.width ?? 700;
              const height = image.height ?? 700;

              return (
                <li key={image.id}>
                  <ProfileCard
                    imageSrc={image.imageUrl}
                    imageAlt={`${profile.name}, gallery item ${index + 1}`}
                    meta={image.rating ? `Rating: ${image.rating}` : 'Rating unavailable'}
                    imageProps={{
                      width,
                      height,
                      loading: index < 3 ? 'eager' : 'lazy',
                      decoding: 'async',
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    );
  } catch {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="profile-images-heading">
        <h1 id="profile-images-heading" className="text-3xl font-semibold tracking-tight">
          Hunqz profile images
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          We could not load profile images right now. Please try again shortly.
        </p>
      </section>
    );
  }
}
