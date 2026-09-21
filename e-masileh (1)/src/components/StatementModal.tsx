import React from 'react';
import { Transaction, MemberProfile } from '../types';
import { IslamicEmblem } from './IslamicEmblem';
import { X, Printer, Download, Calendar, ShieldCheck } from 'lucide-react';
import { formatIndoDate, formatRupiah } from '../data/initialData';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  member: MemberProfile;
  totalSavings: number;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
  transactions,
  member,
  totalSavings,
}) => {
  if (!isOpen) return null;

  const totalDeposit = transactions
    .filter((t) => t.type === 'setor')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === 'tarik')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#17211F]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Navigation Bar */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#087F6B] uppercase tracking-wider bg-[#087F6B]/10 px-2.5 py-1 rounded-full">
              Laporan Rekapitulasi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087F6B] text-white text-xs font-bold hover:bg-[#045C4E] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document */}
        <div className="pt-4">
          {/* Header Kop Surat */}
          <div className="flex items-center justify-between border-b-2 border-[#17211F] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <IslamicEmblem size={56} />
              <div>
                <h2 className="text-xl font-black text-[#17211F] tracking-tight">
                  KOMUNITAS TABUNGAN MASILEH
                </h2>
                <p className="text-xs font-bold text-[#087F6B]">
                  Sistem Pencatatan Tabungan Digital e-Masileh
                </p>
                <p className="text-[11px] text-[#71807C]">
                  Kantor Pengelola & Majelis Syariah Masileh
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] text-[#71807C] uppercase block font-semibold">
                Status Dokumen
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A36F]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Resmi & Valid
              </span>
            </div>
          </div>

          <div className="text-center py-2">
            <h3 className="text-base font-extrabold text-[#17211F] uppercase tracking-wide">
              Rekening Koran / Rekap Mutasi Tabungan
            </h3>
            <p className="text-xs text-[#71807C]">
              Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>

          {/* Member Information Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] my-4 text-xs">
            <div>
              <span className="text-[#71807C] block">Nama Anggota:</span>
              <span className="font-extrabold text-[#17211F] text-sm">{member.name}</span>
              <span className="text-[#71807C] block mt-1">Nomor Anggota:</span>
              <span className="font-mono font-bold text-[#17211F]">{member.memberId}</span>
            </div>
            <div>
              <span className="text-[#71807C] block">Status Keanggotaan:</span>
              <span className="font-bold text-[#087F6B]">{member.status} • {member.role}</span>
              <span className="text-[#71807C] block mt-1">Saldo Akhir:</span>
              <span className="font-extrabold text-[#087F6B] text-sm tabular-nums">
                {formatRupiah(totalSavings)}
              </span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-2 text-center my-4">
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E6ECEA]">
              <span className="text-[10px] text-[#71807C] font-semibold block uppercase">
                Total Setoran (+)
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#087F6B] tabular-nums">
                {formatRupiah(totalDeposit)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E6ECEA]">
              <span className="text-[10px] text-[#71807C] font-semibold block uppercase">
                Total Penarikan (-)
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#E56B6F] tabular-nums">
                {formatRupiah(totalWithdraw)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E6ECEA]">
              <span className="text-[10px] text-[#71807C] font-semibold block uppercase">
                Total Mutasi
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#17211F]">
                {transactions.length} Transaksi
              </span>
            </div>
          </div>

          {/* Table of Transactions */}
          <div className="overflow-x-auto my-4 border border-[#E6ECEA] rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F8] border-b border-[#E6ECEA] text-[#71807C] font-bold">
                <tr>
                  <th className="p-2.5">No / Tgl</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECEA]">
                {transactions.map((trx, index) => (
                  <tr key={trx.id} className="hover:bg-[#F7F9F8]/50">
                    <td className="p-2.5 align-top">
                      <span className="font-bold text-[#17211F]">{index + 1}.</span>
                      <span className="text-[10px] text-[#71807C] block font-medium">
                        {formatIndoDate(trx.date)}
                      </span>
                    </td>
                    <td className="p-2.5 align-top">
                      <span className="font-semibold text-[#17211F] block">{trx.title}</span>
                      <span className="text-[10px] text-[#71807C] font-mono">
                        Ref: {trx.referenceNumber} • {trx.channel}
                      </span>
                    </td>
                    <td className="p-2.5 align-top text-[#71807C]">
                      <span className="px-2 py-0.5 rounded bg-[#F7F9F8] border border-[#E6ECEA] text-[10px] font-medium">
                        {trx.category}
                      </span>
                    </td>
                    <td
                      className={`p-2.5 align-top text-right font-bold tabular-nums ${
                        trx.type === 'setor' ? 'text-[#087F6B]' : 'text-[#E56B6F]'
                      }`}
                    >
                      {trx.type === 'setor' ? '+' : '-'} {formatRupiah(trx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-[#E6ECEA] text-center text-xs">
            <div>
              <p className="text-[#71807C]">Anggota Pemilik Tabungan</p>
              <div className="h-16"></div>
              <p className="font-bold text-[#17211F] underline">{member.name}</p>
              <p className="text-[10px] text-[#71807C]">{member.memberId}</p>
            </div>

            <div>
              <p className="text-[#71807C]">Pengurus Kas & Bendahara Masileh</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#087F6B] border border-[#087F6B] px-2 py-1 rounded rotate-[-4deg]">
                  STEMPEL DIGITAL MASILEH
                </span>
              </div>
              <p className="font-bold text-[#17211F] underline">H. M. Syukron, S.E.</p>
              <p className="text-[10px] text-[#71807C]">Bendahara Umum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
