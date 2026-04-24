const OPTIMIZABLE_IMAGE_EXT = /\.(?:jpe?g|png|webp)$/i;

export function imagePreviewSrc(src: string) {
  if (!src.startsWith('/') || src.startsWith('/optimized/')) {
    return src;
  }

  const [path, suffix = ''] = src.split(/([?#].*)/, 2);

  if (!OPTIMIZABLE_IMAGE_EXT.test(path)) {
    return src;
  }

  return `/optimized${path.replace(OPTIMIZABLE_IMAGE_EXT, '.webp')}${suffix}`;
}
