import { getSurface } from '../data/theme';

export default function Section({
  id,
  children,
  className = '',
  center = true,
  atmosphere = null,
  fullHeight = true,
}) {
  const { base, previous } = getSurface(id);

  return (
    <section
      id={id}
      className={`relative flex flex-col px-6 py-20 lg:px-10 lg:py-24 ${
        fullHeight ? 'min-h-[85dvh]' : ''
      } ${center ? 'justify-center' : 'justify-start'} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${previous} 0%, ${base} 30%, ${base} 100%)`,
        }}
      />

      {atmosphere}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_50%,rgba(6,8,18,0.5),transparent_75%)]"
      />

      <div className="relative w-full">{children}</div>
    </section>
  );
}
