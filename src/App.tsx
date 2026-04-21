import { motion } from 'framer-motion';
import { FileSpreadsheet } from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MetricsCards } from '@/components/MetricsCards';
import { DataTable } from '@/components/DataTable';
import { DownloadButton } from '@/components/DownloadButton';
import { useAppState } from '@/hooks/useAppState';

const MODE_DESC: Record<string, string> = {
  WSA: 'Validasi & filter AO/PDA/WSA — tipe CREATE & MIGRATE',
  MODOROSO: 'Proses order MO/DO dengan deteksi tipe otomatis',
  WAPPR: 'Filter status WAPPR untuk AO & PDA',
};

export default function App() {
  const {
    mode, status, error,
    sheetStatus, sheetInfo,
    selectedMonths, mainFile,
    processedData, metrics, columns,
    handleModeChange, handleMainFileUpload, handleProcess,
    handleDownload, toggleMonth, clearMainFile, retrySheetFetch,
  } = useAppState();

  const showResults = status === 'complete' && processedData !== null;
  const showEmpty   = !mainFile && status === 'idle';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0C1018' }}>
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        sheetStatus={sheetStatus}
        sheetName={sheetInfo?.sheetName}
        onRetry={retrySheetFetch}
      />

      <Sidebar
        mode={mode}
        status={status}
        error={error}
        sheetStatus={sheetStatus}
        sheetTotalRows={sheetInfo?.totalRows}
        selectedMonths={selectedMonths}
        mainFile={mainFile}
        onMainFileUpload={handleMainFileUpload}
        onProcess={handleProcess}
        onToggleMonth={toggleMonth}
        onClearMainFile={clearMainFile}
      />

      {/* Main */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
        style={{ marginLeft: '256px', paddingTop: '52px', backgroundColor: '#0C1018' }}
      >
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* Title */}
          <div style={{ paddingBottom: '4px', borderBottom: '1px solid #1C2738' }}>
            <div className="flex items-baseline gap-2">
              <h1 className="text-[18px] font-heading font-bold" style={{ color: '#8BBDD4', letterSpacing: '-0.3px' }}>
                {mode}
              </h1>
              <span className="text-[13px]" style={{ color: '#37475A' }}>/</span>
              <span className="text-[13px]" style={{ color: '#445566' }}>Dashboard</span>
            </div>
            <p className="text-[12px] mt-0.5" style={{ color: '#37475A' }}>{MODE_DESC[mode]}</p>
          </div>

          {/* Metrics */}
          <MetricsCards metrics={metrics} visible={showResults} />

          {/* Table */}
          <DataTable data={processedData || []} columns={columns} visible={showResults} />

          {/* Download */}
          <DownloadButton
            onClick={handleDownload}
            disabled={!showResults}
            mode={mode}
            rowCount={showResults ? processedData!.length : undefined}
          />

          {/* Empty State */}
          {showEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#111820', border: '1px solid #1C2738' }}
              >
                <FileSpreadsheet className="w-6 h-6" style={{ color: '#37475A' }} />
              </div>
              <p className="text-[14px] font-medium mb-1.5" style={{ color: '#5A6B7C' }}>Siap memproses</p>
              <p className="text-[12px] max-w-[300px] leading-relaxed" style={{ color: '#37475A' }}>
                Upload file data di sidebar. Deduplikasi akan berjalan otomatis dengan data Google Sheets.
              </p>
              <div className="flex items-center gap-2 mt-5">
                {['.xlsx', '.xls', '.csv'].map(ext => (
                  <span
                    key={ext}
                    className="text-[11px] px-2.5 py-1 rounded"
                    style={{ backgroundColor: '#111820', color: '#37475A', border: '1px solid #1C2738' }}
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin-slow mb-3"
                style={{ borderColor: '#2A4A62', borderTopColor: 'transparent' }}
              />
              <p className="text-[12px]" style={{ color: '#445566' }}>Memproses data...</p>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
