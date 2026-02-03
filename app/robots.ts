import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://coufen-2026.vercel.app/sitemap.xml', // 部署后替换为实际域名
  };
}
