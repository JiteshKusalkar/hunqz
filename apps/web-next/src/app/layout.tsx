import './global.css';

export const metadata = {
  title: 'Hunqz profiles',
  description: 'Browse Hunqz',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
