import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  mode: string;
  rowCount?: number;
}

export function DownloadButton({ onClick, disabled, mode, rowCount }: DownloadButtonProps) {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${now.getFullYear()}`;
  const filename = `FilterSakti_${mode}_${date}.xlsx`;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%', height: 44, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 13, fontWeight: 600,
          backgroundColor: disabled ? '#F9FAFB' : '#C0392B',
          color: disabled ? '#D1D5DB' : '#FFFFFF',
          border: `1px solid ${disabled ? '#E2E5EA' : '#C0392B'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = '#A93226'; }}
        onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = '#C0392B'; }}
      >
        <Download style={{ width: 16, height: 16 }} />
        <span>Download Excel</span>
        {!disabled && rowCount !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 400,
            padding: '2px 8px', borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.2)', color: '#FECACA',
          }}>
            {rowCount.toLocaleString()} baris · {filename}
          </span>
        )}
      </button>
    </motion.div>
  );
}
