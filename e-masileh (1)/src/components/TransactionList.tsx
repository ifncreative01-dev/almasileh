import React, { useState } from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, Search, SlidersHorizontal, CheckCircle2, ReceiptText, Lock } from 'lucide-react';
import { formatIndoDate, formatRupiah } from '../data/initialData';

interface TransactionListProps {
  transactions: Transaction[];
  isAdmin: boolean;
  onSelectTransaction: (trx: Transaction) => void;
  onOpenAddModal: () => void;
  onUnauthorizedAction: (actionName: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isAdmin,
  onSelectTransaction,
  onOpenAddModal,
  onUnauthorizedAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((trx) => {
    if (filterType !== 'all' && trx.type !== filterType) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = trx.title.toLowerCase().includes(q);
      const matchCat = trx.category.toLowerCase().includes(q);
      const matchRef = trx.referenceNumber.toLowerCase().includes(q);
      const matchAmount = trx.amount.toString().includes(q);
      return matchTitle || matchCat || matchRef || matchAmount;
    }
    return true;
  });

  const handleAddClick = () => {
    if (isAdmin) {
      onOpenAddModal();
    } else {
      onUnauthorizedAction('Tambah Setoran/Transaksi');
    }
  };

  return (
    <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6ECEA] p-5 sm:p-6 shadow-sm">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
            <ReceiptText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#17211F]">
              Mutasi Tabungan
            </h3>
            <p className="text-xs text-[#71807C]">
              {isAdmin ? 'Admin: Hak Penuh Entri & Validasi Kas' : 'Non-Admin: Mode Pantau Mutasi'}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <button
            onClick={handleAddClick}
            className="self-start sm:self-auto text-xs font-bold text-white bg-[#087F6B] hover:bg-[#045C4E] px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            + Catat Transaksi
          </button>
        ) : (
          <button
            onClick={handleAddClick}
            className="self-start sm:self-auto text-xs font-bold text-[#71807C] bg-[#F7F9F8] border border-[#E6ECEA] px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Tambah transaksi hanya dapat dilakukan oleh Pengurus/Admin"
          >
            <Lock className="w-3 h-3 text-[#E8A23A]" />
            <span>+ Catat Transaksi</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="mt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#71807C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mutasi, nominal, atau nomor ref..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs sm:text-sm text-[#17211F] placeholder-[#71807C] focus:outline-none focus:border-[#087F6B] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71807C] hover:text-[#17211F] px-1"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#087F6B] text-white shadow-xs'
                : 'bg-[#F7F9F8] text-[#71807C] hover:bg-[#E6ECEA] border border-[#E6ECEA]'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('setor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'setor'
                ? 'bg-[#087F6B] text-white shadow-xs'
                : 'bg-[#F7F9F8] text-[#71807C] hover:bg-[#E6ECEA] border border-[#E6ECEA]'
            }`}
          >
            Setoran ({transactions.filter((t) => t.type === 'setor').length})
          </button>
          <button
            onClick={() => setFilterType('tarik')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'tarik'
                ? 'bg-[#087F6B] text-white shadow-xs'
                : 'bg-[#F7F9F8] text-[#71807C] hover:bg-[#E6ECEA] border border-[#E6ECEA]'
            }`}
          >
            Penarikan ({transactions.filter((t) => t.type === 'tarik').length})
          </button>
        </div>
      </div>

      {/* Transaction Items Feed */}
      <div className="mt-4 divide-y divide-[#E6ECEA]/70">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-[#F7F9F8] flex items-center justify-center mx-auto text-[#71807C] mb-2">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#17211F]">
              Tidak ada mutasi transaksi ditemukan
            </p>
            <p className="text-xs text-[#71807C] mt-0.5">
              Coba ganti kata kunci pencarian.
            </p>
          </div>
        ) : (
          filteredTransactions.map((trx) => {
            const isDeposit = trx.type === 'setor';
            return (
              <div
                key={trx.id}
                onClick={() => onSelectTransaction(trx)}
                className="group py-3.5 flex items-center justify-between gap-3 hover:bg-[#F7F9F8]/60 rounded-2xl px-2 transition-colors cursor-pointer"
              >
                {/* Left side: Icon + Title + Meta */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isDeposit
                        ? 'bg-[#F2F8F6] text-[#087F6B] border border-[#19B89A]/30'
                        : 'bg-[#FAF7F5] text-[#E56B6F] border border-[#E56B6F]/20'
                    }`}
                  >
                    {isDeposit ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#17211F] truncate group-hover:text-[#087F6B] transition-colors">
                        {trx.title}
                      </h4>
                      {isAdmin && (
                        <span className="text-[10px] text-[#087F6B] bg-[#087F6B]/10 px-1.5 rounded font-mono hidden sm:inline">
                          Edit
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-[#71807C]">
                        {formatIndoDate(trx.date)} • {trx.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-[#F7F9F8] border border-[#E6ECEA] text-[#71807C] font-semibold">
                        {trx.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount + Status */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs sm:text-sm md:text-base font-extrabold tracking-tight tabular-nums block ${
                      isDeposit ? 'text-[#16A36F]' : 'text-[#17211F]'
                    }`}
                  >
                    {isDeposit ? '+' : '-'}
                    {formatRupiah(trx.amount)}
                  </span>

                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#16A36F]" />
                    <span className="text-[10px] text-[#71807C] font-semibold">
                      Terverifikasi
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
