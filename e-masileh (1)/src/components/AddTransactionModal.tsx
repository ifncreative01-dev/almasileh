import React, { useState } from 'react';
import { Transaction, SavingsCategory } from '../types';
import { X, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldAlert } from 'lucide-react';
import { parseRupiahInput } from '../data/initialData';

interface AddTransactionModalProps {
  isOpen: boolean;
  initialType?: 'setor' | 'tarik';
  isAdmin: boolean;
  onClose: () => void;
  onSubmit: (trx: Omit<Transaction, 'id' | 'referenceNumber'>) => Promise<void>;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  initialType = 'setor',
  isAdmin,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<'setor' | 'tarik'>(initialType);
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<SavingsCategory>('Simpanan Sukarela');
  const [channel, setChannel] = useState<Transaction['channel']>('Transfer Bank');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numericAmount = parseRupiahInput(amountStr);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Harap masukkan nominal transaksi yang valid.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: numericAmount,
        category,
        title: type === 'setor' ? `Setor ${category}` : `Penarikan Dana ${category}`,
        date,
        time,
        status: 'verified',
        channel,
        notes,
      });
      onClose();
      // Reset form
      setAmountStr('');
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan transaksi ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  const setPresetAmount = (preset: number) => {
    setAmountStr(preset.toLocaleString('id-ID'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              type === 'setor' ? 'bg-[#F2F8F6] text-[#087F6B]' : 'bg-[#FAF7F5] text-[#E56B6F]'
            }`}>
              {type === 'setor' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#17211F]">
                {type === 'setor' ? 'Catat Setoran Baru' : 'Catat Penarikan Saldo'}
              </h3>
              <p className="text-[11px] text-[#71807C]">
                Pembukuan Digital Kas Masileh
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

        {/* Non-Admin warning banner if opened */}
        {!isAdmin && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Peringatan: Anda sedang login sebagai non-admin. Permintaan ke server akan ditolak oleh RBAC backend dengan status 403 Forbidden.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3.5 overflow-y-auto flex-1 pr-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('setor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'setor'
                    ? 'bg-[#087F6B] text-white shadow-xs'
                    : 'bg-[#F7F9F8] text-[#71807C] border border-[#E6ECEA]'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Setor (Pemasukan)</span>
              </button>
              <button
                type="button"
                onClick={() => setType('tarik')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'tarik'
                    ? 'bg-[#E56B6F] text-white shadow-xs'
                    : 'bg-[#F7F9F8] text-[#71807C] border border-[#E6ECEA]'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Tarik (Pengeluaran)</span>
              </button>
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1.5">
              Nominal (Rupiah) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#087F6B] text-sm">
                Rp
              </span>
              <input
                type="text"
                required
                value={amountStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setAmountStr(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                }}
                placeholder="0"
                className="w-full pl-11 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-sm font-extrabold text-[#17211F] placeholder-[#71807C] focus:bg-white focus:border-[#087F6B] focus:outline-none transition-all tabular-nums"
              />
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPresetAmount(200000)}
                className="px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#E6ECEA] text-[11px] font-semibold text-[#17211F] hover:bg-[#E6ECEA]"
              >
                +200 Rb
              </button>
              <button
                type="button"
                onClick={() => setPresetAmount(10000000)}
                className="px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#E6ECEA] text-[11px] font-semibold text-[#17211F] hover:bg-[#E6ECEA]"
              >
                +10 Jt
              </button>
              <button
                type="button"
                onClick={() => setPresetAmount(500000000)}
                className="px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#E6ECEA] text-[11px] font-semibold text-[#17211F] hover:bg-[#E6ECEA]"
              >
                +500 Jt
              </button>
              <button
                type="button"
                onClick={() => setPresetAmount(1000000000)}
                className="px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#E6ECEA] text-[11px] font-semibold text-[#17211F] hover:bg-[#E6ECEA]"
              >
                +1 Miliar
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1.5">
              Kategori Tabungan / Alokasi
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SavingsCategory)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-semibold text-[#17211F] focus:bg-white focus:border-[#087F6B] focus:outline-none"
            >
              <option value="Simpanan Sukarela">Simpanan Sukarela</option>
              <option value="Simpanan Wajib">Simpanan Wajib Tahunan</option>
              <option value="Simpanan Pokok">Simpanan Pokok Anggota</option>
              <option value="Kas Operasional">Kas Operasional Paguyuban</option>
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1.5">
              Kanal Setor
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Transaction['channel'])}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-semibold text-[#17211F] focus:bg-white focus:border-[#087F6B] focus:outline-none"
            >
              <option value="Transfer Bank">Transfer Bank (BSI / Mandiri / BCA)</option>
              <option value="Tunai / Pengurus">Tunai ke Bendahara Masileh</option>
              <option value="QRIS Komunitas">QRIS Komunitas Masileh</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1.5">
              Catatan Transaksi
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Setoran alokasi kas bulan September"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs text-[#17211F] focus:bg-white focus:border-[#087F6B] focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6ECEA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E6ECEA] text-xs font-bold text-[#71807C] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                type === 'setor' ? 'bg-[#087F6B] hover:bg-[#045C4E]' : 'bg-[#E56B6F] hover:bg-[#c94b4f]'
              }`}
            >
              {submitting ? 'Menyimpan...' : type === 'setor' ? 'Simpan Setoran' : 'Simpan Penarikan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
