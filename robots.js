export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/private/',
        },
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: ['/private/', '/temp/'],
        },
      ],
      sitemap: 'https://www.gerdem.net/sitemap.xml',
    }
  }