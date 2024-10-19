import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export type Locale = 'pt' | 'en';

export const routing = defineRouting({
    locales: ['pt', 'en'],

    // Used when no locale matches
    defaultLocale: 'pt'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation(routing);