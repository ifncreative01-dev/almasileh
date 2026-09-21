import React, { useState } from 'react';
import { api, UserSession } from '../services/api';
import { X, ShieldCheck, ShieldAlert, Terminal, CheckCircle2, XCircle, Play, Eye } from 'lucide-react';

interface RbacInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
}

export const RbacInspectorModal: React.FC<RbacInspectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [testEndpoint, setTestEndpoint] = useState<string>('POST /api/transactions');
  const [testResult, setTestResult] = useState<{
    status: number;
    ok: boolean;
    data: any;
    endpoint: string;
    timestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  // Matrix table requested by user
  const permissionsMatrix = [
    { feature: 'Dashboard', admin: '✅', nonAdmin: '✅', note: 'Ringkasan saldo & grafik' },
    { feature: 'Lihat tabungan', admin: '✅', nonAdmin: '✅', note: 'Total saldo Rp 8.000.200.000' },
    { feature: 'Lihat transaksi', admin: '✅', nonAdmin: '✅', note: 'Riwayat mutasi kas' },
    { feature: 'Tambah setoran', admin: '✅', nonAdmin: '❌', note: 'Backend block 403 jika non-admin' },
    { feature: 'Tambah penarikan', admin: '✅', nonAdmin: '❌', note: 'Backend block 403 jika non-admin' },
    { feature: 'Edit transaksi', admin: '✅', nonAdmin: '❌', note: 'Backend block 403 jika non-admin' },
    { feature: 'Data anggota', admin: '✅', nonAdmin: 'Terbatas', note: 'Non-admin hanya lihat profil diri' },
    { feature: 'Tambah anggota', admin: '✅', nonAdmin: '❌', note: 'Backend block 403 jika non-admin' },
    { feature: 'Banner/Event', admin: '✅ Kelola', nonAdmin: '👁️ Lihat', note: 'Non-admin hanya read-only' },
    { feature: 'Edit konten aplikasi', admin: '✅', nonAdmin: '❌', note: 'Backend block 403 jika non-admin' },
    { feature: 'Laporan', admin: '✅', nonAdmin: '❌', note: 'Laporan kas pembukuan resmi' },
    { feature: 'Pengaturan', admin: '✅', nonAdmin: '❌', note: 'Konfigurasi target & kas' },
    { feature: 'Notifikasi', admin: '✅ Kelola', nonAdmin: '👁️ Lihat', note: 'Non-admin tidak bisa broadcast' },
    { feature: 'Logout', admin: '✅', nonAdmin: '✅', note: 'Revoke token sesi' },
  ];

  const handleRunSecurityTest = async (testCase: string) => {
    setLoading(true);
    setTestEndpoint(testCase);

    const token = api.getToken();
    let url = '';
    let method = 'GET';
    let body: any = null;

    if (testCase === 'POST /api/transactions') {
      url = '/api/transactions';
      method = 'POST';
      body = JSON.stringify({
        type: 'setor',
        amount: 100000000,
        category: 'Simpanan Sukarela',
        title: 'Uji Penetrasi Non-Admin',
      });
    } else if (testCase === 'POST /api/members') {
      url = '/api/members';
      method = 'POST';
      body = JSON.stringify({
        name: 'Anggota Palsu',
        username: 'fake_member',
      });
    } else if (testCase === 'GET /api/reports') {
      url = '/api/reports';
      method = 'GET';
    } else if (testCase === 'PUT /api/settings') {
      url = '/api/settings';
      method = 'PUT';
      body = JSON.stringify({ maintenanceMode: true });
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body } : {}),
      });

      const data = await res.json();
      setTestResult({
        status: res.status,
        ok: res.ok,
        data,
        endpoint: testCase,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        ok: false,
        data: { error: err.message },
        endpoint: testCase,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#17211F]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-[#E6ECEA] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6ECEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087F6B]/10 flex items-center justify-center text-[#087F6B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#17211F]">
                Audit Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-[#71807C]">
                Verifikasi Hak Akses Backend Express Server
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

        {/* Current Active Account Status */}
        <div className="mt-4 p-4 rounded-2xl bg-[#F7F9F8] border border-[#E6ECEA] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div>
            <span className="text-[#71807C]">Sesi Aktif:</span>{' '}
            <strong className="text-[#17211F]">{currentUser?.name}</strong>{' '}
            <span className="font-mono text-[#087F6B]">(@{currentUser?.username})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#71807C]">Hak Akses:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isAdmin ? 'bg-[#16A36F]/15 text-[#16A36F]' : 'bg-[#E8A23A]/20 text-[#B07218]'
              }`}
            >
              {currentUser?.role}
            </span>
          </div>
        </div>

        {/* Interactive Backend Security Penetration Test */}
        <div className="mt-5 p-4 rounded-2xl bg-[#17211F] text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#19B89A]">
              <Terminal className="w-4 h-4" />
              <span>Simulasi Uji Penetrasi API Backend Langsung</span>
            </div>
            <span className="text-[10px] text-white/60 font-mono">
              Server Port 3000
            </span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            Pilih endpoint admin di bawah ini untuk mengirim request langsung ke backend menggunakan token akun aktif saat ini:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleRunSecurityTest('POST /api/transactions')}
              disabled={loading}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-[#087F6B] text-[11px] font-mono font-semibold transition-colors truncate"
              title="Coba Tambah Transaksi"
            >
              + Transaksi
            </button>

            <button
              onClick={() => handleRunSecurityTest('POST /api/members')}
              disabled={loading}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-[#087F6B] text-[11px] font-mono font-semibold transition-colors truncate"
              title="Coba Tambah Anggota"
            >
              + Anggota
            </button>

            <button
              onClick={() => handleRunSecurityTest('GET /api/reports')}
              disabled={loading}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-[#087F6B] text-[11px] font-mono font-semibold transition-colors truncate"
              title="Coba Ambil Laporan Kas"
            >
              Get Laporan
            </button>

            <button
              onClick={() => handleRunSecurityTest('PUT /api/settings')}
              disabled={loading}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-[#087F6B] text-[11px] font-mono font-semibold transition-colors truncate"
              title="Coba Ubah Pengaturan"
            >
              Put Settings
            </button>
          </div>

          {/* Test Result Terminal Box */}
          {testResult && (
            <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                <span className="text-white/60">
                  {testResult.endpoint} • {testResult.timestamp}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    testResult.status === 200 || testResult.status === 201
                      ? 'bg-green-500/20 text-green-400'
                      : testResult.status === 403
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  HTTP STATUS: {testResult.status}{' '}
                  {testResult.status === 403 ? 'FORBIDDEN (BLOCKED)' : testResult.status === 200 || testResult.status === 201 ? 'ALLOWED' : ''}
                </span>
              </div>

              <pre className="text-[11px] text-white/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>

              {testResult.status === 403 && (
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Backend RBAC Berhasil! Akun non-admin diblokir secara mutlak pada level server.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Matrix Table */}
        <div className="mt-5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17211F] mb-2.5">
            Matriks Struktur Hak Akses (RBAC)
          </h4>
          <div className="border border-[#E6ECEA] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F8] border-b border-[#E6ECEA] text-[#71807C] font-bold">
                <tr>
                  <th className="p-2.5">Fitur</th>
                  <th className="p-2.5 text-center">Admin</th>
                  <th className="p-2.5 text-center">Non-Admin</th>
                  <th className="p-2.5 hidden sm:table-cell">Keterangan Teknis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECEA]">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F9F8]/40">
                    <td className="p-2.5 font-bold text-[#17211F]">{row.feature}</td>
                    <td className="p-2.5 text-center font-bold text-[#087F6B]">{row.admin}</td>
                    <td
                      className={`p-2.5 text-center font-bold ${
                        row.nonAdmin === '❌'
                          ? 'text-[#E56B6F]'
                          : row.nonAdmin === 'Terbatas'
                          ? 'text-[#E8A23A]'
                          : 'text-[#087F6B]'
                      }`}
                    >
                      {row.nonAdmin}
                    </td>
                    <td className="p-2.5 text-[11px] text-[#71807C] hidden sm:table-cell">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#E6ECEA] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#087F6B] hover:bg-[#045C4E] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Tutup Audit
          </button>
        </div>
      </div>
    </div>
  );
};
