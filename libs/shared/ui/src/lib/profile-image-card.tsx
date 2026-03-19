import type { ImgHTMLAttributes, ReactNode } from 'react';

export interface ProfileImageCardProps {
  /** Image URL (CDN or same-origin). */
  imageSrc: string;
  /** Required accessible description; avoid redundant words like "image of". */
  imageAlt: string;
  /** Optional primary line (e.g. profile name). */
  title?: string;
  /** Optional secondary line (e.g. headline). */
  subtitle?: string;
  /** Optional tertiary line (e.g. rating, status). */
  meta?: string;
  /** Extra classes on the outer card. */
  className?: string;
  /** Passed to `<img>` (e.g. width, height, loading, decoding). */
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
  /** Optional footer slot for badges/actions without coupling to app routing. */
  footer?: ReactNode;
}

/**
 * Presentational card for a profile photo plus optional text.
 * No data fetching — pass everything via props from the app or domain layer.
 */
export function ProfileImageCard({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  meta,
  className = '',
  imageProps,
  footer,
}: ProfileImageCardProps) {
  const { className: imgClassName, ...restImageProps } = imageProps ?? {};
  const showCaption = title ?? subtitle ?? meta ?? footer;

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 ${className}`.trim()}
    >
      <figure className="m-0">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={imageAlt}
            {...restImageProps}
            className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] ${imgClassName ?? ''}`.trim()}
          />
        </div>
        {showCaption ? (
          <figcaption className="space-y-1 border-t border-slate-100 px-3 py-3 text-left">
            {title ? <p className="text-sm font-semibold text-slate-900">{title}</p> : null}
            {subtitle ? <p className="text-xs text-slate-600">{subtitle}</p> : null}
            {meta ? <p className="text-xs text-slate-500">{meta}</p> : null}
            {footer}
          </figcaption>
        ) : null}
      </figure>
    </article>
  );
}
