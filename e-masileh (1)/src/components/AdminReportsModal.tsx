import React, { useState, useEffect } from 'react';
import { api, UserSession } from '../services/api';
import { X, FileBarChart, ShieldCheck, Printer, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

interface AdminReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
}

export const AdminReportsModal: React.FC<AdminReportsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen, currentUser]);

  const loadReport = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getReport();
      setReportData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat laporan resmi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#17211F]">
                Laporan Keuangan & Audit Kas Masileh
              </h3>
              <p className="text-xs text-[#71807C]">
                Khusus Otoritas Pengurus & Bendahara (Admin)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage ? (
          <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>403 FORBIDDEN - AKSES DITOLAK</span>
            </div>
            <p>{errorMessage}</p>
          </div>
        ) : loading || !reportData ? (
          <div className="py-12 text-center text-xs text-[#71807C]">
            Mengambil data audit dari server...
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#71807C] block">Nomor Berkas:</span>
                <span className="font-mono font-bold text-[#17211F]">{reportData.reportId}</span>
              </div>
              <div className="text-right">
                <span className="text-[#71807C] block">Otorisator:</span>
                <span className="font-bold text-[#087F6B]">{reportData.generatedBy}</span>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F2F8F6] border border-[#19B89A]/30">
                <span className="text-[11px] font-bold text-[#087F6B] block">
                  Total Setoran Masuk
                </span>
                <p className="text-base sm:text-lg font-black text-[#087F6B] mt-1 tabular-nums">
                  {formatRupiah(reportData.summary.totalDeposit)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E6ECEA]">
                <span className="text-[11px] font-bold text-[#71807C] block">
                  Total Penarikan Keluar
                </span>
                <p className="text-base sm:text-lg font-black text-[#17211F] mt-1 tabular-nums">
                  {formatRupiah(reportData.summary.totalWithdraw)}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6ECEA]">
                <span className="text-[11px] font-bold text-[#71807C] block">
                  Surplus Kas Bersih
                </span>
                <p className="text-base sm:text-lg font-black text-[#087F6B] mt-1 tabular-nums">
                  {formatRupiah(reportData.summary.netBalance)}
                </p>
              </div>
            </div>

            {/* Audit trail */}
            <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6ECEA] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#16A36F] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status Verifikasi: {reportData.auditTrail.status}</span>
              </div>
              <p className="text-[#71807C]">
                Dewan Pengawas: {reportData.auditTrail.auditor}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Laporan Pembukuan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
