import React from 'react';
import { IslamicEmblem } from './IslamicEmblem';
import { Bell, UserCheck, ShieldAlert, LogOut, ShieldCheck, Users, Settings, FileBarChart } from 'lucide-react';
import { AppNotification } from '../types';
import { UserSession } from '../services/api';

interface HeaderProps {
  currentUser: UserSession | null;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenMembersDirectory: () => void;
  onOpenReports: () => void;
  onOpenSettings: () => void;
  onOpenRbacInspector: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  onOpenMembersDirectory,
  onOpenReports,
  onOpenSettings,
  onOpenRbacInspector,
  onOpenAuthModal,
  onLogout,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E6ECEA] px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <IslamicEmblem size={40} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-[#17211F] tracking-tight">
                e-Masileh
              </h1>
              {isAdmin ? (
                <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-[#087F6B] text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ADMIN</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#F7F9F8] border border-[#E6ECEA] text-[#71807C] flex items-center gap-1">
                  <span>ANGGOTA</span>
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#71807C] font-medium truncate">
              Rekap Tabungan Digital Masileh
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* RBAC Security Test Trigger */}
          <button
            onClick={onOpenRbacInspector}
            title="Uji Keamanan Backend RBAC"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#19B89A]/40 bg-[#F2F8F6] text-[#087F6B] text-xs font-bold hover:bg-[#087F6B] hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Uji RBAC</span>
          </button>

          {/* Admin Navigation Extras */}
          {isAdmin && (
            <>
              <button
                onClick={onOpenMembersDirectory}
                title="Data Semua Anggota"
                className="p-2 rounded-xl border border-[#E6ECEA] text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer hidden sm:flex items-center"
              >
                <Users className="w-4 h-4 text-[#087F6B]" />
              </button>

              <button
                onClick={onOpenReports}
                title="Laporan Pembukuan Kas"
                className="p-2 rounded-xl border border-[#E6ECEA] text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer hidden sm:flex items-center"
              >
                <FileBarChart className="w-4 h-4 text-[#087F6B]" />
              </button>

              <button
                onClick={onOpenSettings}
                title="Pengaturan Aplikasi"
                className="p-2 rounded-xl border border-[#E6ECEA] text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer hidden sm:flex items-center"
              >
                <Settings className="w-4 h-4 text-[#71807C]" />
              </button>
            </>
          )}

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            title="Pemberitahuan Komunitas"
            className="relative p-2 rounded-xl border border-[#E6ECEA] text-[#17211F] hover:bg-[#F7F9F8] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#17211F]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E56B6F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Member Profile button */}
          <button
            onClick={onOpenProfile}
            title="Profil Pengguna"
            className="p-2 rounded-xl border border-[#E6ECEA] text-[#087F6B] hover:bg-[#F7F9F8] transition-colors cursor-pointer flex items-center justify-center"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Switch Account / Role Modal */}
          <button
            onClick={onOpenAuthModal}
            title="Ganti Akun (Admin / majelismasileh)"
            className="px-2.5 py-1.5 rounded-xl border border-[#E6ECEA] bg-[#FFFFFF] hover:bg-[#F7F9F8] text-xs font-semibold text-[#17211F] transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="text-[11px] hidden sm:inline text-[#71807C]">Role:</span>
            <span className="text-[11px] font-bold text-[#087F6B] truncate max-w-[80px]">
              {currentUser?.username}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Keluar (Logout)"
            className="p-2 rounded-xl border border-[#E6ECEA] text-[#71807C] hover:text-[#E56B6F] hover:bg-[#FAF7F5] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
