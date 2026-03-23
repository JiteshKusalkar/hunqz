import type { Profile } from '@hunqz/app-types';
import { ProfileCard } from '@hunqz/ui';

interface ProfileGalleryProps {
  profile: Profile;
}

export function ProfileGallery({ profile }: ProfileGalleryProps) {
  const images = profile.images.slice(0, 6);

  return (
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
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
