import React from 'react';
import { Calendar, ArrowDownLeft, ArrowUpRight, TrendingUp, ChevronDown } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

interface MonthlySummaryProps {
  currentMonth: string; // e.g. "September 2026"
  totalDeposit: number;
  totalWithdraw: number;
  availableMonths: string[];
  onSelectMonth: (month: string) => void;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  currentMonth,
  totalDeposit,
  totalWithdraw,
  availableMonths,
  onSelectMonth,
}) => {
  const [isOpenMonthDropdown, setIsOpenMonthDropdown] = React.useState(false);
  const netSavings = totalDeposit - totalWithdraw;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6ECEA] p-5 sm:p-6 shadow-sm">
      {/* Header matching screenshot "Rekap September 2026" */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#17211F]">
            Rekap {currentMonth}
          </h3>
        </div>

        {/* Month Selector dropdown */}
        <div className="relative">
          <button
            id="btn-select-month-dropdown"
            onClick={() => setIsOpenMonthDropdown(!isOpenMonthDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6ECEA] text-xs font-semibold text-[#71807C] hover:text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
          >
            <span>Pilih Bulan</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isOpenMonthDropdown && (
            <div className="absolute right-0 mt-1 z-20 w-44 rounded-2xl bg-white border border-[#E6ECEA] shadow-lg py-1.5">
              {availableMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onSelectMonth(m);
                    setIsOpenMonthDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F7F9F8] transition-colors flex items-center justify-between ${
                    m === currentMonth ? 'text-[#087F6B] font-bold bg-[#087F6B]/5' : 'text-[#17211F]'
                  }`}
                >
                  <span>{m}</span>
                  {m === currentMonth && <span className="w-1.5 h-1.5 rounded-full bg-[#087F6B]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two columns: Setor vs Tarik matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
        {/* Setor Card */}
        <div className="rounded-2xl p-4 bg-[#F2F8F6] border border-[#19B89A]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#087F6B]">
              <div className="w-6 h-6 rounded-lg bg-[#087F6B] text-white flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <span>Setor</span>
            </div>
            <span className="text-[10px] font-semibold text-[#087F6B] uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full border border-[#19B89A]/20">
              Pemasukan
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-[#71807C]">Total Penyetoran</span>
            <p className="text-lg sm:text-xl font-extrabold text-[#087F6B] tracking-tight tabular-nums mt-0.5">
              {formatRupiah(totalDeposit)}
            </p>
          </div>
        </div>

        {/* Tarik Card */}
        <div className="rounded-2xl p-4 bg-[#FAF7F5] border border-[#E6ECEA] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E56B6F]">
              <div className="w-6 h-6 rounded-lg bg-[#E56B6F]/10 text-[#E56B6F] flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span>Tarik</span>
            </div>
            <span className="text-[10px] font-semibold text-[#71807C] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#E6ECEA]">
              Pengeluaran
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-[#71807C]">Total Penarikan</span>
            <p className="text-lg sm:text-xl font-extrabold text-[#17211F] tracking-tight tabular-nums mt-0.5">
              {formatRupiah(totalWithdraw)}
            </p>
          </div>
        </div>
      </div>

      {/* Net monthly progress indicator */}
      <div className="mt-4 pt-3 border-t border-[#E6ECEA]/70 flex items-center justify-between text-xs text-[#71807C]">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#16A36F]" />
          <span>Surplus Tabungan Bulan Ini:</span>
        </div>
        <span className="font-bold text-[#087F6B]">
          +{formatRupiah(netSavings)}
        </span>
      </div>
    </div>
  );
};
