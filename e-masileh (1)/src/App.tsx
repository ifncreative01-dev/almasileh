/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_MEMBER,
  INITIAL_EVENT,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  formatRupiah,
} from './data/initialData';
import { Transaction, MemberProfile, AppNotification, TransactionType, CommunityEvent } from './types';
import { api, UserSession } from './services/api';
import { Header } from './components/Header';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { MemberGreeting } from './components/MemberGreeting';
import { EventBanner } from './components/EventBanner';
import { TotalSavingsCard } from './components/TotalSavingsCard';
import { MonthlySummary } from './components/MonthlySummary';
import { TransactionList } from './components/TransactionList';
import { ReceiptModal } from './components/ReceiptModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { StatementModal } from './components/StatementModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { TargetModal } from './components/TargetModal';
import { RbacInspectorModal } from './components/RbacInspectorModal';
import { AuthModal } from './components/AuthModal';
import { MembersDirectoryModal } from './components/MembersDirectoryModal';
import { AdminReportsModal } from './components/AdminReportsModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { AccessDeniedModal } from './components/AccessDeniedModal';
import { ShieldCheck, HeartHandshake, ShieldAlert } from 'lucide-react';

export default function App() {
  // Current Authenticated User (Admin or majelismasileh)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => api.getCurrentUser());

  // Backend Synchronized States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [eventData, setEventData] = useState<CommunityEvent>(INITIAL_EVENT);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  // Selected month for the monthly summary
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('setor');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isRbacInspectorOpen, setIsRbacInspectorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  // Synchronize with Express Backend on mount and role change
  useEffect(() => {
    fetchBackendData();
  }, [currentUser]);

  const fetchBackendData = async () => {
    try {
      // 1. Fetch transactions from backend
      const trxRes = await api.getTransactions();
      if (trxRes.transactions) {
        setTransactions(trxRes.transactions);
      }

      // 2. Fetch event banner from backend
      const evtRes = await api.getEvent();
      if (evtRes.event) {
        setEventData(evtRes.event);
      }

      // 3. Fetch notifications
      const notifRes = await api.getNotifications();
      if (notifRes.notifications) {
        setNotifications(notifRes.notifications);
      }
    } catch (err: any) {
      console.warn('Menggunakan data lokal saat koneksi awal:', err.message);
    }
  };

  // Derive MemberProfile for greeting and statement
  const memberProfile: MemberProfile = useMemo(() => {
    return {
      name: currentUser?.name || 'Anggota Masileh',
      role: currentUser?.role === 'admin' ? 'Pengurus / Bendahara Kas' : 'Anggota Majelis',
      memberId: currentUser?.memberId || 'MSL-2026-0842',
      joinDate: currentUser?.joinDate || '15 Januari 2024',
      phoneNumber: currentUser?.phoneNumber || '+62 812-3456-7890',
      status: 'Aktif',
      targetAmount: currentUser?.targetAmount || 10_000_000_000,
    };
  }, [currentUser]);

  // Computed total balance
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'setor' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }, [transactions]);

  // Available months list derived from transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add('September 2026');
    transactions.forEach((t) => {
      try {
        const parts = t.date.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const monthIndex = parseInt(parts[1], 10) - 1;
          const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          monthsSet.add(`${months[monthIndex]} ${year}`);
        }
      } catch (e) {
        // ignore
      }
    });
    return Array.from(monthsSet);
  }, [transactions]);

  // Month calculations
  const monthStats = useMemo(() => {
    const filtered = transactions.filter((t) => {
      try {
        const parts = t.date.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const monthIndex = parseInt(parts[1], 10) - 1;
          const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          const monthStr = `${months[monthIndex]} ${year}`;
          return monthStr === selectedMonth;
        }
      } catch (e) {
        // fallback
      }
      return true;
    });

    const totalDeposit = filtered
      .filter((t) => t.type === 'setor')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraw = filtered
      .filter((t) => t.type === 'tarik')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalDeposit, totalWithdraw };
  }, [transactions, selectedMonth]);

  // Role switching handlers
  const handleSwitchToAdmin = async () => {
    try {
      const res = await api.login('admin', 'admin123');
      setCurrentUser(res.user);
      setShowToast('Berhasil beralih ke akun Admin (H. M. Syukron)');
      setTimeout(() => setShowToast(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSwitchToNonAdmin = async () => {
    try {
      const res = await api.login('majelismasileh', 'masileh123');
      setCurrentUser(res.user);
      setShowToast('Berhasil beralih ke akun Non-Admin (majelismasileh)');
      setTimeout(() => setShowToast(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    // Default back to majelismasileh
    handleSwitchToNonAdmin();
  };

  // Transaction Operations
  const handleOpenDeposit = () => {
    setAddModalType('setor');
    setIsAddModalOpen(true);
  };

  const handleOpenWithdraw = () => {
    setAddModalType('tarik');
    setIsAddModalOpen(true);
  };

  const handleAddTransactionSubmit = async (
    newTrxData: Omit<Transaction, 'id' | 'referenceNumber'>
  ) => {
    // Send to backend! Backend checks RBAC role!
    const res = await api.createTransaction(newTrxData);
    setTransactions((prev) => [res.transaction, ...prev]);

    setShowToast(res.message);
    setTimeout(() => setShowToast(null), 3000);

    // Refresh notifications
    const notifRes = await api.getNotifications();
    setNotifications(notifRes.notifications);
  };

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const res = await api.updateTransaction(id, updates);
      setTransactions((prev) => prev.map((t) => (t.id === id ? res.transaction : t)));
      if (selectedTransaction?.id === id) {
        setSelectedTransaction(res.transaction);
      }
      setShowToast(res.message);
      setTimeout(() => setShowToast(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setShowToast(res.message);
      setTimeout(() => setShowToast(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateEvent = async (updated: CommunityEvent) => {
    try {
      const res = await api.updateEvent(updated);
      setEventData(res.event);
      setShowToast(res.message);
      setTimeout(() => setShowToast(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBroadcastNotification = async (title: string, message: string) => {
    const res = await api.createNotification({ title, message });
    setNotifications((prev) => [res.notification, ...prev]);
    setShowToast('Pengumuman berhasil disiarkan!');
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset data kas ke kondisi awal snapshot screenshot (Rp 8.000.200.000)?')) {
      try {
        await api.resetDatabase();
        await fetchBackendData();
        setSelectedMonth('September 2026');
        setShowToast('Data telah direset ke snapshot screenshot (Rp 8.000.200.000).');
        setTimeout(() => setShowToast(null), 3000);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#17211F] flex flex-col font-sans">
      {/* Sticky Top Header with RBAC status & actions */}
      <Header
        currentUser={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenMembersDirectory={() => setIsMembersModalOpen(true)}
        onOpenReports={() => setIsReportsModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenRbacInspector={() => setIsRbacInspectorOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area - Mobile First Centered Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3.5 sm:space-y-4.5">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-[#17211F] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <ShieldCheck className="w-4 h-4 text-[#16A36F]" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Role Switcher & RBAC Status Bar */}
        <RoleSwitcherBar
          currentUser={currentUser}
          onSwitchToAdmin={handleSwitchToAdmin}
          onSwitchToNonAdmin={handleSwitchToNonAdmin}
          onOpenRbacInspector={() => setIsRbacInspectorOpen(true)}
        />

        {/* 1. Member Greeting Section */}
        <MemberGreeting
          member={memberProfile}
          onEditProfile={() => setIsProfileOpen(true)}
        />

        {/* 2. Event Banner Card matching screenshot (IFN PRODUCTION) */}
        <EventBanner
          event={eventData}
          isAdmin={isAdmin}
          onUpdateEvent={handleUpdateEvent}
        />

        {/* 3. Total Savings Card matching screenshot (Rp 8.000.200.000) */}
        <TotalSavingsCard
          totalAmount={totalBalance}
          transactionCount={transactions.length}
          targetAmount={memberProfile.targetAmount}
          isAdmin={isAdmin}
          onOpenDeposit={handleOpenDeposit}
          onOpenWithdraw={handleOpenWithdraw}
          onOpenStatement={() => setIsStatementOpen(true)}
          onOpenTargetModal={() => setIsTargetOpen(true)}
          onUnauthorizedAction={(action) => setDeniedFeature(action)}
        />

        {/* 4. Monthly Summary Section matching screenshot (Rekap September 2026) */}
        <MonthlySummary
          currentMonth={selectedMonth}
          totalDeposit={monthStats.totalDeposit}
          totalWithdraw={monthStats.totalWithdraw}
          availableMonths={availableMonths}
          onSelectMonth={setSelectedMonth}
        />

        {/* 5. Mutasi Tabungan (Transaction Feed matching screenshot) */}
        <TransactionList
          transactions={transactions}
          isAdmin={isAdmin}
          onSelectTransaction={setSelectedTransaction}
          onOpenAddModal={() => {
            setAddModalType('setor');
            setIsAddModalOpen(true);
          }}
          onUnauthorizedAction={(action) => setDeniedFeature(action)}
        />

        {/* Community Trust & Sharia Guarantee Footer Card */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6ECEA] flex items-center justify-between text-xs text-[#71807C]">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#087F6B]" />
            <span>Sistem Amanah Digital Kas Paguyuban Masileh</span>
          </div>
          <button
            onClick={() => setIsRbacInspectorOpen(true)}
            className="font-bold text-[#087F6B] hover:underline cursor-pointer"
          >
            RBAC Aktif
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E6ECEA] bg-[#FFFFFF] text-center text-xs text-[#71807C]">
        <div className="max-w-md mx-auto px-4 space-y-1">
          <p className="font-semibold text-[#17211F]">
            e-Masileh • Rekap Tabungan Digital Masileh
          </p>
          <p className="text-[11px]">
            Dioptimalkan untuk kenyamanan anggota di ponsel dan perangkat cerdas.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#087F6B] font-medium flex-wrap">
            <button
              onClick={() => setIsStatementOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Cetak Rekap
            </button>
            <span>•</span>
            <button
              onClick={() => setIsMembersModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Data Anggota
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRbacInspectorOpen(true)}
              className="hover:underline cursor-pointer font-bold"
            >
              Uji RBAC Backend
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="hover:underline cursor-pointer text-[#71807C]"
            >
              Reset Data Screenshot
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ReceiptModal
        transaction={selectedTransaction}
        isAdmin={isAdmin}
        onClose={() => setSelectedTransaction(null)}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        initialType={addModalType}
        isAdmin={isAdmin}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransactionSubmit}
      />

      <StatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        transactions={transactions}
        member={memberProfile}
        totalSavings={totalBalance}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        member={memberProfile}
        onClose={() => setIsProfileOpen(false)}
        onUpdateMember={(updated) => {
          if (currentUser) {
            const next: UserSession = {
              ...currentUser,
              name: updated.name,
              phoneNumber: updated.phoneNumber,
              targetAmount: updated.targetAmount,
            };
            setCurrentUser(next);
            api.setSession(api.getToken() || '', next);
          }
        }}
        onResetMember={() => {
          if (currentUser) {
            const reset: UserSession = {
              ...currentUser,
              targetAmount: 10000000000,
            };
            setCurrentUser(reset);
            api.setSession(api.getToken() || '', reset);
          }
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        isAdmin={isAdmin}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onBroadcastNotification={handleBroadcastNotification}
      />

      <TargetModal
        isOpen={isTargetOpen}
        currentAmount={totalBalance}
        targetAmount={memberProfile.targetAmount}
        onClose={() => setIsTargetOpen(false)}
        onUpdateTarget={(newTarget) => {
          if (currentUser) {
            const next = { ...currentUser, targetAmount: newTarget };
            setCurrentUser(next);
            api.setSession(api.getToken() || '', next);
          }
        }}
      />

      {/* RBAC Security Inspector Modal */}
      <RbacInspectorModal
        isOpen={isRbacInspectorOpen}
        onClose={() => setIsRbacInspectorOpen(false)}
        currentUser={currentUser}
      />

      {/* Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setShowToast(`Berhasil login sebagai ${user.name}`);
          setTimeout(() => setShowToast(null), 3000);
        }}
      />

      {/* Members Directory Modal */}
      <MembersDirectoryModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Admin Reports Modal */}
      <AdminReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Unauthorized Access Denied Modal */}
      <AccessDeniedModal
        isOpen={!!deniedFeature}
        featureName={deniedFeature || ''}
        currentUser={currentUser}
        onClose={() => setDeniedFeature(null)}
        onSwitchToAdmin={handleSwitchToAdmin}
        onOpenRbacInspector={() => setIsRbacInspectorOpen(true)}
      />
    </div>
  );
}
