'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Navbar from '@/components/layout/Navbar';
import { Users, DollarSign, Film, Tv, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import './admin.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const router = useRouter();
  const { data: stats, error: statsError } = useSWR('/api/admin/stats', fetcher);
  const [page, setPage] = useState(1);
  const { data: usersData, error: usersError } = useSWR(`/api/admin/users?page=${page}&limit=10`, fetcher);

  if (statsError?.status === 403 || usersError?.status === 403) {
    return (
      <main className="page-wrapper">
        <Navbar />
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
          <Shield size={64} style={{ color: '#e50914', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Access Denied</h1>
          <p style={{ color: 'var(--text-muted)' }}>You do not have admin privileges.</p>
        </div>
      </main>
    );
  }

  const tierColors: Record<string, string> = {
    BASIC: '#3b82f6',
    STANDARD: '#8b5cf6',
    PREMIUM: '#f59e0b',
    NONE: '#6b7280',
    INACTIVE: '#6b7280',
  };

  return (
    <main className="page-wrapper">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1><Shield size={28} /> Admin Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}><Users size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats?.totalUsers ?? '—'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><Users size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">Active Subscribers</span>
              <span className="stat-value">{stats?.activeSubscribers ?? '—'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><DollarSign size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">Monthly Revenue</span>
              <span className="stat-value">₹{stats?.estimatedMonthlyRevenue?.toLocaleString() ?? '—'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(229,9,20,0.15)', color: '#e50914' }}><Film size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">Movies</span>
              <span className="stat-value">{stats?.totalMovies ?? '—'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}><Tv size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">TV Shows</span>
              <span className="stat-value">{stats?.totalTvShows ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="tier-breakdown">
          <h2>Subscription Breakdown</h2>
          <div className="tier-bars">
            {['basic', 'standard', 'premium'].map((tier) => (
              <div key={tier} className="tier-bar-item">
                <span className="tier-label">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                <div className="tier-bar-track">
                  <div
                    className="tier-bar-fill"
                    style={{
                      width: `${stats?.activeSubscribers ? ((stats.tierBreakdown?.[tier] || 0) / stats.activeSubscribers) * 100 : 0}%`,
                      background: tierColors[tier.toUpperCase()],
                    }}
                  />
                </div>
                <span className="tier-count">{stats?.tierBreakdown?.[tier] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="users-table-section">
          <h2>User Management</h2>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map((user: any) => (
                  <tr key={user.id}>
                    <td>{user.name || 'No Name'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="tier-badge" style={{ background: tierColors[user.subscriptionTier || 'NONE'] }}>
                        {user.subscriptionTier || 'NONE'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: user.subscriptionStatus === 'ACTIVE' ? '#46d369' : '#ef4444' }}>
                        {user.subscriptionStatus || 'INACTIVE'}
                      </span>
                    </td>
                    <td>{user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '—'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /> Prev</button>
            <span>Page {page} of {usersData?.totalPages || 1}</span>
            <button disabled={page >= (usersData?.totalPages || 1)} onClick={() => setPage(page + 1)}>Next <ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </main>
  );
}
