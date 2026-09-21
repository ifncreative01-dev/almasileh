import React, { useState } from 'react';
import { Transaction, SavingsCategory } from '../types';
import { X, Printer, Share2, CheckCircle2, Building, ArrowDownLeft, ArrowUpRight, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import { formatIndoDate, formatRupiah } from '../data/initialData';

interface ReceiptModalProps {
  transaction: Transaction | null;
  isAdmin: boolean;
  onClose: () => void;
  onUpdateTransaction?: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isAdmin,
  onClose,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCategory, setEditedCategory] = useState<SavingsCategory>('Simpanan Sukarela');
  const [editedNotes, setEditedNotes] = useState('');

  if (!transaction) return null;

  const isDeposit = transaction.type === 'setor';

  const handleStartEdit = () => {
    setEditedTitle(transaction.title);
    setEditedCategory(transaction.category);
    setEditedNotes(transaction.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTransaction) {
      onUpdateTransaction(transaction.id, {
        title: editedTitle,
        category: editedCategory,
        notes: editedNotes,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus transaksi ${transaction.referenceNumber}? Tindakan ini memerlukan otorisasi Admin.`)) {
      if (onDeleteTransaction) {
        onDeleteTransaction(transaction.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#087F6B]">
            <Building className="w-4 h-4" />
            <span>Kuitansi Digital e-Masileh</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {isEditing && isAdmin ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F2F8F6] border border-[#19B89A]/30 text-[#087F6B] font-bold">
                Mode Edit Transaksi (Otoritas Admin)
              </div>
              <div>
                <label className="block font-bold text-[#71807C] mb-1">Judul Transaksi</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] font-bold text-[#17211F]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#71807C] mb-1">Kategori Simpanan</label>
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value as SavingsCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] font-semibold text-[#17211F]"
                >
                  <option value="Simpanan Sukarela">Simpanan Sukarela</option>
                  <option value="Simpanan Wajib">Simpanan Wajib</option>
                  <option value="Simpanan Pokok">Simpanan Pokok</option>
                  <option value="Kas Operasional">Kas Operasional</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#71807C] mb-1">Catatan / Keterangan</label>
                <textarea
                  rows={2}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-xl border border-[#E6ECEA] text-[#71807C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#087F6B] text-white font-bold"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Slip Card */}
              <div className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                    isDeposit
                      ? 'bg-[#F2F8F6] text-[#087F6B] border border-[#19B89A]/30'
                      : 'bg-[#FAF7F5] text-[#E56B6F] border border-[#E56B6F]/20'
                  }`}
                >
                  {isDeposit ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#71807C]">
                    {isDeposit ? 'Nominal Setoran Masuk' : 'Nominal Penarikan Dana'}
                  </span>
                  <p
                    className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums mt-0.5 ${
                      isDeposit ? 'text-[#16A36F]' : 'text-[#17211F]'
                    }`}
                  >
                    {isDeposit ? '+' : '-'} {formatRupiah(transaction.amount)}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#E6ECEA] text-[11px] font-bold text-[#087F6B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36F]" />
                  <span>BERHASIL DIBUKUKAN</span>
                </div>
              </div>

              {/* Data Rows */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E6ECEA]/60">
                  <span className="text-[#71807C]">Nomor Referensi</span>
                  <span className="font-mono font-bold text-[#17211F]">{transaction.referenceNumber}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#E6ECEA]/60">
                  <span className="text-[#71807C]">Kategori</span>
                  <span className="font-bold text-[#17211F]">{transaction.category}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#E6ECEA]/60">
                  <span className="text-[#71807C]">Waktu Transaksi</span>
                  <span className="font-semibold text-[#17211F]">{formatIndoDate(transaction.date)}, {transaction.time} WIB</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#E6ECEA]/60">
                  <span className="text-[#71807C]">Kanal Pembayaran</span>
                  <span className="font-semibold text-[#17211F]">{transaction.channel || 'Transfer Bank'}</span>
                </div>

                {transaction.notes && (
                  <div className="py-1">
                    <span className="text-[#71807C] block mb-1">Catatan:</span>
                    <p className="p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F] text-[11px] leading-relaxed">
                      {transaction.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E6ECEA] space-y-2">
          {/* Admin Edit / Delete Controls */}
          {isAdmin && !isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartEdit}
                className="flex-1 py-2 rounded-xl border border-[#087F6B] text-[#087F6B] hover:bg-[#087F6B]/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Transaksi</span>
              </button>

              <button
                onClick={handleDelete}
                className="py-2 px-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                title="Hapus Transaksi"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2 px-3 rounded-xl border border-[#E6ECEA] bg-[#FFFFFF] hover:bg-[#F7F9F8] text-xs font-semibold text-[#17211F] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#087F6B]" />
              <span>Cetak Bukti</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
