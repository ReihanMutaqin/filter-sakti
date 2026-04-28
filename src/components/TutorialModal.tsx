import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

import gif1 from './gif/1.gif';
import gif2 from './gif/2.gif';
import gif3 from './gif/3.gif';

const STEPS = [
  {
    step: 1,
    title: 'Siapkan File Data',
    desc: 'Pastikan file Excel/CSV kamu berisi kolom INET dan SC yang valid. File harus berformat .xlsx, .xls, atau .csv.',
    gif: gif1,
  },
  {
    step: 2,
    title: 'Upload & Pilih Bulan',
    desc: 'Klik area upload di sidebar atau drag & drop file data kamu. Pilih bulan yang ingin difilter, lalu klik tombol "Proses Data".',
    gif: gif2,
  },
  {
    step: 3,
    title: 'Download Hasil',
    desc: 'Setelah data diproses, kamu bisa download hasil dalam format terformat atau raw. Data sudah otomatis deduplikasi dengan Google Sheets.',
    gif: gif3,
  },
];

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

export function TutorialModal({ open, onClose }: TutorialModalProps) {
  const [step, setStep] = useState(0);

  // Reset ke step 1 setiap buka modal
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Tutup dengan Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(3px)',
              zIndex: 200,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: 'calc(50% + 128px)',
              transform: 'translate(-50%, -50%)',
              zIndex: 201,
              width: 'min(680px, calc(100vw - 280px))',
              maxHeight: '90vh',
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header modal */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen style={{ width: 14, height: 14, color: '#C0392B' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Tutorial MODOROSO</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>Cara mengambil data MO/DO</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: 6, borderRadius: 6, border: 'none',
                  backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Step indicator */}
            <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                    border: `1px solid ${i === step ? '#FECACA' : '#E2E5EA'}`,
                    backgroundColor: i === step ? '#FEF2F2' : '#F9FAFB',
                    color: i === step ? '#C0392B' : '#9CA3AF',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    backgroundColor: i === step ? '#C0392B' : '#E2E5EA',
                    color: i === step ? '#fff' : '#9CA3AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, flexShrink: 0,
                  }}>{s.step}</span>
                  {s.title}
                </button>
              ))}
            </div>

            {/* GIF area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                style={{ padding: '14px 20px', overflowY: 'auto' }}
              >
                {/* GIF frame */}
                <div style={{
                  borderRadius: 10, overflow: 'hidden',
                  border: '1px solid #E2E5EA',
                  backgroundColor: '#F9FAFB',
                  aspectRatio: '16/9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <img
                    src={current.gif}
                    alt={`Step ${current.step}: ${current.title}`}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  {/* Step badge */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    padding: '3px 10px', borderRadius: 20,
                    backgroundColor: 'rgba(192,57,43,0.85)',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}>
                    Step {current.step} / {STEPS.length}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                    {current.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                    {current.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer nav */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: '1px solid #E2E5EA',
                  backgroundColor: step === 0 ? '#F9FAFB' : '#FFFFFF',
                  color: step === 0 ? '#D1D5DB' : '#374151',
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Sebelumnya
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                      border: 'none',
                      backgroundColor: i === step ? '#C0392B' : '#E2E5EA',
                      cursor: 'pointer', transition: 'all 0.2s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: '1px solid #C0392B',
                    backgroundColor: '#C0392B', color: '#FFFFFF',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B'; }}
                >
                  Selanjutnya <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: '1px solid #C0392B',
                    backgroundColor: '#C0392B', color: '#FFFFFF',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B'; }}
                >
                  Selesai ✓
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
