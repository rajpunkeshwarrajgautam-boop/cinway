'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, X, PlaySquare, LogOut, CreditCard, Shield, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TIER_COLORS: Record<string, string> = {
  BASIC: '#3b82f6',
  STANDARD: '#8b5cf6',
  PREMIUM: '#f59e0b',
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const { data: currentUser } = useSWR('/api/current', fetcher);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setShowSearchInput(false);
    }
  }

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  const tier = currentUser?.subscriptionTier;
  const isActive = currentUser?.subscriptionStatus === 'ACTIVE';
  const isAdmin = currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/series', label: 'TV Shows' },
    { href: '/movies', label: 'Movies' },
    { href: '/latest', label: 'New & Popular' },
    { href: '/list', label: 'My List' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 50,
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4vw',
          transition: 'background-color var(--transition-smooth)',
          backgroundColor: isScrolled ? 'var(--bg-primary)' : 'transparent',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '2rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            <PlaySquare strokeWidth={2.5} size={28} />
            <span>Cinway</span>
          </Link>
          <div className="nav-links" style={{ display: 'none', gap: '1.5rem', fontSize: '0.9rem' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: 'var(--text-secondary)', transition: 'color 200ms' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showSearchInput && (
              <input
                autoFocus
                className="glass-panel"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '180px'
                }}
                placeholder="Titles, people, genres"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                onBlur={() => !searchValue && setShowSearchInput(false)}
              />
            )}
            <button 
              aria-label="Search" 
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setShowSearchInput(!showSearchInput)}
            >
              <Search size={20} />
            </button>
          </div>
          <button aria-label="Notifications" style={{ color: 'var(--text-primary)' }}><Bell size={20} /></button>
          
          <div 
            onClick={toggleAccountMenu}
            style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'visible', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
          >
            <Image
              src={currentUser?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"}
              alt="Profile Avatar"
              width={32}
              height={32}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />

            {showAccountMenu && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '45px',
                  right: '0',
                  width: '220px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {isActive && tier && (
                  <div style={{ padding: '0.5rem', marginBottom: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                      background: TIER_COLORS[tier] || '#6b7280',
                    }}>
                      {tier} Plan
                    </span>
                  </div>
                )}
                <Link href="/profiles" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', padding: '0.25rem', textDecoration: 'none' }}>
                  <User size={16} />
                  Manage Profiles
                </Link>
                <Link href="/plans" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', padding: '0.25rem', textDecoration: 'none' }}>
                  <CreditCard size={16} />
                  {isActive ? 'My Subscription' : 'Subscribe'}
                </Link>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', padding: '0.25rem', textDecoration: 'none' }}>
                  <Shield size={16} />
                  Admin Panel
                </Link>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                  <div 
                    onClick={() => signOut()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', padding: '0.25rem', cursor: 'pointer' }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="mobile-toggle"
            aria-label="Toggle Menu" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <style jsx>{`
          @media (min-width: 768px) {
            .nav-links {
              display: flex !important;
            }
          }
          @media (max-width: 767px) {
            .mobile-toggle {
              display: block !important;
            }
          }
        `}</style>
      </nav>

      {mobileMenuOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            padding: '2rem 4vw',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'white', fontSize: '1.25rem', fontWeight: 500, textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
          {isActive && tier && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{
                padding: '4px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'white',
                background: TIER_COLORS[tier] || '#6b7280',
              }}>
                {tier} Plan Active
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
