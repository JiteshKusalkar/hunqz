import Image from 'next/image';
import type { Metadata } from 'next';
import { fetchProfile } from '@hunqz/shared/images';

export const metadata: Metadata = {
  title: 'Hunqz Profile Images',
  description: 'Server-rendered profile image gallery built from shared Hunqz domain data.',
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const profile = await fetchProfile();
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
              const altText = `${profile.name} profile image ${index + 1}`;
              const width = image.width ?? 700;
              const height = image.height ?? 700;

              return (
                <li
                  key={image.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <figure>
                    <Image
                      src={image.imageUrl}
                      alt={altText}
                      width={width}
                      height={height}
                      className="h-72 w-full object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <figcaption className="px-3 py-2 text-xs text-slate-600">
                      {image.rating ? `Rating: ${image.rating}` : 'Rating unavailable'}
                    </figcaption>
                  </figure>
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
