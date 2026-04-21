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
    mode,
    status,
    error,
    sheetStatus,
    sheetInfo,
    sheetError: _sheetError,
    selectedMonths,
    mainFile,
    processedData,
    metrics,
    columns,
    handleModeChange,
    handleMainFileUpload,
    handleProcess,
    handleDownload,
    toggleMonth,
    clearMainFile,
    retrySheetFetch,
  } = useAppState();

  const showResults = status === 'complete' && processedData !== null;
  const showEmpty = !mainFile && status === 'idle';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#090D15' }}>
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

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="ml-[268px] pt-14 min-h-screen"
        style={{ backgroundColor: '#090D15' }}
      >
        <div className="p-6 space-y-5">
          {/* Page Title */}
          <div>
            <h1 className="font-heading font-bold text-[22px] text-[#F1F5F9] tracking-tight">
              Dashboard{' '}
              <span style={{ color: '#3B82F6' }}>{mode}</span>
            </h1>
            <p className="text-[13px] mt-1" style={{ color: '#475569' }}>
              {MODE_DESC[mode]}
            </p>
          </div>

          {/* Metrics */}
          <MetricsCards metrics={metrics} visible={showResults} />

          {/* Data Table */}
          <DataTable
            data={processedData || []}
            columns={columns}
            visible={showResults}
          />

          {/* Download Button */}
          <DownloadButton
            onClick={handleDownload}
            disabled={!showResults}
            mode={mode}
            rowCount={showResults ? processedData!.length : undefined}
          />

          {/* Empty State */}
          {showEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.07)', border: '1px solid rgba(59, 130, 246, 0.15)' }}
              >
                <FileSpreadsheet className="w-7 h-7" style={{ color: '#3B82F6', opacity: 0.6 }} />
              </div>
              <h3 className="font-heading font-semibold text-[16px] text-[#CBD5E1] mb-2">
                Siap Memproses
              </h3>
              <p className="text-[13px] text-center max-w-sm leading-relaxed" style={{ color: '#334155' }}>
                Upload file data di sidebar kiri. Deduplikasi akan berjalan otomatis menggunakan data dari Google Sheets.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {['.xlsx', '.xls', '.csv'].map((ext) => (
                  <div
                    key={ext}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px]"
                    style={{ border: '1px solid #1C2537', color: '#475569' }}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    {ext}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {status === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin-slow mb-4"
                style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }}
              />
              <p className="text-[13px]" style={{ color: '#475569' }}>Memproses data...</p>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
