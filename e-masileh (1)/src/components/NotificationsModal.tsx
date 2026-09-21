import React, { useState } from 'react';
import { AppNotification } from '../types';
import { X, Bell, Check, Sparkles, Send, ShieldCheck, Plus } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onBroadcastNotification?: (title: string, message: string) => Promise<void>;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  isAdmin,
  notifications,
  onClose,
  onMarkAllAsRead,
  onBroadcastNotification,
}) => {
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMessage || !onBroadcastNotification) return;

    setSubmitting(true);
    setFeedback('');
    try {
      await onBroadcastNotification(newTitle, newMessage);
      setFeedback('Pemberitahuan berhasil disiarkan ke seluruh anggota.');
      setNewTitle('');
      setNewMessage('');
      setShowBroadcastForm(false);
    } catch (err: any) {
      setFeedback(err.message || 'Gagal menyiarkan notifikasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#17211F]">
                Pemberitahuan
              </h3>
              <p className="text-[11px] text-[#71807C]">
                {isAdmin ? 'Admin: Kelola & Siarkan Pengumuman' : 'Info & Aktivitas Tabungan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar for Admin */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowBroadcastForm(!showBroadcastForm)}
              className="flex items-center gap-1 text-xs font-bold text-[#087F6B] hover:text-[#045C4E] px-2.5 py-1 rounded-xl bg-[#F2F8F6] border border-[#19B89A]/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showBroadcastForm ? 'Tutup Form' : 'Kirim Siaran'}</span>
            </button>
          )}

          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-[#71807C] hover:text-[#087F6B] flex items-center gap-1 ml-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>

        {feedback && (
          <div className="mt-2 p-2 rounded-xl bg-green-50 text-[#087F6B] text-xs font-semibold">
            {feedback}
          </div>
        )}

        {/* Admin Broadcast Form */}
        {showBroadcastForm && isAdmin && (
          <form onSubmit={handleBroadcast} className="mt-3 p-3.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#087F6B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Buat Pengumuman Baru Komunitas</span>
            </div>
            <input
              type="text"
              required
              placeholder="Judul Pengumuman..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E6ECEA] text-xs font-bold text-[#17211F]"
            />
            <textarea
              required
              rows={2}
              placeholder="Isi pesan pengumuman..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E6ECEA] text-xs text-[#17211F]"
            />
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1.5 rounded-xl bg-[#087F6B] text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Mengirim...' : 'Siarkan Sekarang'}</span>
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="mt-3 divide-y divide-[#E6ECEA]/70 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#71807C]">
              Tidak ada pemberitahuan baru
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`py-3 px-2 rounded-2xl transition-colors ${
                  item.read ? 'opacity-70' : 'bg-[#F2F8F6]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#17211F]">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-medium text-[#71807C] shrink-0">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-[#71807C] mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
