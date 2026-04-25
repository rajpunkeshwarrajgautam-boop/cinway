"use client";

import { useState } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import Navbar from '@/components/layout/Navbar';
import './plans.css';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const PLANS = [
  { id: 'BASIC', name: 'Basic', price: 499, resolution: '720p', devices: 1, quality: 'Good' },
  { id: 'STANDARD', name: 'Standard', price: 899, resolution: '1080p', devices: 2, quality: 'Better' },
  { id: 'PREMIUM', name: 'Premium', price: 1499, resolution: '4K + HDR', devices: 4, quality: 'Best' }
];

export default function Plans() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (tier: string) => {
    try {
      setLoading(tier);
      const response = await axios.post('/api/cashfree/checkout', { tier });
      
      const { paymentSessionId } = response.data;
      
      if (paymentSessionId) {
        const cashfree = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? "production" : "sandbox"
        });
        
        if (cashfree) {
          await cashfree.checkout({
            paymentSessionId,
            redirectTarget: "_self"
          });
        }
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="plans-wrapper">
      <Navbar />
      <div className="plans-container">
        <div className="plans-header">
          <h1>Choose the plan that's right for you</h1>
          <p>Watch all you want. Ad-free.</p>
        </div>
        
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <div className="plan-price">₹{plan.price}<span>/month</span></div>
              </div>
              <div className="plan-features">
                <div className="feature"><Check size={18} color="#e50914" /> <span>Video quality: {plan.quality}</span></div>
                <div className="feature"><Check size={18} color="#e50914" /> <span>Resolution: {plan.resolution}</span></div>
                <div className="feature"><Check size={18} color="#e50914" /> <span>Screens: {plan.devices}</span></div>
              </div>
              <button 
                className="plan-button"
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? <div className="spinner-small" /> : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
