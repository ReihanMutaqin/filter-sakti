import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import type { OperationMode } from '@/types';
import type { SheetStatus } from '@/hooks/useAppState';

interface HeaderProps {
  mode: OperationMode;
  onModeChange: (mode: OperationMode) => void;
  sheetStatus: SheetStatus;
  sheetName?: string;
  onRetry: () => void;
}

const MODES: { key: OperationMode; label: string }[] = [
  { key: 'WSA', label: 'WSA' },
  { key: 'MODOROSO', label: 'MODOROSO' },
  { key: 'WAPPR', label: 'WAPPR' },
];

export function Header({ mode, onModeChange, sheetStatus, sheetName, onRetry }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-5"
      style={{
        height: '52px',
        backgroundColor: 'rgba(12,16,24,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1C2738',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#1C3348', border: '1px solid #2A4A62' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="2" width="10" height="1.5" rx="0.75" fill="#7AACCA"/>
            <rect x="1" y="5.25" width="7" height="1.5" rx="0.75" fill="#7AACCA"/>
            <rect x="1" y="8.5" width="5" height="1.5" rx="0.75" fill="#7AACCA"/>
          </svg>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading font-bold text-[14px]" style={{ color: '#A8B8C5', letterSpacing: '-0.2px' }}>
            Filter
          </span>
          <span className="font-heading font-bold text-[14px]" style={{ color: '#6A9AB5', letterSpacing: '-0.2px' }}>
            Sakti
          </span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div
        className="flex items-center p-[3px] rounded-[8px] gap-[2px]"
        style={{ backgroundColor: '#111820', border: '1px solid #1C2738' }}
      >
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className="px-4 py-[5px] rounded-[6px] text-[12px] font-medium transition-all duration-150"
            style={{
              backgroundColor: mode === key ? '#1C3348' : 'transparent',
              color: mode === key ? '#8BBDD4' : '#445566',
              border: mode === key ? '1px solid #2A4A62' : '1px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sheet Status */}
      <div className="flex items-center gap-2">
        {sheetStatus === 'connecting' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#111820', border: '1px solid #1C2738' }}>
            <Loader2 className="w-3 h-3 animate-spin-slow" style={{ color: '#3D6E8C' }} />
            <span className="text-[12px]" style={{ color: '#445566' }}>Menghubungkan...</span>
          </div>
        )}
        {sheetStatus === 'connected' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0E1E16', border: '1px solid #1E3328' }}>
            <Wifi className="w-3 h-3" style={{ color: '#4A8F68' }} />
            <span className="text-[12px] font-medium" style={{ color: '#5FA07A' }}>
              {sheetName ?? 'Terhubung'}
            </span>
          </div>
        )}
        {sheetStatus === 'error' && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A0E0E', border: '1px solid #3A1F1F' }}>
              <WifiOff className="w-3 h-3" style={{ color: '#8F4A4A' }} />
              <span className="text-[12px]" style={{ color: '#A06060' }}>Gagal koneksi</span>
            </div>
            <button
              onClick={onRetry}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: '#445566' }}
              title="Coba lagi"
              onMouseEnter={e => (e.currentTarget.style.color = '#7AACCA')}
              onMouseLeave={e => (e.currentTarget.style.color = '#445566')}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
