import { motion } from 'framer-motion';
import type { ProcessingMetrics } from '@/types';

interface MetricsCardsProps {
  metrics: ProcessingMetrics;
  visible: boolean;
  rawCount?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const ACCENT = '#3B82F6';

export function MetricsCards({ metrics, visible, rawCount }: MetricsCardsProps) {
  if (!visible) return null;

  const duplicatesRemoved = metrics.filtered - metrics.unique;

  const cards = [
    {
      label: 'Data Terfilter',
      value: metrics.filtered.toLocaleString(),
      sub: rawCount ? `dari ${rawCount.toLocaleString()} baris total` : undefined,
    },
    {
      label: 'Data Unik',
      value: metrics.unique.toLocaleString(),
      sub: duplicatesRemoved > 0 ? `${duplicatesRemoved.toLocaleString()} duplikat dihapus` : 'Tidak ada duplikat',
      accent: true,
    },
    {
      label: 'Validasi By',
      value: metrics.checkColumn,
      sub: 'Kolom referensi deduplikasi',
      isMono: true,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative rounded-xl p-5 transition-all duration-200 cursor-default"
          style={{
            backgroundColor: '#0D1117',
            border: '1px solid #1C2537',
            borderLeft: `3px solid ${card.accent ? ACCENT : '#1C2537'}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2D3F55';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1C2537';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#475569' }}
          >
            {card.label}
          </span>
          <p
            className={`mt-2 font-heading font-bold leading-none ${
              card.isMono ? 'text-sm mt-3 font-mono' : 'text-[30px]'
            }`}
            style={{ color: card.accent ? ACCENT : '#F1F5F9' }}
          >
            {card.value}
          </p>
          {card.sub && (
            <p className="text-[11px] mt-2" style={{ color: '#334155' }}>
              {card.sub}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
