/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	output: 'standalone',
	i18n: {
		locales: ['en-US', 'fr-FR', 'de-DE'],
		defaultLocale: 'en-US',
	},
	rewrites: async () => {
		return [
			{
				source: '/api/:path*',
				destination: 'http://127.0.0.1:3001/:path*',
			},
		]
	},
}

export default nextConfig
