import { useProfile } from './hooks/useProfile';
import { PageHeader } from './components/page-header';
import { ProfileLoading } from './components/profile-loading';
import { ProfileError } from './components/profile-error';
import { ProfileGallery } from './components/profile-gallery';

export default function App() {
  const { data: profile, isPending, isError, error } = useProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader />

      {isPending && <ProfileLoading />}
      {isError && <ProfileError error={error} />}
      {profile && <ProfileGallery profile={profile} />}
    </div>
  );
}
