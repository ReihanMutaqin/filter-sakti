import { motion } from 'framer-motion';
import type { ProcessingMetrics } from '@/types';

interface MetricsCardsProps {
  metrics: ProcessingMetrics;
  visible: boolean;
  rawCount?: number;
}

export function MetricsCards({ metrics, visible, rawCount }: MetricsCardsProps) {
  if (!visible) return null;

  const dupes = metrics.filtered - metrics.unique;

  const cards = [
    {
      label: 'Data Terfilter',
      value: metrics.filtered.toLocaleString(),
      sub: rawCount ? `dari ${rawCount.toLocaleString()} total` : undefined,
      accent: false,
    },
    {
      label: 'Data Unik',
      value: metrics.unique.toLocaleString(),
      sub: dupes > 0 ? `${dupes.toLocaleString()} duplikat dihapus` : 'Tidak ada duplikat',
      accent: true,
    },
    {
      label: 'Kolom Dedup',
      value: metrics.checkColumn,
      sub: 'Kolom referensi GSheet',
      mono: true,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="rounded-xl p-4"
          style={{
            backgroundColor: '#0F1520',
            border: '1px solid #1C2738',
            borderLeft: `3px solid ${c.accent ? '#3D6E8C' : '#1C2738'}`,
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] mb-2" style={{ color: '#37475A' }}>
            {c.label}
          </p>
          <p
            className={c.mono ? 'text-[12px] font-mono leading-snug' : 'text-[26px] font-heading font-bold leading-none'}
            style={{ color: c.accent ? '#6A9AB5' : '#8A9BAC' }}
          >
            {c.value}
          </p>
          {c.sub && (
            <p className="text-[11px] mt-1.5" style={{ color: '#37475A' }}>{c.sub}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
