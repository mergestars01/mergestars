// Presentation aliases verified against identical asset blobs. Keep both original URLs valid.
const aliases = new Map([
  ['vip-grand-museum.png', 'approved-mega-museum.png'],
  ['founder-portal-closed.png', 'entrance-dual-closed.png'],
]);

export function referencePhotoKey(image: string): string {
  const match = /^\/living-museum\/assets\/(?:([a-z0-9-]+\.png)|optimized\/([a-z0-9-]+)\.webp)$/.exec(image);
  if (!match) return image;
  const name = match[1] ?? match[2] + '.png';
  return '/living-museum/assets/' + (aliases.get(name) ?? name);
}

// Retain the first displayed photo, its metadata and original URL.
export function uniqueReferencePhotos<T extends { image: string }>(photos: readonly T[]): T[] {
  const seen = new Set<string>();
  return photos.filter(photo => {
    const key = referencePhotoKey(photo.image);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
