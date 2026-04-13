import { AppLocale, defaultLocale, detectLocale, isAppLocale } from './locale.model';

export function getLocaleFromPath(pathname: string): AppLocale | null {
  const [firstSegment] = toPathSegments(pathname);
  return isAppLocale(firstSegment) ? firstSegment : null;
}

export function toLocalizedPath(locale: AppLocale, path = ''): string {
  const segments = toPathSegments(path);

  if (segments.length && isAppLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join('/')}`;
}

export function swapLocaleInUrl(url: string, locale: AppLocale): string {
  const [pathWithQuery, fragment = ''] = url.split('#');
  const [pathname, query = ''] = pathWithQuery.split('?');
  const localizedPath = toLocalizedPath(locale, pathname);

  return `${localizedPath}${query ? `?${query}` : ''}${fragment ? `#${fragment}` : ''}`;
}

export function resolveRequestLocale(
  pathname: string,
  acceptedLanguages: readonly string[] = [],
  fallback = defaultLocale
): AppLocale {
  const pathLocale = getLocaleFromPath(pathname);

  if (pathLocale) {
    return pathLocale;
  }

  for (const language of acceptedLanguages) {
    const locale = detectLocale(language);

    if (locale) {
      return locale;
    }
  }

  return fallback;
}

function toPathSegments(path: string): string[] {
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}
