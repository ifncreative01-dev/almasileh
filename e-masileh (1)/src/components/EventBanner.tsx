import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, ChevronRight, X, Film, Info, Edit3, Check } from 'lucide-react';
import { CommunityEvent } from '../types';

interface EventBannerProps {
  event: CommunityEvent;
  isAdmin: boolean;
  onUpdateEvent?: (updated: CommunityEvent) => void;
}

export const EventBanner: React.FC<EventBannerProps> = ({
  event,
  isAdmin,
  onUpdateEvent,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [title, setTitle] = useState(event.title);
  const [organizer, setOrganizer] = useState(event.organizer);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateEvent) {
      onUpdateEvent({
        ...event,
        title,
        organizer,
        description,
        date,
      });
    }
    setIsEditing(false);
  };

  return (
    <>
      <div
        id="event-banner-card"
        onClick={() => setShowDetail(true)}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FBFDFD] to-[#F0F7F5] border border-[#E6ECEA] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#19B89A]/50 transition-all cursor-pointer"
      >
        {/* Geometric watermark motif */}
        <div className="absolute -right-4 -bottom-6 opacity-[0.07] pointer-events-none select-none text-[#087F6B]">
          <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
            <rect x="20" y="20" width="60" height="60" rx="6" />
            <rect x="20" y="20" width="60" height="60" rx="6" transform="rotate(45 50 50)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Event Tag */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087F6B]/10 border border-[#087F6B]/20 text-[#087F6B] text-[11px] font-bold tracking-wide">
                <Sparkles className="w-3 h-3 text-[#19B89A]" />
                <span>{event.tag}</span>
              </div>
              {isAdmin ? (
                <span className="text-[10px] text-[#087F6B] font-semibold flex items-center gap-1 bg-white px-2 py-0.2 rounded-full border border-[#E6ECEA]">
                  <Edit3 className="w-3 h-3" />
                  <span>Admin: Kelola Event</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#71807C] font-semibold bg-white px-2 py-0.2 rounded-full border border-[#E6ECEA]">
                  👁️ Mode Lihat
                </span>
              )}
            </div>

            {/* Title & subtitle matching screenshot */}
            <div className="pt-0.5">
              <h3 className="text-base sm:text-lg font-black text-[#17211F] tracking-tight group-hover:text-[#087F6B] transition-colors flex items-center gap-2">
                <span>{event.title}</span>
                <span className="text-[11px] font-normal text-[#71807C] hidden sm:inline">
                  • {event.organizer}
                </span>
              </h3>
              <p className="text-xs text-[#71807C] font-medium line-clamp-1 mt-0.5">
                {event.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="hidden md:inline-flex text-xs font-semibold text-[#087F6B] bg-white border border-[#E6ECEA] px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-[#087F6B] group-hover:text-white transition-all">
              {isAdmin ? 'Kelola Event' : 'Detail Agenda'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E6ECEA] group-hover:bg-[#087F6B] group-hover:text-white group-hover:border-[#087F6B] flex items-center justify-center text-[#71807C] transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Detail / Edit Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211F]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-md w-full p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#087F6B]/10 text-[#087F6B] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#19B89A]" />
                <span>{isAdmin ? 'PENGELOLAAN EVENT MASILEH' : 'AGENDA KOMUNITAS'}</span>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setIsEditing(false);
                }}
                className="p-1.5 rounded-full hover:bg-[#F7F9F8] text-[#71807C] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEditing && isAdmin ? (
              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#71807C] mb-1">Judul Banner / Event</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] font-bold text-[#17211F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#71807C] mb-1">Penyelenggara / Sub-judul</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] font-semibold text-[#17211F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#71807C] mb-1">Deskripsi Agenda</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#71807C] mb-1">Periode Tanggal</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#E6ECEA] text-[#17211F]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl border border-[#E6ECEA] text-[#71807C]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#087F6B] text-white font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-[#17211F]">
                      {event.title}
                    </h4>
                    <p className="text-xs text-[#087F6B] font-semibold">
                      {event.organizer}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#71807C] leading-relaxed pt-1">
                  {event.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#17211F]">
                    <Calendar className="w-4 h-4 text-[#087F6B]" />
                    <span>Periode: <strong>{event.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17211F]">
                    <MapPin className="w-4 h-4 text-[#087F6B]" />
                    <span>Lokasi: <strong>{event.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17211F]">
                    <Info className="w-4 h-4 text-[#087F6B]" />
                    <span>Pengawas: <strong>Majelis & Pengurus Tabungan Masileh</strong></span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="py-2.5 px-4 rounded-xl border border-[#087F6B] text-[#087F6B] hover:bg-[#087F6B]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Konten Event</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowDetail(false)}
                    className={`py-2.5 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                      isAdmin ? 'flex-1' : 'w-full'
                    }`}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
