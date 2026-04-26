import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prismadb from '@/lib/prismadb';
import { sendSubscriptionEmail } from '@/lib/email';

const PRICING: Record<string, number> = { BASIC: 499, STANDARD: 899, PREMIUM: 1499 };

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    }

    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(timestamp + rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const order = payload.data.order;
      const payment = payload.data.payment;
      
      const tier = order.order_tags?.tier;
      const userId = order.order_tags?.userId;

      if (userId && tier && payment.payment_status === 'SUCCESS') {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); 

        const updatedUser = await prismadb.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier,
            subscriptionStatus: 'ACTIVE',
            subscriptionEndDate: endDate
          }
        });

        if (updatedUser.email) {
          await sendSubscriptionEmail({
            to: updatedUser.email,
            tier,
            amount: PRICING[tier] || 0,
          });
        }
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
