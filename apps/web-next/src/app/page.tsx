import type { Metadata } from 'next';
import { getJson } from '@hunqz/shared/api';
import type { Profile } from '@hunqz/shared/images';
import { ProfileCard } from '@hunqz/shared/ui';

const API_BASE_URL = process.env.NEXT_API_SERVER_URL;

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
      <section
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        aria-labelledby="profile-images-heading"
      >
        <header>
          <h1
            id="profile-images-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {profile.name} profile images
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:mt-3">
            Server-rendered gallery using shared domain and transport libraries.
          </p>
        </header>

        {images.length === 0 ? (
          <p className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700">
            No public images are currently available for this profile.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => {
              const width = image.width ?? 700;
              const height = image.height ?? 700;

              return (
                <li key={image.id}>
                  <ProfileCard
                    imageSrc={image.imageUrl}
                    imageAlt={`${profile.name}, gallery item ${index + 1}`}
                    meta={image.rating ? `Rating: ${image.rating}` : 'Rating unavailable'}
                    imageProps={{ width, height }}
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
      <section
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        aria-labelledby="profile-images-heading"
      >
        <h1
          id="profile-images-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Hunqz profile images
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3">
          We could not load profile images right now. Please try again shortly.
        </p>
      </section>
    );
  }
}
