
const ACCENT = '150, 176, 235';

export default function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none relative z-10 flex items-center justify-center py-16 sm:py-20 lg:py-24"
    >
      <div className="relative flex w-full max-w-3xl items-center justify-center px-6">
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${ACCENT},0.28))`,
            filter: 'blur(0.2px)',
          }}
        />

        <span className="relative mx-5 flex h-10 w-10 shrink-0 items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M6 20 A14 14 0 0 1 34 20"
              stroke={`rgba(${ACCENT},0.22)`}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M34 20 A14 14 0 0 1 6 20"
              stroke={`rgba(${ACCENT},0.1)`}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>

          <span
            className="absolute h-6 w-6 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${ACCENT},0.28) 0%, transparent 70%)`,
              filter: 'blur(2px)',
            }}
          />

          <span
            className="relative block h-1.5 w-1.5 rotate-45"
            style={{
              background: 'rgba(224, 236, 255, 0.9)',
              boxShadow: `0 0 6px 1px rgba(${ACCENT},0.6)`,
              borderRadius: '1px',
            }}
          />
        </span>

        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, rgba(${ACCENT},0.28), transparent)`,
            filter: 'blur(0.2px)',
          }}
        />
      </div>

      <span
        className="absolute left-1/2 top-6 h-[3px] w-[3px] -translate-x-1/2 rounded-full sm:top-8"
        style={{ background: `rgba(${ACCENT},0.4)` }}
      />
      <span
        className="absolute bottom-6 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full sm:bottom-8"
        style={{ background: `rgba(${ACCENT},0.3)` }}
      />
    </div>
  );
}
