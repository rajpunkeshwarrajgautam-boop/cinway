import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';
import { cashfreeApi } from '@/lib/cashfree';

const PRICING = {
  BASIC: 499,
  STANDARD: 899,
  PREMIUM: 1499
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = body; 

    if (!tier || !PRICING[tier as keyof typeof PRICING]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orderId = `order_${user.id}_${Date.now()}`;
    const customerId = user.cashfreeCustomerId || `cust_${user.id}`;
    
    const amount = PRICING[tier as keyof typeof PRICING];

    const response = await cashfreeApi.post('/orders', {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_email: user.email,
        customer_phone: '9999999999' 
      },
      order_meta: {
        return_url: `${process.env.NEXTAUTH_URL}/profiles?payment=success`,
        notify_url: `${process.env.NEXTAUTH_URL}/api/cashfree/webhook`
      },
      order_tags: {
        userId: user.id,
        tier: tier
      }
    });

    if (response.data && response.data.payment_session_id) {
      if (!user.cashfreeCustomerId) {
        await prismadb.user.update({
          where: { id: user.id },
          data: { cashfreeCustomerId: customerId }
        });
      }

      return NextResponse.json({ 
        paymentSessionId: response.data.payment_session_id,
        orderId: response.data.order_id
      });
    }

    throw new Error('Invalid Cashfree response');
  } catch (error: any) {
    console.error('Cashfree Checkout Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
