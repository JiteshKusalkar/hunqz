import type { Metadata } from 'next';
import { getJson } from '@hunqz/api';
import type { Profile } from '@hunqz/images';
import { PageHeader } from './components/page-header';
import { ProfileGallery } from './components/profile-gallery';
import { ProfileError } from './components/profile-error';

const API_BASE_URL = process.env.API_PUBLIC_URL;

export const metadata: Metadata = {
  title: 'Hunqz Profile Images',
  description: 'Server-rendered profile image gallery built from shared Hunqz data.',
};

export const dynamic = 'force-dynamic';

async function fetchProfile(): Promise<Profile> {
  return getJson<Profile>('/profiles/msescortplus', {
    baseUrl: API_BASE_URL,
  });
}

export default async function Home() {
  try {
    const profile = await fetchProfile();

    return (
      <section
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        aria-labelledby="profile-images-heading"
      >
        <PageHeader name={profile.name} />
        <ProfileGallery profile={profile} />
      </section>
    );
  } catch {
    return (
      <section
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        aria-labelledby="profile-images-heading"
      >
        <ProfileError />
      </section>
    );
  }
}
