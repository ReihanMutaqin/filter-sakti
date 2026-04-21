import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, AlertCircle, Loader2, X, Database } from 'lucide-react';
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: '#37475A' }}>
      {children}
    </p>
  );
}

const MONTH_ABBR = MONTH_NAMES;

export function Sidebar({
  mode, status, error, sheetStatus, sheetTotalRows,
  selectedMonths, mainFile, onMainFileUpload,
  onProcess, onToggleMonth, onClearMainFile,
}: SidebarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) onMainFileUpload(file);
  }, [onMainFileUpload]);

  const isProcessing = status === 'parsing' || status === 'processing';
  const canProcess = !!mainFile && !isProcessing && sheetStatus === 'connected';

  const modeDesc: Record<OperationMode, string> = {
    WSA: 'AO / PDA / WSA · CREATE & MIGRATE',
    MODOROSO: 'Suffix -MO / -DO · Auto-detect',
    WAPPR: 'AO / PDA · Status WAPPR',
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 bottom-0 w-[256px] flex flex-col overflow-y-auto"
      style={{
        top: '52px',
        backgroundColor: '#0F1520',
        borderRight: '1px solid #1C2738',
      }}
    >
      <div className="flex-1 p-4 space-y-5">

        {/* GSheet connection */}
        <div>
          <SectionLabel>Google Sheets</SectionLabel>
          <div
            className="flex items-center gap-2.5 p-2.5 rounded-lg"
            style={{
              backgroundColor: '#0C1018',
              border: `1px solid ${
                sheetStatus === 'connected' ? '#1C3328' :
                sheetStatus === 'error'     ? '#3A1F1F' : '#1C2738'
              }`,
            }}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: sheetStatus === 'connected' ? '#0E2018' : '#111820',
              }}
            >
              {sheetStatus === 'connecting'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin-slow" style={{ color: '#37475A' }} />
                : <Database className="w-3.5 h-3.5" style={{
                    color: sheetStatus === 'connected' ? '#4A8F68' :
                           sheetStatus === 'error'     ? '#8F4A4A' : '#37475A'
                  }} />
              }
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium" style={{
                color: sheetStatus === 'connected' ? '#5FA07A' :
                       sheetStatus === 'error'     ? '#A06060' : '#445566'
              }}>
                {sheetStatus === 'connecting' && 'Menghubungkan...'}
                {sheetStatus === 'connected'  && 'Terhubung'}
                {sheetStatus === 'error'      && 'Gagal terhubung'}
              </p>
              <p className="text-[11px] truncate" style={{ color: '#37475A' }}>
                {sheetStatus === 'connected' && sheetTotalRows !== undefined
                  ? `${sheetTotalRows.toLocaleString()} baris di sheet`
                  : 'GDOC WSA FULFILLMENT'}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#1C2738' }} />

        {/* File Upload */}
        <div>
          <SectionLabel>Upload Data</SectionLabel>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative h-[116px] rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${error ? 'animate-shake' : ''}`}
            style={{
              borderColor: error ? '#5A2E2E' :
                           mainFile ? '#2A4A36' : '#1C2738',
              backgroundColor: error ? '#130D0D' :
                                mainFile ? '#0D1812' : '#0C1018',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onMainFileUpload(f); }}
            />
            {mainFile ? (
              <>
                <Check className="w-4 h-4" style={{ color: '#4A8F68' }} />
                <span className="text-[12px] px-3 text-center truncate max-w-full font-medium" style={{ color: '#7AACCA' }}>
                  {mainFile.name}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onClearMainFile(); }}
                  className="absolute top-2 right-2 p-1 rounded"
                  style={{ color: '#37475A' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#7AACCA')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#37475A')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" style={{ color: '#37475A' }} />
                <span className="text-[12px]" style={{ color: '#37475A' }}>Klik atau drop file di sini</span>
                <span className="text-[11px]" style={{ color: '#253347' }}>.xlsx · .xls · .csv</span>
              </>
            )}
          </div>
          {error && (
            <div className="flex items-start gap-1.5 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#8F4A4A' }} />
              <span className="text-[11px] leading-4" style={{ color: '#A06060' }}>{error}</span>
            </div>
          )}
        </div>

        {/* Month Filter */}
        <div>
          <SectionLabel>Filter Bulan</SectionLabel>
          <div className="grid grid-cols-4 gap-1">
            {MONTH_ABBR.map((name, idx) => {
              const m = idx + 1;
              const active = selectedMonths.includes(m);
              return (
                <button
                  key={m}
                  onClick={() => onToggleMonth(m)}
                  className="h-8 rounded text-[11px] font-medium transition-all duration-100"
                  style={{
                    backgroundColor: active ? '#1C3348' : '#0C1018',
                    color: active ? '#7AACCA' : '#37475A',
                    border: `1px solid ${active ? '#2A4A62' : '#1C2738'}`,
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
          className="w-full h-10 rounded-lg text-[13px] font-semibold transition-all duration-150 flex items-center justify-center gap-2"
          style={{
            backgroundColor: canProcess ? '#1C3348' : '#0F1820',
            color: canProcess ? '#7AACCA' : '#2A3F52',
            border: `1px solid ${canProcess ? '#2A4A62' : '#1A2738'}`,
            cursor: canProcess ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (canProcess) { e.currentTarget.style.backgroundColor = '#213D58'; e.currentTarget.style.borderColor = '#3A6080'; } }}
          onMouseLeave={e => { if (canProcess) { e.currentTarget.style.backgroundColor = '#1C3348'; e.currentTarget.style.borderColor = '#2A4A62'; } }}
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 animate-spin-slow" />Memproses...</>
          ) : 'Proses Data'}
        </button>

        {/* Mode info */}
        <div className="rounded-lg p-3" style={{ backgroundColor: '#0C1018', border: '1px solid #1C2738' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#253347' }}>Mode</p>
          <p className="text-[12px] font-medium" style={{ color: '#5A8FA8' }}>{mode}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#37475A' }}>{modeDesc[mode]}</p>
        </div>

      </div>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1C2738' }}>
        <p className="text-[11px]" style={{ color: '#253347' }}>Filter Sakti · v2.1</p>
      </div>
    </motion.aside>
  );
}
