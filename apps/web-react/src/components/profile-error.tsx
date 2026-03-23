interface ProfileErrorProps {
  error: unknown;
}

export function ProfileError({ error }: ProfileErrorProps) {
  return (
    <div
      className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-medium">Could not load images</p>
      <p className="mt-1 text-sm">
        {error instanceof Error ? error.message : 'Failed to load profile'}
      </p>
    </div>
  );
}
