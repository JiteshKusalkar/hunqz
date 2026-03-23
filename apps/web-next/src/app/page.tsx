import type { Metadata } from 'next';
import { getJson } from '@hunqz/shared/api';
import type { Profile } from '@hunqz/shared/images';
import { PageLayout } from './components/page-layout';
import { PageHeader } from './components/page-header';
import { ProfileGallery } from './components/profile-gallery';
import { ProfileError } from './components/profile-error';

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

    return (
      <PageLayout>
        <PageHeader name={profile.name} />
        <ProfileGallery profile={profile} />
      </PageLayout>
    );
  } catch {
    return (
      <PageLayout>
        <ProfileError />
      </PageLayout>
    );
  }
}
