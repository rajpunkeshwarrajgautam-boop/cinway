'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Menu, X, PlaySquare, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

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

  return (
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
        {/* AntiGravity Netflx Clone Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <PlaySquare strokeWidth={2.5} size={28} />
          <span>Cinway</span>
        </Link>
        <div className="nav-links" style={{ display: 'none', gap: '1.5rem', fontSize: '0.9rem' }}>
          <Link href="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Home</Link>
          <Link href="/series" style={{ color: 'var(--text-secondary)' }}>TV Shows</Link>
          <Link href="/movies" style={{ color: 'var(--text-secondary)' }}>Movies</Link>
          <Link href="/latest" style={{ color: 'var(--text-secondary)' }}>New & Popular</Link>
          <Link href="/list" style={{ color: 'var(--text-secondary)' }}>My List</Link>
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
        
        {/* User Avatar */}
        <div 
          onClick={toggleAccountMenu}
          style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'visible', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
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
                width: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div 
                onClick={() => signOut()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  color: 'white', 
                  fontSize: '0.9rem',
                  padding: '0.25rem'
                }}
              >
                <LogOut size={16} />
                Sign Out
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile menu toggle */}
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
  );
}
