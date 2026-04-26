import Navbar from './Navbar';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>This section is currently under construction.</p>
      </div>
    </main>
  );
}
