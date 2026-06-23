import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Check, CheckSquare } from 'lucide-react';
import type { DataRow } from '@/types';

interface DataTableProps {
  data: DataRow[];
  columns: string[];
  visible: boolean;
}

const ROWS_PER_PAGE = 50;

export function DataTable({ data, columns, visible }: DataTableProps) {
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  // ── Developer-only checkbox mode (Ctrl+0) ──────────────────────────────────
  const [devMode, setDevMode] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Listen for Ctrl+0 to toggle dev mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        setDevMode(prev => {
          if (prev) {
            // turning off → clear selections
            setCheckedRows(new Set());
            setSelectedCategory('');
          }
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const uniqueStatuses = useMemo(() => {
    if (!devMode || !columns.includes('Status')) return [];
    const cats = new Set<string>();
    data.forEach(row => {
      const val = row['Status'];
      if (val !== null && val !== undefined && val !== '') {
        cats.add(String(val).trim());
      }
    });
    return Array.from(cats).sort();
  }, [data, devMode, columns]);

  const toggleRow = useCallback((globalIdx: number) => {
    setCheckedRows(prev => {
      const next = new Set(prev);
      if (next.has(globalIdx)) next.delete(globalIdx);
      else next.add(globalIdx);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const total = data.length;
    if (checkedRows.size === total) {
      setCheckedRows(new Set());
    } else {
      setCheckedRows(new Set(Array.from({ length: total }, (_, i) => i)));
    }
  }, [data.length, checkedRows.size]);

  // ── Copy logic ─────────────────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    // In dev mode with selections/category → copy specific rows
    const targetData = (() => {
      if (!devMode) return data;
      if (checkedRows.size > 0) return data.filter((_, i) => checkedRows.has(i));
      if (selectedCategory) return data.filter(row => String(row['Status']).trim() === selectedCategory);
      return data;
    })();

    const text = targetData
      .map(row =>
        columns.map(col => {
          const v = row[col];
          if (v === null || v === undefined) return '';
          return String(v);
        }).join('\t')
      )
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data, columns, devMode, checkedRows, selectedCategory]);

  if (!visible) return null;

  const total = Math.ceil(data.length / ROWS_PER_PAGE);
  const start = (page - 1) * ROWS_PER_PAGE;
  const pageData = data.slice(start, start + ROWS_PER_PAGE);
  const fmt = (v: unknown) => (v === null || v === undefined) ? '' : String(v);

  const allChecked = checkedRows.size === data.length && data.length > 0;
  const someChecked = checkedRows.size > 0 && !allChecked;

  const btnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 6,
    border: '1px solid #E2E5EA', backgroundColor: '#FFFFFF',
    cursor: 'pointer', color: '#6B7280',
    transition: 'all 0.15s',
  } as React.CSSProperties;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Plus Jakarta Sans' }}>
            Data Unik
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
            backgroundColor: '#FEF2F2', color: '#C0392B', border: '1px solid #FECACA'
          }}>
            {data.length.toLocaleString()} baris
          </span>

          {/* Dev mode indicator — subtle, barely visible */}
          <AnimatePresence>
            {devMode && (
              <motion.span
                key="devbadge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                  backgroundColor: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}
              >
                <CheckSquare style={{ width: 9, height: 9 }} />
                {checkedRows.size > 0 ? `${checkedRows.size} dipilih` : 'pilih baris'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Category Dropdown (Dev Mode) */}
          {devMode && uniqueStatuses.length > 0 && (
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCheckedRows(new Set()); // clear checked rows when selecting category
              }}
              style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                border: '1px solid #E2E5EA', backgroundColor: '#F9FAFB',
                color: '#374151', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="">Semua Status</option>
              {uniqueStatuses.map((st: string) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: `1px solid ${copied ? '#BBF7D0' : devMode && checkedRows.size > 0 ? '#BFDBFE' : '#E2E5EA'}`,
              backgroundColor: copied ? '#F0FDF4' : devMode && checkedRows.size > 0 ? '#EFF6FF' : '#FFFFFF',
              color: copied ? '#166534' : devMode && checkedRows.size > 0 ? '#1D4ED8' : '#6B7280',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {copied
              ? <><Check style={{ width: 13, height: 13 }} />Tersalin!</>
              : devMode && checkedRows.size > 0
                ? <><Copy style={{ width: 13, height: 13 }} />Salin {checkedRows.size} baris</>
                : devMode && selectedCategory
                  ? <><Copy style={{ width: 13, height: 13 }} />Salin Kategori ({data.filter(r => String(r['Status']).trim() === selectedCategory).length})</>
                  : <><Copy style={{ width: 13, height: 13 }} />Salin Data</>
            }
          </button>

          {/* Pagination */}
          {total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={btnStyle} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              <span style={{ fontSize: 12, color: '#6B7280', minWidth: 50, textAlign: 'center' }}>
                {page} / {total}
              </span>
              <button style={btnStyle} onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 10, border: `1px solid ${devMode ? '#BFDBFE' : '#E2E5EA'}`, overflow: 'hidden', backgroundColor: '#FFFFFF', transition: 'border-color 0.2s' }}>
        <div style={{ overflowX: 'auto', maxHeight: 460 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#F9FAFB' }}>
              <tr>
                {/* Dev checkbox column header */}
                <AnimatePresence>
                  {devMode && (
                    <motion.th
                      key="chk-header"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        padding: '10px 10px', textAlign: 'center',
                        borderBottom: '1px solid #E2E5EA', width: 40,
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={el => {
                          if (el) el.indeterminate = someChecked;
                        }}
                        onChange={toggleSelectAll}
                        style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563EB' }}
                        title="Pilih semua"
                      />
                    </motion.th>
                  )}
                </AnimatePresence>

                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF', borderBottom: '1px solid #E2E5EA', width: 36, userSelect: 'none' }}>
                  #
                </th>
                {columns.map(col => (
                  <th key={col} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF', borderBottom: '1px solid #E2E5EA', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => {
                const globalIdx = start + i;
                const isChecked = checkedRows.has(globalIdx);
                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: isChecked && devMode ? '#EFF6FF' : '#FFFFFF',
                      cursor: devMode ? 'pointer' : 'default',
                      transition: 'background-color 0.1s',
                    }}
                    onClick={devMode ? () => toggleRow(globalIdx) : undefined}
                    onMouseEnter={e => {
                      if (!isChecked || !devMode)
                        e.currentTarget.style.backgroundColor = devMode ? '#F0F9FF' : '#FEF9F9';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = isChecked && devMode ? '#EFF6FF' : '#FFFFFF';
                    }}
                  >
                    {/* Dev checkbox cell */}
                    {devMode && (
                      <td
                        style={{ padding: '8px 10px', textAlign: 'center', width: 40 }}
                        onClick={e => { e.stopPropagation(); toggleRow(globalIdx); }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(globalIdx)}
                          style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563EB' }}
                        />
                      </td>
                    )}

                    <td style={{ padding: '8px 12px', fontSize: 11, color: '#D1D5DB', fontFamily: 'JetBrains Mono, monospace', userSelect: 'none' }}>
                      {globalIdx + 1}
                    </td>
                    {columns.map(col => (
                      <td key={col}
                        style={{ padding: '8px 12px', fontSize: 12, color: '#374151', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}
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
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
        Baris {start + 1}–{Math.min(start + ROWS_PER_PAGE, data.length)} dari {data.length.toLocaleString()}
        {total > 1 && ` · Halaman ${page}/${total}`}
        {devMode && checkedRows.size > 0 && (
          <span style={{ color: '#2563EB', marginLeft: 8 }}>
            · {checkedRows.size} baris dipilih
          </span>
        )}
      </p>
    </motion.div>
  );
}
