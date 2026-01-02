// app/checkout/confirmation/page.tsx

import { Suspense } from 'react';
import OrderConfirmationClient from '@/app/checkout/confirmation/OrderConfirmationClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order confirmation...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
