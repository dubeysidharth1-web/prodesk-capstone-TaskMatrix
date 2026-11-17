import './globals.css';

export const metadata = {
  title: 'TaskMatrix — Agile Project Management',
  description: 'Lightweight Agile task and project management application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
