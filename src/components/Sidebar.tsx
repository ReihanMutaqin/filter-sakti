import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Check,
  AlertCircle,
  Loader2,
  X,
  Database,
} from 'lucide-react';
import type { OperationMode, AppStatus } from '@/types';
import { MONTH_NAMES } from '@/types';
import type { SheetStatus } from '@/hooks/useAppState';

interface SidebarProps {
  mode: OperationMode;
  status: AppStatus;
  error: string | null;
  sheetStatus: SheetStatus;
  sheetTotalRows?: number;
  selectedMonths: number[];
  mainFile: File | null;
  onMainFileUpload: (file: File) => void;
  onProcess: () => void;
  onToggleMonth: (month: number) => void;
  onClearMainFile: () => void;
}

const SECTION_LABEL = "block text-[10px] font-semibold text-[#475569] uppercase tracking-[0.1em] mb-2";

export function Sidebar({
  mode,
  status,
  error,
  sheetStatus,
  sheetTotalRows,
  selectedMonths,
  mainFile,
  onMainFileUpload,
  onProcess,
  onToggleMonth,
  onClearMainFile,
}: SidebarProps) {
  const mainInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) onMainFileUpload(file);
    },
    [onMainFileUpload]
  );

  const isProcessing = status === 'parsing' || status === 'processing';
  const canProcess = !!mainFile && !isProcessing && sheetStatus === 'connected';

  const modeDesc: Record<OperationMode, string> = {
    WSA: 'AO / PDA / WSA · CREATE & MIGRATE',
    MODOROSO: 'Suffix -MO / -DO · Auto-detect type',
    WAPPR: 'AO / PDA · Status WAPPR only',
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-14 bottom-0 w-[268px] flex flex-col overflow-y-auto custom-scrollbar"
      style={{ backgroundColor: '#0D1117', borderRight: '1px solid #1C2537' }}
    >
      <div className="flex-1 p-5 space-y-6">

        {/* Google Sheets Reference */}
        <div>
          <label className={SECTION_LABEL}>REFERENSI GOOGLE SHEETS</label>
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: sheetStatus === 'connected'
                ? 'rgba(16, 185, 96, 0.06)'
                : sheetStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.06)'
                  : 'rgba(255,255,255,0.03)',
              border: `1px solid ${
                sheetStatus === 'connected'
                  ? 'rgba(16, 185, 96, 0.18)'
                  : sheetStatus === 'error'
                    ? 'rgba(239, 68, 68, 0.18)'
                    : '#1C2537'
              }`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: sheetStatus === 'connected'
                  ? 'rgba(16, 185, 96, 0.12)'
                  : 'rgba(255,255,255,0.05)',
              }}
            >
              {sheetStatus === 'connecting'
                ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#475569' }} />
                : <Database className="w-4 h-4" style={{ color: sheetStatus === 'connected' ? '#10B981' : '#475569' }} />
              }
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium" style={{ color: sheetStatus === 'connected' ? '#10B981' : '#94A3B8' }}>
                {sheetStatus === 'connecting' && 'Menghubungkan...'}
                {sheetStatus === 'connected' && 'Terhubung'}
                {sheetStatus === 'error' && 'Gagal terhubung'}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
                {sheetStatus === 'connected' && sheetTotalRows !== undefined
                  ? `${sheetTotalRows.toLocaleString()} baris di GSheet`
                  : 'Salinan dari NEW GDOC WSA'
                }
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className={SECTION_LABEL}>DATA FILE</label>
          <div
            ref={undefined}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => mainInputRef.current?.click()}
            className={`
              relative h-[130px] rounded-xl border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center gap-2 transition-all duration-200
              ${error ? 'animate-shake' : ''}
              ${mainFile
                ? 'border-emerald-500/25 bg-emerald-500/[0.05]'
                : 'hover:border-blue-500/40 hover:bg-blue-500/[0.04]'
              }
            `}
            style={{
              borderColor: error
                ? 'rgba(239, 68, 68, 0.4)'
                : mainFile
                  ? 'rgba(16, 185, 96, 0.25)'
                  : '#1C2537',
              backgroundColor: error
                ? 'rgba(239, 68, 68, 0.04)'
                : undefined,
            }}
          >
            <input
              ref={mainInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onMainFileUpload(file);
              }}
              className="hidden"
            />

            {mainFile ? (
              <>
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-[12px] font-medium text-[#CBD5E1] px-3 text-center truncate max-w-full">
                  {mainFile.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onClearMainFile(); }}
                  className="absolute top-2 right-2 p-1 rounded-md transition-colors"
                  style={{ color: '#475569' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" style={{ color: '#475569' }} />
                <span className="text-[12px]" style={{ color: '#475569' }}>
                  Drop file atau klik untuk browse
                </span>
                <span className="text-[11px]" style={{ color: '#334155' }}>
                  .xlsx · .xls · .csv
                </span>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-1.5 mt-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-[11px] text-red-400 leading-4">{error}</span>
            </div>
          )}
        </div>

        {/* Month Filter */}
        <div>
          <label className={SECTION_LABEL}>FILTER BULAN</label>
          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_NAMES.map((name, idx) => {
              const monthNum = idx + 1;
              const isSelected = selectedMonths.includes(monthNum);
              return (
                <button
                  key={monthNum}
                  onClick={() => onToggleMonth(monthNum)}
                  className="h-8 rounded-lg text-[12px] font-medium transition-all duration-150"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                      : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    border: isSelected ? 'none' : '1px solid #1C2537',
                    boxShadow: isSelected ? '0 2px 6px rgba(59, 130, 246, 0.25)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.color = '#94A3B8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.color = '#475569';
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Process Button */}
        <button
          onClick={onProcess}
          disabled={!canProcess}
          className="w-full h-11 rounded-[10px] font-semibold text-[14px] transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#FFFFFF',
            opacity: canProcess ? 1 : 0.35,
            cursor: canProcess ? 'pointer' : 'not-allowed',
            boxShadow: canProcess ? '0 4px 14px rgba(59, 130, 246, 0.35)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (canProcess) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = canProcess ? '0 4px 14px rgba(59, 130, 246, 0.35)' : 'none';
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin-slow" />
              Memproses...
            </>
          ) : (
            'Proses Data'
          )}
        </button>

        {/* Mode Info */}
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1C2537' }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>
            Mode aktif
          </span>
          <p className="text-[12px] font-medium mt-1" style={{ color: '#3B82F6' }}>{mode}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#334155' }}>
            {modeDesc[mode]}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5" style={{ borderTop: '1px solid #1C2537' }}>
        <span className="text-[11px]" style={{ color: '#1E3A5F' }}>
          Filter Sakti · v2.1
        </span>
      </div>
    </motion.aside>
  );
}
