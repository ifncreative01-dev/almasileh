import React from 'react';
import { X, ShieldAlert, ArrowRightLeft, ShieldCheck, Terminal } from 'lucide-react';
import { UserSession } from '../services/api';

interface AccessDeniedModalProps {
  isOpen: boolean;
  featureName: string;
  currentUser: UserSession | null;
  onClose: () => void;
  onSwitchToAdmin: () => void;
  onOpenRbacInspector: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  featureName,
  currentUser,
  onClose,
  onSwitchToAdmin,
  onOpenRbacInspector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-base font-extrabold text-[#17211F]">
          Hak Akses Terbatas (Non-Admin)
        </h3>

        <div className="mt-2 p-2.5 rounded-xl bg-[#FAF7F5] border border-[#E6ECEA] text-xs text-[#71807C]">
          Fitur <strong className="text-[#17211F]">"{featureName}"</strong> dilindungi oleh sistem keamanan Role-Based Access Control (RBAC).
        </div>

        <p className="text-xs text-[#71807C] mt-3 leading-relaxed">
          Akun aktif saat ini adalah <strong className="text-[#17211F]">@{currentUser?.username}</strong> dengan hak akses <span className="font-bold text-amber-700">non-admin</span>. Anda hanya memiliki izin read-only untuk memantau tabungan dan melihat kuitansi.
        </p>

        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              onClose();
              onSwitchToAdmin();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Masuk sebagai Admin (Bendahara)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenRbacInspector();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#17211F] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4 text-[#19B89A]" />
            <span>Uji Penetrasi Backend RBAC (Inspector)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-semibold text-[#71807C] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
