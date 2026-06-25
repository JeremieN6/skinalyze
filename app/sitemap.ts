import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import articlesData from '@/skincare-spa/src/assets/data/articles.json';

const APP_DIR = path.join(process.cwd(), 'app');
const EXCLUDED_PREFIXES = ['/admin', '/api'];
const EXCLUDED_ROUTES = ['/checkout/success'];

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'https://skinalyze.sassify.fr').replace(
    /\/+$/,
    '',
  );
}

function isExcludedRoute(route: string) {
  if (EXCLUDED_ROUTES.includes(route)) {
    return true;
  }

  return EXCLUDED_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}

function isDynamicSegment(segment: string) {
  return segment.startsWith('[') && segment.endsWith(']');
}

function collectPageRoutes(dirPath: string, segments: string[] = []): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const routes: string[] = [];

  if (entries.some((entry) => entry.isFile() && entry.name === 'page.tsx')) {
    if (!segments.some(isDynamicSegment)) {
      routes.push(segments.length ? `/${segments.join('/')}` : '/');
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const name = entry.name;

    if (name.startsWith('_') || name.startsWith('@')) {
      continue;
    }

    const nextSegments = [...segments];

    // Route groups influence the filesystem tree but not the URL.
    if (!(name.startsWith('(') && name.endsWith(')'))) {
      nextSegments.push(name);
    }

    const nextRoute = `/${nextSegments.join('/')}`.replace(/\/+/, '/');
    if (isExcludedRoute(nextRoute)) {
      continue;
    }

    routes.push(...collectPageRoutes(path.join(dirPath, name), nextSegments));
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes = Array.from(new Set(collectPageRoutes(APP_DIR))).filter((route) => !isExcludedRoute(route));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = articlesData.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
