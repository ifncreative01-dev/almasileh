import React, { useState } from 'react';
import { Eye, EyeOff, PlusCircle, ArrowUpRight, FileText, Target, Wallet, CheckCircle2, Lock } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

interface TotalSavingsCardProps {
  totalAmount: number;
  transactionCount: number;
  targetAmount: number;
  isAdmin: boolean;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenStatement: () => void;
  onOpenTargetModal: () => void;
  onUnauthorizedAction: (actionName: string) => void;
}

export const TotalSavingsCard: React.FC<TotalSavingsCardProps> = ({
  totalAmount,
  transactionCount,
  targetAmount,
  isAdmin,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenStatement,
  onOpenTargetModal,
  onUnauthorizedAction,
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const targetPercentage = targetAmount > 0 
    ? Math.min(Math.round((totalAmount / targetAmount) * 100), 100) 
    : 0;

  const handleDepositClick = () => {
    if (isAdmin) {
      onOpenDeposit();
    } else {
      onUnauthorizedAction('Tambah Setoran Tabungan');
    }
  };

  const handleWithdrawClick = () => {
    if (isAdmin) {
      onOpenWithdraw();
    } else {
      onUnauthorizedAction('Tambah Penarikan Saldo');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#E6ECEA] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-[#71807C] tracking-wide">
            Total Tabungan
          </span>
        </div>

        <button
          id="btn-toggle-balance-visibility"
          onClick={() => setShowBalance(!showBalance)}
          title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
          className="p-1.5 rounded-lg text-[#71807C] hover:text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
        >
          {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Balance Display */}
      <div className="mt-4">
        {showBalance ? (
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#087F6B]">
              Rp
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17211F] tracking-tight tabular-nums">
              {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <span className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-widest select-none">
              ••••••••••••
            </span>
          </div>
        )}

        {/* Subtitle badge matching screenshot "3 transaksi tercatat" */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-medium text-[#71807C]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36F]" />
            <span>
              <strong className="text-[#17211F] font-bold">{transactionCount}</strong> transaksi tercatat
            </span>
          </span>

          <span className="text-[11px] text-[#71807C]">
            • Terverifikasi Kas Masileh
          </span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="mt-5 pt-4 border-t border-[#E6ECEA]/70">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#71807C] font-medium flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[#087F6B]" />
            <span>Target Tabungan Komunitas</span>
          </span>
          <span className="font-bold text-[#17211F]">
            {targetPercentage}% ({formatRupiah(targetAmount)})
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#E6ECEA] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#087F6B] to-[#19B89A] transition-all duration-500"
            style={{ width: `${targetPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Action Grid with Role Badges */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-[#E6ECEA]">
        {/* Setor Button */}
        <button
          id="btn-action-setor"
          onClick={handleDepositClick}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer group relative ${
            isAdmin
              ? 'bg-[#087F6B] hover:bg-[#045C4E] text-white shadow-xs'
              : 'bg-[#F7F9F8] border border-[#E6ECEA] text-[#71807C] hover:border-[#E8A23A]'
          }`}
          title={isAdmin ? "Tambah Setoran Kas" : "Khusus Admin (Non-Admin Diblokir Backend)"}
        >
          {!isAdmin && (
            <div className="absolute top-1 right-1">
              <Lock className="w-3 h-3 text-[#E8A23A]" />
            </div>
          )}
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${
            isAdmin ? 'bg-white/20 text-white' : 'bg-[#E6ECEA] text-[#71807C]'
          }`}>
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
            Setor
          </span>
        </button>

        {/* Tarik Button */}
        <button
          id="btn-action-tarik"
          onClick={handleWithdrawClick}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer group relative ${
            isAdmin
              ? 'bg-[#FFFFFF] hover:bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F] hover:border-[#E56B6F]/40'
              : 'bg-[#F7F9F8] border border-[#E6ECEA] text-[#71807C] hover:border-[#E8A23A]'
          }`}
          title={isAdmin ? "Tarik Saldo" : "Khusus Admin (Non-Admin Diblokir Backend)"}
        >
          {!isAdmin && (
            <div className="absolute top-1 right-1">
              <Lock className="w-3 h-3 text-[#E8A23A]" />
            </div>
          )}
          <div className="w-8 h-8 rounded-xl bg-[#E56B6F]/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4 text-[#E56B6F]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#17211F] whitespace-nowrap">
            Tarik
          </span>
        </button>

        {/* Cetak Rekap Button (Accessible for everyone, or admin reports) */}
        <button
          id="btn-action-rekap"
          onClick={onOpenStatement}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F] hover:border-[#087F6B]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          title="Lihat Rekening Koran Digital"
        >
          <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4 text-[#087F6B]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#17211F] whitespace-nowrap">
            Rekap
          </span>
        </button>

        {/* Target Button */}
        <button
          id="btn-action-target"
          onClick={onOpenTargetModal}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F] hover:border-[#E8A23A]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          title="Target Tabungan"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E8A23A]/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Target className="w-4 h-4 text-[#E8A23A]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#17211F] whitespace-nowrap">
            Target
          </span>
        </button>
      </div>
    </div>
  );
};
