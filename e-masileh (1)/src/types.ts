export type TransactionType = 'setor' | 'tarik';

export type SavingsCategory =
  | 'Simpanan Wajib'
  | 'Simpanan Sukarela'
  | 'Simpanan Pokok'
  | 'Tabungan Qurban'
  | 'Tabungan Hari Raya'
  | 'Dana Sosial'
  | 'Kas Operasional';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: SavingsCategory;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'verified' | 'pending';
  referenceNumber: string;
  notes?: string;
  channel: 'Transfer Bank' | 'Tunai / Pengurus' | 'QRIS Masileh' | 'QRIS Komunitas';
}

export interface MemberProfile {
  name: string;
  role: string;
  memberId: string;
  joinDate: string;
  phoneNumber: string;
  status: 'Aktif' | 'Non-Aktif';
  targetAmount: number;
}

export interface CommunityEvent {
  id: string;
  tag: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  location: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event' | 'transaction' | 'info';
}
