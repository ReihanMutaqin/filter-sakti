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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-11 rounded-lg flex items-center justify-center gap-2.5 text-[13px] font-semibold transition-all duration-150"
        style={{
          backgroundColor: disabled ? '#0F1520' : '#1C3348',
          color: disabled ? '#2A3F52' : '#7AACCA',
          border: `1px solid ${disabled ? '#1A2738' : '#2A4A62'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={e => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#213D58';
            e.currentTarget.style.borderColor = '#3A6080';
          }
        }}
        onMouseLeave={e => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#1C3348';
            e.currentTarget.style.borderColor = '#2A4A62';
          }
        }}
      >
        <Download className="w-4 h-4" />
        <span>Download Excel</span>
        {!disabled && rowCount !== undefined && (
          <span
            className="text-[11px] font-normal px-2 py-0.5 rounded"
            style={{ backgroundColor: '#152637', color: '#5A8FA8' }}
          >
            {rowCount.toLocaleString()} baris · {filename}
          </span>
        )}
      </button>
    </motion.div>
  );
}
