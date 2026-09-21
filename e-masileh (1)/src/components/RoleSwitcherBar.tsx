import React from 'react';
import { UserSession } from '../services/api';
import { ShieldCheck, ShieldAlert, KeyRound, ArrowRightLeft } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentUser: UserSession | null;
  onSwitchToAdmin: () => void;
  onSwitchToNonAdmin: () => void;
  onOpenRbacInspector: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentUser,
  onSwitchToAdmin,
  onSwitchToNonAdmin,
  onOpenRbacInspector,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="rounded-2xl bg-[#FFFFFF] border border-[#E6ECEA] p-3 sm:p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isAdmin ? 'bg-[#087F6B] text-white' : 'bg-[#FAF7F5] border border-[#E6ECEA] text-[#71807C]'
          }`}
        >
          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 text-[#E8A23A]" />}
        </div>

        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#71807C]">Masuk sebagai:</span>
            <strong className="text-[#17211F] font-bold">
              {currentUser?.name}
            </strong>
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                isAdmin
                  ? 'bg-[#087F6B]/10 text-[#087F6B]'
                  : 'bg-[#E8A23A]/15 text-[#B07218]'
              }`}
            >
              @{currentUser?.username} ({currentUser?.role})
            </span>
          </div>
          <p className="text-[11px] text-[#71807C] mt-0.5">
            {isAdmin
              ? 'Hak Akses Admin: Tambah/Edit Mutasi, Kelola Anggota, Laporan, Banner & Pengaturan.'
              : 'Hak Akses Non-Admin: Dashboard & Mutasi Read-Only. Tambah/Edit Transaksi diblokir oleh Backend.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          onClick={isAdmin ? onSwitchToNonAdmin : onSwitchToAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6ECEA] bg-[#F7F9F8] hover:bg-[#FFFFFF] hover:border-[#087F6B] text-[#17211F] font-semibold text-xs transition-all cursor-pointer shadow-2xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#087F6B]" />
          <span>
            {isAdmin ? 'Ganti ke majelismasileh' : 'Ganti ke Admin'}
          </span>
        </button>

        <button
          onClick={onOpenRbacInspector}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#17211F] text-white font-semibold text-xs hover:bg-[#045C4E] transition-all cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-[#19B89A]" />
          <span>Cek RBAC</span>
        </button>
      </div>
    </div>
  );
};
