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
  const dateStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
  const filename = `FilterSakti_${mode}_${dateStr}.xlsx`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-12 rounded-[10px] font-semibold text-[14px] flex items-center justify-center gap-2.5 transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: '#FFFFFF',
          opacity: disabled ? 0.3 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: disabled ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.45)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = disabled ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)';
        }}
        onMouseDown={(e) => {
          if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
        }}
        onMouseUp={(e) => {
          if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
        }}
      >
        <Download className="w-4 h-4" />
        <span>Download Hasil Excel</span>
        {rowCount !== undefined && !disabled && (
          <span
            className="text-[12px] font-normal px-2 py-0.5 rounded-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            {rowCount.toLocaleString()} baris · {filename}
          </span>
        )}
      </button>
    </motion.div>
  );
}
