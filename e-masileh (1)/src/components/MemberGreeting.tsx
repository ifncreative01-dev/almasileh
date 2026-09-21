import React from 'react';
import { MemberProfile } from '../types';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface MemberGreetingProps {
  member: MemberProfile;
  onEditProfile: () => void;
}

export const MemberGreeting: React.FC<MemberGreetingProps> = ({
  member,
  onEditProfile,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-1">
      <div>
        <p className="text-xs sm:text-sm font-medium text-[#71807C]">
          Selamat datang,
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17211F] tracking-tight">
            {member.name}
          </h2>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#087F6B] bg-[#087F6B]/10 px-2 py-0.5 rounded-full"
            title="Akun Terverifikasi Komunitas Masileh"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#087F6B]" />
            <span>Aktif</span>
          </span>
        </div>
      </div>

      <button
        id="greeting-profile-chip"
        onClick={onEditProfile}
        className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E6ECEA] bg-[#FFFFFF] hover:border-[#087F6B]/40 hover:bg-[#F7F9F8] transition-all text-xs font-semibold text-[#71807C] hover:text-[#17211F] cursor-pointer shadow-xs"
      >
        <div className="w-2 h-2 rounded-full bg-[#16A36F]"></div>
        <span>No. ID: <strong className="text-[#17211F] font-mono">{member.memberId}</strong></span>
        <ChevronRight className="w-3.5 h-3.5 text-[#71807C]" />
      </button>
    </div>
  );
};
