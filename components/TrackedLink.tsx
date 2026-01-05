'use client';

import Link from 'next/link';
import { trackResourceCTA } from '@/lib/analytics';

export default function TrackedLink({ href, children, className, ...props }: any) {
    const handleClick = () => {
        // Simple heuristic: if it points to / or /pro, it's a CTA. If /resources/*, it's related.
        if (href === '/' || href === '/pro' || href.includes('payment')) {
            trackResourceCTA(href, 'Article Body');
        }
    };

    // Use Next.js Link for internal routes
    if (href.startsWith('/')) {
        return (
            <Link href={href} className={className} onClick={handleClick} {...props}>
                {children}
            </Link>
        );
    }

    // External links
    return (
        <a href={href} className={className} onClick={handleClick} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
}
