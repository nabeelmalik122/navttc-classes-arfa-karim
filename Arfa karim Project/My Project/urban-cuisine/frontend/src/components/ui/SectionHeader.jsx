/**
 * Reusable section heading block:
 *  - small gold eyebrow label
 *  - large Playfair Display title
 *  - optional subtitle paragraph
 *  - gold divider line
 *
 * @param {object}  props
 * @param {string}  props.eyebrow   - Small uppercase label above title
 * @param {string}  props.title     - Main heading (supports JSX)
 * @param {string}  [props.subtitle]
 * @param {'left'|'center'} [props.align='center']
 * @param {string}  [props.className]
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'left'
    ? 'text-left items-start'
    : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-12 ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
          {eyebrow}
        </span>
      )}

      <h2 className="section-title mb-4">
        {title}
      </h2>

      <div className={`h-0.5 w-14 bg-gold ${align === 'left' ? '' : 'mx-auto'} mb-5`} />

      {subtitle && (
        <p className={`text-offwhite/60 text-base leading-relaxed
                       ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
