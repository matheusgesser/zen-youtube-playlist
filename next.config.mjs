import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Statically type links using next/link, improving type safety when navigating between pages
        typedRoutes: true,
    },
};

export default withNextIntl(nextConfig);
