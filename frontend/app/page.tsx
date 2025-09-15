"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  React.useEffect(() => {
    // ホームページにリダイレクト
    router.push('/home');
  }, [router]);

  return null;
}
