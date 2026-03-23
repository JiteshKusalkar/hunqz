interface PageHeaderProps {
  name: string;
}

export function PageHeader({ name }: PageHeaderProps) {
  return (
    <header>
      <h1 id="profile-images-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {name} profile images
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:mt-3">Server-rendered images</p>
    </header>
  );
}
