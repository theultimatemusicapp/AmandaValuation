'use client';

import { useEffect } from 'react';
import { trackResourceView } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export default function ResourceAnalytics({ slug }: { slug: string }) {
    const pathname = usePathname();

    useEffect(() => {
        trackResourceView(slug);
    }, [slug, pathname]);

    return null;
}
