/**
 * Centered full-area loading spinner.
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullPage=false]  - fills entire viewport
 */
export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  const inner = (
    <div
      className={`${sizes[size]} border-[3px] border-gold/20 border-t-gold
                  rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        {inner}
        <p className="text-offwhite/40 text-sm font-body">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {inner}
    </div>
  );
}
