import { Transaction, MemberProfile, CommunityEvent, AppNotification } from '../types';

export const INITIAL_MEMBER: MemberProfile = {
  name: 'Anggota Masileh',
  role: 'Anggota Komunitas',
  memberId: 'MSL-2026-0842',
  joinDate: '15 Januari 2024',
  phoneNumber: '+62 812-3456-7890',
  status: 'Aktif',
  targetAmount: 10_000_000_000, // 10 Miliar target
};

export const INITIAL_EVENT: CommunityEvent = {
  id: 'evt-ifn-prod',
  tag: 'EVENT',
  title: 'IFN PRODUCTION',
  organizer: 'Creative Visual with Soul',
  date: 'September - Oktober 2026',
  description: 'Program Dokumentasi & Sinergi Kreatif Komunitas Masileh. Menyongsong digitalisasi pencatatan tabungan yang transparan dan amanah.',
  location: 'Gedung Koperasi & Majelis Masileh',
};

// Exactly matches the screenshot:
// Total Tabungan: Rp 8.000.200.000
// 3 transaksi tercatat
// - Setor 3 Sep: +Rp 5.000.000.000
// - Setor 2 Sep: +Rp 3.000.000.000
// - Setor 1 Sep: +Rp 200.000
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20260903-001',
    type: 'setor',
    amount: 5000000000,
    category: 'Simpanan Sukarela',
    title: 'Setor Tabungan Sukarela',
    date: '2026-09-03',
    time: '14:20',
    status: 'verified',
    referenceNumber: 'MSL-DEP-98231',
    channel: 'Transfer Bank',
    notes: 'Setoran dana tabungan investasi sukarela periode September 2026.',
  },
  {
    id: 'TRX-20260902-002',
    type: 'setor',
    amount: 3000000000,
    category: 'Simpanan Wajib',
    title: 'Setor Tabungan Wajib Tahunan',
    date: '2026-09-02',
    time: '10:15',
    status: 'verified',
    referenceNumber: 'MSL-DEP-98114',
    channel: 'Transfer Bank',
    notes: 'Penyetoran alokasi kas wajib anggota paguyuban Masileh.',
  },
  {
    id: 'TRX-20260901-003',
    type: 'setor',
    amount: 200000,
    category: 'Simpanan Pokok',
    title: 'Setor Iuran Pokok Anggota',
    date: '2026-09-01',
    time: '08:30',
    status: 'verified',
    referenceNumber: 'MSL-DEP-97990',
    channel: 'Tunai / Pengurus',
    notes: 'Iuran pokok pembukaan buku rekening tabungan digital.',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Setoran Berhasil Diverifikasi',
    message: 'Setoran Rp 5.000.000.000 pada 3 Sep 2026 telah diverifikasi oleh Bendahara Masileh.',
    date: '3 Sep 2026, 14:22',
    read: false,
    type: 'transaction',
  },
  {
    id: 'notif-2',
    title: 'Agenda IFN Production',
    message: 'Jangan lewatkan sesi sosialisasi visual tabungan bersama IFN Production.',
    date: '2 Sep 2026, 09:00',
    read: false,
    type: 'event',
  },
  {
    id: 'notif-3',
    title: 'Rekap Periode September 2026',
    message: 'Laporan saldo periode berjalan telah dimutakhirkan secara otomatis.',
    date: '1 Sep 2026, 08:35',
    read: true,
    type: 'info',
  },
];

// Helper to format currency in standard Indonesian format
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// Helper to parse currency string back to number
export function parseRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

// Helper to format Indonesian friendly date
export function formatIndoDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return `${day} ${months[monthIndex]} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}
