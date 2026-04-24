import ExpandableImage from '@/components/ExpandableImage';

export type ProjectImageFrame =
  | 'evidence'
  | 'screen'
  | 'paper'
  | 'portrait'
  | 'wide'
  | 'panorama';

type ProjectImageCardProps = {
  src: string;
  alt: string;
  caption: string;
  fit?: 'cover' | 'contain';
  frame?: ProjectImageFrame;
  priority?: boolean;
  sizes?: string;
  variant?: 'standalone' | 'embedded';
};

const frameClasses: Record<ProjectImageFrame, string> = {
  evidence: 'aspect-[4/3]',
  screen: 'aspect-[16/10]',
  paper: 'aspect-[4/5]',
  portrait: 'aspect-[4/5]',
  wide: 'aspect-[16/9]',
  panorama: 'aspect-[21/9]',
};

export default function ProjectImageCard({
  src,
  alt,
  caption,
  fit = 'contain',
  frame = 'evidence',
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
  variant = 'standalone',
}: ProjectImageCardProps) {
  const shellClass =
    variant === 'embedded'
      ? 'flex flex-col border-t border-black/[0.08] bg-white/45 dark:border-white/[0.08] dark:bg-white/[0.025]'
      : 'flex h-full flex-col border border-black/[0.08] bg-white/45 dark:border-white/[0.08] dark:bg-white/[0.025]';

  return (
    <figure className={shellClass}>
      <div
        className={`relative ${frameClasses[frame]} overflow-hidden bg-black/[0.025] dark:bg-white/[0.025]`}
      >
        <ExpandableImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          imageClassName={fit === 'cover' ? 'object-cover' : 'object-contain p-4 md:p-5'}
        />
      </div>
      <figcaption className="flex min-h-[76px] items-start border-t border-black/[0.06] p-4 text-xs leading-relaxed text-gray-500 dark:border-white/[0.06] dark:text-gray-400">
        {caption}
      </figcaption>
    </figure>
  );
}
