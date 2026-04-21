import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DataRow } from '@/types';

interface DataTableProps {
  data: DataRow[];
  columns: string[];
  visible: boolean;
}

const ROWS_PER_PAGE = 50;

export function DataTable({ data, columns, visible }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!visible) return null;

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = data.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const formatCellValue = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-base text-[#F0F4F8]">
            Preview Data Unik
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: '#3B82F6',
            }}
          >
            {data.length.toLocaleString()} baris
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-white/[0.08] text-[#8B9CB5] hover:text-[#F0F4F8] hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#8B9CB5] min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-white/[0.08] text-[#8B9CB5] hover:text-[#F0F4F8] hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#0D1117', border: '1px solid #1C2537' }}
      >
        <div className="overflow-auto max-h-[500px] custom-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr style={{ backgroundColor: '#0D1117' }}>
                {columns.map(col => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap border-b" style={{ color: '#475569', borderColor: '#1C2537' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition-colors duration-150 border-b last:border-b-0"
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#0D1117' : 'rgba(255,255,255,0.015)',
                    borderColor: '#1C2537',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? '#0D1117' : 'rgba(255,255,255,0.015)';
                  }}
                >
                  {columns.map(col => (
                    <td
                      key={col}
                      className="px-4 py-2.5 text-[12px] font-mono whitespace-nowrap max-w-[300px] truncate" style={{ color: '#CBD5E1' }}
                    >
                      {formatCellValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
