import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import type { DataRow } from '@/types';

interface DataTableProps {
  data: DataRow[];
  columns: string[];
  visible: boolean;
}

const ROWS_PER_PAGE = 50;

export function DataTable({ data, columns, visible }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const header = columns.join('\t');
    const rows = data
      .map(row => columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        return String(val);
      }).join('\t'))
      .join('\n');
    navigator.clipboard.writeText(`${header}\n${rows}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data, columns]);

  if (!visible) return null;

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const pageData = data.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const fmt = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'boolean') return val ? 'Ya' : 'Tidak';
    return String(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      {/* Table Header Bar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold" style={{ color: '#8BBDD4' }}>
            Data Unik
          </h3>
          <span
            className="text-[11px] px-2 py-0.5 rounded"
            style={{ backgroundColor: '#1C2738', color: '#5A6B7C' }}
          >
            {data.length.toLocaleString()} baris
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy All Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150"
            style={{
              backgroundColor: copied ? '#0E1E16' : '#111820',
              color: copied ? '#4A8F68' : '#5A6B7C',
              border: `1px solid ${copied ? '#1E3328' : '#1C2738'}`,
            }}
            title="Salin semua data ke clipboard"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" />Tersalin!</>
              : <><Copy className="w-3.5 h-3.5" />Salin Semua</>
            }
          </button>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded transition-colors disabled:opacity-25"
                style={{ color: '#5A6B7C', border: '1px solid #1C2738' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#7AACCA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5A6B7C')}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] px-2" style={{ color: '#445566' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded transition-colors disabled:opacity-25"
                style={{ color: '#5A6B7C', border: '1px solid #1C2738' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#7AACCA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5A6B7C')}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1C2738' }}>
        <div className="overflow-auto" style={{ maxHeight: '480px' }}>
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr style={{ backgroundColor: '#111820' }}>
                <th
                  className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#37475A', borderBottom: '1px solid #1C2738', width: '40px' }}
                >
                  #
                </th>
                {columns.map(col => (
                  <th
                    key={col}
                    className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: '#37475A', borderBottom: '1px solid #1C2738' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, idx) => {
                const absIdx = startIdx + idx;
                return (
                  <tr
                    key={idx}
                    style={{ backgroundColor: '#0C1018', borderBottom: '1px solid #141E2A' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#10192A')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0C1018')}
                  >
                    <td
                      className="px-3 py-2 text-[11px] select-none"
                      style={{ color: '#253347', fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {absIdx + 1}
                    </td>
                    {columns.map(col => (
                      <td
                        key={col}
                        className="px-3 py-2 text-[12px] whitespace-nowrap max-w-[280px] truncate"
                        style={{ color: '#8A9BAC', fontFamily: 'JetBrains Mono, monospace' }}
                        title={fmt(row[col])}
                      >
                        {fmt(row[col])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <p className="text-[11px] mt-1.5" style={{ color: '#253347' }}>
        Menampilkan {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, data.length)} dari {data.length.toLocaleString()} baris
        {totalPages > 1 && ` · Halaman ${currentPage}/${totalPages}`}
      </p>
    </motion.div>
  );
}
