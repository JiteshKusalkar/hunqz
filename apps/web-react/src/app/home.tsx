import { useQuery } from '@tanstack/react-query';
import { getJson } from '@hunqz/shared/api';
import type { Profile } from '@hunqz/shared/images';
import { PageHeader } from './components/page-header';
import { ProfileLoading } from './components/profile-loading';
import { ProfileError } from './components/profile-error';
import { ProfileGallery } from './components/profile-gallery';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const {
    data: profile,
    isPending,
    isError,
    error,
  } = useQuery<Profile>({
    queryKey: ['profile', 'msescortplus'],
    queryFn: () => getJson<Profile>('/profiles/msescortplus', { baseUrl: API_BASE_URL }),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader />

      {isPending && <ProfileLoading />}
      {isError && <ProfileError error={error} />}
      {profile && <ProfileGallery profile={profile} />}
    </div>
  );
}
