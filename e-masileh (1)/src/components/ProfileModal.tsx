import React, { useState } from 'react';
import { MemberProfile } from '../types';
import { IslamicEmblem } from './IslamicEmblem';
import { X, User, Phone, ShieldCheck, Target, Check, RotateCcw } from 'lucide-react';
import { formatRupiah, parseRupiahInput } from '../data/initialData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberProfile;
  onUpdateMember: (updated: MemberProfile) => void;
  onResetMember: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  onUpdateMember,
  onResetMember,
}) => {
  const [name, setName] = useState(member.name);
  const [memberId, setMemberId] = useState(member.memberId);
  const [phone, setPhone] = useState(member.phoneNumber);
  const [targetStr, setTargetStr] = useState(member.targetAmount.toLocaleString('id-ID'));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseRupiahInput(targetStr) || 1000000000;
    onUpdateMember({
      ...member,
      name: name.trim() || 'Anggota Masileh',
      memberId: memberId.trim() || 'MSL-2026-0842',
      phoneNumber: phone.trim(),
      targetAmount: newTarget,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211F]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <h3 className="text-base font-extrabold text-[#17211F]">
            Profil Anggota Masileh
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Member Card Preview */}
        <div className="mt-4 p-5 rounded-3xl bg-gradient-to-br from-[#087F6B] to-[#045C4E] text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <svg width="150" height="150" viewBox="0 0 100 100" fill="white">
              <rect x="20" y="20" width="60" height="60" rx="6" />
              <rect x="20" y="20" width="60" height="60" rx="6" transform="rotate(45 50 50)" />
            </svg>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <IslamicEmblem size={36} className="bg-white/20" />
              <div>
                <span className="text-[10px] tracking-wider uppercase font-bold text-white/80 block">
                  KARTU ANGGOTA DIGITAL
                </span>
                <span className="text-sm font-extrabold">e-Masileh</span>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {member.status}
            </span>
          </div>

          <div className="mt-6 relative z-10">
            <span className="text-xs text-white/70 block">Nama Anggota:</span>
            <p className="text-lg font-black tracking-tight">{name || member.name}</p>
            <div className="flex items-center justify-between text-xs text-white/80 mt-2 font-mono">
              <span>{memberId || member.memberId}</span>
              <span className="font-sans text-[11px]">Bergabung: {member.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Nama Anggota
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71807C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anggota Masileh"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs sm:text-sm text-[#17211F] font-semibold focus:outline-none focus:border-[#087F6B] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Nomor Anggota (ID)
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="MSL-2026-0842"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs text-[#17211F] font-mono focus:outline-none focus:border-[#087F6B] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Target Tabungan Pribadi / Komunitas (Rupiah)
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-[#71807C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setTargetStr(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                }}
                placeholder="10.000.000.000"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs sm:text-sm text-[#17211F] font-semibold focus:outline-none focus:border-[#087F6B] focus:bg-white tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              No. Kontak / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#71807C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs text-[#17211F] focus:outline-none focus:border-[#087F6B] focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onResetMember();
                setName('Anggota Masileh');
                setMemberId('MSL-2026-0842');
                setTargetStr((10000000000).toLocaleString('id-ID'));
              }}
              className="p-2.5 rounded-xl border border-[#E6ECEA] hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
              title="Reset ke Profil Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
