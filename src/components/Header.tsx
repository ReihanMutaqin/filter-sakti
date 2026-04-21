import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 border-b"
      style={{
        backgroundColor: 'rgba(13, 17, 28, 0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderColor: '#1C2537',
        boxShadow: '0 1px 0 rgba(0,0,0,0.4)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M2 7h7M2 10h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading font-bold text-[15px] text-[#F1F5F9] tracking-tight">Filter</span>
          <span className="font-heading font-bold text-[15px] tracking-tight" style={{ color: '#3B82F6' }}>Sakti</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div
        className="flex items-center p-[3px] gap-[3px] rounded-[9px]"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className="relative px-4 py-1.5 rounded-[7px] text-[13px] font-medium transition-all duration-200 ease-out"
            style={{
              background: mode === key
                ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                : 'transparent',
              color: mode === key ? '#FFFFFF' : '#64748B',
              boxShadow: mode === key ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (mode !== key) e.currentTarget.style.color = '#94A3B8';
            }}
            onMouseLeave={(e) => {
              if (mode !== key) e.currentTarget.style.color = '#64748B';
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sheet Connection Status */}
      <div className="flex items-center gap-2">
        {sheetStatus === 'connecting' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: '#64748B' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Menghubungkan...</span>
          </div>
        )}
        {sheetStatus === 'connected' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 96, 0.08)', border: '1px solid rgba(16, 185, 96, 0.15)' }}>
            <Wifi className="w-3 h-3" style={{ color: '#10B981' }} />
            <span className="text-xs font-medium" style={{ color: '#10B981' }}>
              {sheetName ?? 'Terhubung'}
            </span>
          </div>
        )}
        {sheetStatus === 'error' && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <WifiOff className="w-3 h-3" style={{ color: '#EF4444' }} />
              <span className="text-xs font-medium" style={{ color: '#EF4444' }}>Gagal koneksi</span>
            </div>
            <button
              onClick={onRetry}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: '#64748B' }}
              title="Coba lagi"
              onMouseEnter={(e) => e.currentTarget.style.color = '#94A3B8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
