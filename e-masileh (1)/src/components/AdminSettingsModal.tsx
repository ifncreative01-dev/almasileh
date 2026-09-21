import React, { useState, useEffect } from 'react';
import { api, UserSession } from '../services/api';
import { X, Settings, ShieldCheck, ShieldAlert, Check } from 'lucide-react';
import { formatRupiah, parseRupiahInput } from '../data/initialData';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [settings, setSettings] = useState<any>({
    communityName: 'Paguyuban Kas & Tabungan Masileh',
    shariaCertified: true,
    targetOverallGoal: 10000000000,
    allowMemberRegistration: true,
  });
  const [loading, setLoading] = useState(false);
  const [targetStr, setTargetStr] = useState('10.000.000.000');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, currentUser]);

  const loadSettings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getSettings();
      setSettings(res.settings);
      setTargetStr(res.settings.targetOverallGoal.toLocaleString('id-ID'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const updatedGoal = parseRupiahInput(targetStr) || 10000000000;
      const res = await api.updateSettings({
        ...settings,
        targetOverallGoal: updatedGoal,
      });
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#17211F]">
              Pengaturan Sistem & Konten
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg ? (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>403 FORBIDDEN</span>
            </div>
            <p>{errorMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-3.5">
            {successMsg && (
              <div className="p-2.5 rounded-xl bg-green-50 text-[#087F6B] text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#71807C] mb-1">
                Nama Komunitas / Lembaga
              </label>
              <input
                type="text"
                value={settings.communityName}
                onChange={(e) => setSettings({ ...settings, communityName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-semibold text-[#17211F] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#71807C] mb-1">
                Target Capaian Kas Komunitas (Rupiah)
              </label>
              <input
                type="text"
                value={targetStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setTargetStr(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-bold text-[#17211F] tabular-nums focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
