import axios from 'axios';

export const cashfreeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg',
  headers: {
    'x-client-id': process.env.CASHFREE_APP_ID || '',
    'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
