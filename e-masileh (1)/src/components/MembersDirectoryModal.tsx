import React, { useState, useEffect } from 'react';
import { api, UserSession } from '../services/api';
import { X, Users, UserPlus, ShieldCheck, ShieldAlert, Phone, Calendar } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

interface MembersDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
}

export const MembersDirectoryModal: React.FC<MembersDirectoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [members, setMembers] = useState<UserSession[]>([]);
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [accessMessage, setAccessMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New member form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, currentUser]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.getMembers();
      setMembers(res.members);
      setAccessLevel(res.accessLevel);
      if (res.message) setAccessMessage(res.message);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const res = await api.createMember({
        name: newName,
        username: newUsername,
        phoneNumber: newPhone,
      });
      setFormSuccess(res.message);
      setNewName('');
      setNewUsername('');
      setNewPhone('');
      setShowAddForm(false);
      loadMembers();
    } catch (err: any) {
      // If non-admin tried, backend returns 403!
      setFormError(err.message || 'Gagal menambahkan anggota.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#17211F]">
                Direktori Anggota Masileh
              </h3>
              <p className="text-xs text-[#71807C]">
                {isAdmin ? 'Hak Akses Admin: Seluruh Anggota Terdaftar' : 'Hak Akses Terbatas: Profil Anggota Sendiri'}
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

        {/* Access Status Banner */}
        <div className="mt-3">
          {isAdmin ? (
            <div className="p-3 rounded-2xl bg-[#F2F8F6] border border-[#19B89A]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#087F6B] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#16A36F]" />
                <span>Otoritas Penuh Admin ({members.length} Anggota Terdaftar)</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#087F6B] text-white text-xs font-bold hover:bg-[#045C4E] transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Batal' : '+ Tambah Anggota'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#E6ECEA] flex items-center gap-2 text-xs text-[#B07218]">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#E8A23A]" />
              <span>
                {accessMessage || 'Hak akses terbatas: Akun non-admin hanya dapat melihat data profil diri sendiri sesuai standar privasi komunitas.'}
              </span>
            </div>
          )}
        </div>

        {/* Add Member Form (Admin only) */}
        {showAddForm && isAdmin && (
          <form onSubmit={handleCreateMember} className="mt-3 p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] space-y-3">
            <h4 className="text-xs font-extrabold text-[#17211F]">
              Pendaftaran Anggota Baru
            </h4>

            {formError && (
              <div className="p-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#71807C] mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6ECEA] text-xs font-semibold text-[#17211F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#71807C] mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ahmad_fauzi"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6ECEA] text-xs font-mono text-[#17211F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#71807C] mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6ECEA] text-xs text-[#17211F]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Simpan Anggota Baru
              </button>
            </div>
          </form>
        )}

        {formSuccess && (
          <div className="mt-2 p-2.5 rounded-xl bg-green-50 text-[#087F6B] text-xs font-semibold">
            {formSuccess}
          </div>
        )}

        {/* Members List */}
        <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center text-xs text-[#71807C]">
              Memuat data anggota...
            </div>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl border border-[#E6ECEA] bg-[#FFFFFF] hover:bg-[#F7F9F8] transition-colors flex items-center justify-between flex-wrap gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#087F6B]/10 text-[#087F6B] font-bold flex items-center justify-center text-xs">
                    {m.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs sm:text-sm font-extrabold text-[#17211F]">
                        {m.name}
                      </strong>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          m.role === 'admin'
                            ? 'bg-[#087F6B] text-white'
                            : 'bg-[#F7F9F8] text-[#71807C] border border-[#E6ECEA]'
                        }`}
                      >
                        {m.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#71807C] mt-0.5 font-mono">
                      <span>ID: {m.memberId}</span>
                      <span>@{m.username}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[11px] text-[#71807C] flex items-center gap-1 justify-end">
                    <Phone className="w-3 h-3 text-[#087F6B]" />
                    <span>{m.phoneNumber}</span>
                  </span>
                  <span className="text-[10px] text-[#71807C] block mt-0.5">
                    Target: {formatRupiah(m.targetAmount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
