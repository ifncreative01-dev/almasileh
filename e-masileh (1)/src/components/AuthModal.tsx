import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { api, UserSession } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login(username, password);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login. Kredensial tidak cocok.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: 'admin' | 'majelismasileh') => {
    setLoading(true);
    setErrorMsg('');
    const pass = user === 'admin' ? 'admin123' : 'masileh123';
    setUsername(user);
    setPassword(pass);
    try {
      const res = await api.login(user, pass);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#17211F]">
              Ganti Akun & Hak Akses
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick 1-Click Role Switchers */}
        <div className="mt-4 space-y-2.5">
          <span className="text-[11px] font-bold text-[#71807C] uppercase tracking-wider block">
            Pilih Cepat Akun Uji:
          </span>

          {/* Admin Account Button */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            disabled={loading}
            className="w-full p-3 rounded-2xl border border-[#087F6B]/30 bg-[#F2F8F6] hover:bg-[#087F6B] hover:text-white transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#087F6B] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#087F6B] transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#17211F] group-hover:text-white block">
                  Admin (Bendahara Masileh)
                </strong>
                <span className="text-[11px] text-[#71807C] group-hover:text-white/80 font-mono">
                  user: admin • pass: admin123
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white text-[#087F6B] group-hover:bg-white/20 group-hover:text-white">
              Penuh
            </span>
          </button>

          {/* Non-Admin Account Button */}
          <button
            type="button"
            onClick={() => handleQuickLogin('majelismasileh')}
            disabled={loading}
            className="w-full p-3 rounded-2xl border border-[#E8A23A]/40 bg-[#FAF7F5] hover:bg-[#E8A23A] hover:text-white transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8A23A] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#E8A23A] transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#17211F] group-hover:text-white block">
                  Non-Admin (majelismasileh)
                </strong>
                <span className="text-[11px] text-[#71807C] group-hover:text-white/80 font-mono">
                  user: majelismasileh • pass: masileh123
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white text-[#B07218] group-hover:bg-white/20 group-hover:text-white">
              Terbatas
            </span>
          </button>
        </div>

        <div className="my-4 flex items-center gap-2 text-xs text-[#71807C]">
          <div className="h-[1px] flex-1 bg-[#E6ECEA]"></div>
          <span>atau login manual</span>
          <div className="h-[1px] flex-1 bg-[#E6ECEA]"></div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71807C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin atau majelismasileh"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-semibold text-[#17211F] focus:outline-none focus:border-[#087F6B] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71807C] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71807C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 atau masileh123"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] text-xs font-semibold text-[#17211F] focus:outline-none focus:border-[#087F6B] focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
