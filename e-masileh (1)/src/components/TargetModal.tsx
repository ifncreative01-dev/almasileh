import React, { useState } from 'react';
import { X, Target, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { formatRupiah, parseRupiahInput } from '../data/initialData';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmount: number;
  targetAmount: number;
  onUpdateTarget: (newTarget: number) => void;
}

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  currentAmount,
  targetAmount,
  onUpdateTarget,
}) => {
  const [valStr, setValStr] = useState(targetAmount.toLocaleString('id-ID'));

  if (!isOpen) return null;

  const percentage = targetAmount > 0 
    ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100) 
    : 0;

  const remaining = Math.max(0, targetAmount - currentAmount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRupiahInput(valStr);
    if (parsed > 0) {
      onUpdateTarget(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211F]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#17211F]">
              Target Tabungan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status */}
        <div className="mt-4 p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#71807C]">Capaian Saat Ini</span>
            <span className="font-extrabold text-[#087F6B] text-sm tabular-nums">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#E6ECEA] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#087F6B] to-[#19B89A] transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div>
              <span className="text-[#71807C] block text-[11px]">Terkumpul:</span>
              <span className="font-bold text-[#17211F]">{formatRupiah(currentAmount)}</span>
            </div>
            <div>
              <span className="text-[#71807C] block text-[11px]">Kekurangan:</span>
              <span className="font-bold text-[#E56B6F]">{formatRupiah(remaining)}</span>
            </div>
          </div>
        </div>

        {/* Target Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Ubah Target Nominal (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#087F6B]">
                Rp
              </span>
              <input
                type="text"
                value={valStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setValStr(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                }}
                className="w-full pl-11 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-sm font-bold text-[#17211F] focus:outline-none focus:border-[#087F6B] focus:bg-white tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#71807C]">
            <Sparkles className="w-3.5 h-3.5 text-[#19B89A]" />
            <span>Target dapat disesuaikan untuk kebutuhan pribadi maupun kelompok.</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              Simpan Target Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
