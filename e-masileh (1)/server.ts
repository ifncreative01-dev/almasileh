import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// Type definitions for Server
export type UserRole = 'admin' | 'non-admin';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  memberId: string;
  phoneNumber: string;
  joinDate: string;
  targetAmount: number;
}

// Extend Express Request to hold authenticated user
interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// In-Memory Database Seeded with exact screenshot data
const USERS: Record<string, { passwordHash: string; user: AuthUser }> = {
  admin: {
    // simple secure token/password for demo: "admin123"
    passwordHash: 'admin123',
    user: {
      id: 'usr-admin',
      username: 'admin',
      name: 'H. M. Syukron (Bendahara Kas)',
      role: 'admin',
      memberId: 'MSL-ADM-001',
      phoneNumber: '+62 811-9988-7766',
      joinDate: '01 Januari 2020',
      targetAmount: 10_000_000_000,
    },
  },
  majelismasileh: {
    // user requested specifically: "majelismasileh"
    passwordHash: 'masileh123',
    user: {
      id: 'usr-majelis',
      username: 'majelismasileh',
      name: 'Anggota Masileh',
      role: 'non-admin',
      memberId: 'MSL-2026-0842',
      phoneNumber: '+62 812-3456-7890',
      joinDate: '15 Januari 2024',
      targetAmount: 10_000_000_000,
    },
  },
};

// Seeded Members list for Admin view vs Non-Admin view
let MEMBERS: AuthUser[] = [
  USERS.admin.user,
  USERS.majelismasileh.user,
  {
    id: 'usr-003',
    username: 'ahmad_zaki',
    name: 'Ahmad Zaki Al-Faruq',
    role: 'non-admin',
    memberId: 'MSL-2026-0843',
    phoneNumber: '+62 813-8822-1100',
    joinDate: '20 Februari 2024',
    targetAmount: 5_000_000_000,
  },
  {
    id: 'usr-004',
    username: 'fatimah_zahra',
    name: 'Hj. Siti Fatimah',
    role: 'non-admin',
    memberId: 'MSL-2026-0844',
    phoneNumber: '+62 815-7744-2211',
    joinDate: '05 Maret 2024',
    targetAmount: 7_500_000_000,
  },
];

// Seeded exact screenshot transactions:
// Total Tabungan = Rp 8.000.200.000 (3 transactions)
let TRANSACTIONS = [
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
    createdBy: 'admin',
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
    createdBy: 'admin',
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
    createdBy: 'admin',
  },
];

// Community Event Banner
let COMMUNITY_EVENT = {
  id: 'evt-ifn-prod',
  tag: 'EVENT',
  title: 'IFN PRODUCTION',
  organizer: 'Creative Visual with Soul',
  date: 'September - Oktober 2026',
  description: 'Program Dokumentasi & Sinergi Kreatif Komunitas Masileh. Menyongsong digitalisasi pencatatan tabungan yang transparan dan amanah.',
  location: 'Gedung Koperasi & Majelis Masileh',
  updatedBy: 'admin',
  updatedAt: '2026-09-01 10:00:00',
};

// Community Notifications
let NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Setoran Berhasil Diverifikasi',
    message: 'Setoran Rp 5.000.000.000 pada 3 Sep 2026 telah diverifikasi oleh Bendahara Masileh.',
    date: '3 Sep 2026, 14:22',
    read: false,
    type: 'transaction',
    targetRole: 'all',
  },
  {
    id: 'notif-2',
    title: 'Agenda IFN Production',
    message: 'Jangan lewatkan sesi sosialisasi visual tabungan bersama IFN Production.',
    date: '2 Sep 2026, 09:00',
    read: false,
    type: 'event',
    targetRole: 'all',
  },
  {
    id: 'notif-3',
    title: 'Rekap Periode September 2026',
    message: 'Laporan saldo periode berjalan telah dimutakhirkan secara otomatis.',
    date: '1 Sep 2026, 08:35',
    read: true,
    type: 'info',
    targetRole: 'all',
  },
];

// App Settings (Admin only)
let APP_SETTINGS = {
  communityName: 'Paguyuban Kas & Tabungan Masileh',
  shariaCertified: true,
  targetOverallGoal: 10000000000,
  allowMemberRegistration: true,
  maintenanceMode: false,
};

// Active Session Tokens Store: token -> AuthUser
const ACTIVE_TOKENS = new Map<string, AuthUser>();

// Pre-create standard tokens for convenience
const ADMIN_TOKEN = 'tok_admin_masileh_secret_key_8842';
const NON_ADMIN_TOKEN = 'tok_majelismasileh_standard_key_1109';
ACTIVE_TOKENS.set(ADMIN_TOKEN, USERS.admin.user);
ACTIVE_TOKENS.set(NON_ADMIN_TOKEN, USERS.majelismasileh.user);

// ----------------------------------------------------
// BACKEND RBAC MIDDLEWARES
// ----------------------------------------------------

/**
 * Middleware: Verifies Bearer Token in Authorization header
 */
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token otentikasi tidak ditemukan. Harap login terlebih dahulu.',
    });
  }

  const token = authHeader.split(' ')[1];
  const user = ACTIVE_TOKENS.get(token);

  if (!user) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.',
    });
  }

  req.user = user;
  next();
}

/**
 * Strict Middleware: Role-Based Access Control enforcing Admin privileges
 * Reject non-admin (e.g. majelismasileh) with HTTP 403 Forbidden
 */
function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Diperlukan autentikasi.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      code: 'RBAC_ACCESS_DENIED',
      message: `Akses ditolak: Akun '${req.user.username}' dengan hak akses non-admin tidak diizinkan mengakses atau memanipulasi data ini. Otoritas hanya dimiliki oleh Pengurus/Bendahara (Admin).`,
      requiredRole: 'admin',
      currentRole: req.user.role,
      user: req.user.username,
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

// ----------------------------------------------------
// SERVER INITIALIZATION
// ----------------------------------------------------
async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // ----------------------------------------------------
  // API ROUTES WITH STRICT RBAC
  // ----------------------------------------------------

  // 1. Auth Login: Admin or majelismasileh
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const account = USERS[username.toLowerCase().trim()];
    if (!account || account.passwordHash !== password) {
      return res.status(401).json({
        error: 'AUTH_FAILED',
        message: 'Kredensial salah. Gunakan admin / admin123 atau majelismasileh / masileh123.',
      });
    }

    // Generate session token
    const token =
      username === 'admin'
        ? ADMIN_TOKEN
        : username === 'majelismasileh'
        ? NON_ADMIN_TOKEN
        : 'tok_' + crypto.randomBytes(16).toString('hex');

    ACTIVE_TOKENS.set(token, account.user);

    res.json({
      success: true,
      token,
      user: account.user,
      message: `Selamat datang, ${account.user.name} (${account.user.role})!`,
    });
  });

  // 2. Auth Current User Info: Both Admin & Non-Admin
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // 3. Auth Logout
  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      ACTIVE_TOKENS.delete(token);
    }
    res.json({ success: true, message: 'Berhasil keluar dari akun.' });
  });

  // 4. Dashboard Summary: Admin ✅ | Non-Admin ✅
  app.get('/api/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const totalBalance = TRANSACTIONS.reduce((acc, curr) => {
      return curr.type === 'setor' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const totalDeposit = TRANSACTIONS
      .filter((t) => t.type === 'setor')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraw = TRANSACTIONS
      .filter((t) => t.type === 'tarik')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalBalance,
      totalDeposit,
      totalWithdraw,
      transactionCount: TRANSACTIONS.length,
      currentMonth: 'September 2026',
      userRole: req.user?.role,
    });
  });

  // 5. Lihat Transaksi: Admin ✅ | Non-Admin ✅
  app.get('/api/transactions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      transactions: TRANSACTIONS,
      userRole: req.user?.role,
    });
  });

  // 6. Tambah Setoran & Tambah Penarikan: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.post('/api/transactions', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { type, amount, category, title, date, time, channel, notes } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'Parameter transaksi tidak lengkap.' });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const prefix = type === 'setor' ? 'MSL-DEP' : 'MSL-WDR';
    const referenceNumber = `${prefix}-${randomSuffix}`;
    const id = `TRX-${Date.now()}`;

    const newTransaction = {
      id,
      type,
      amount: Number(amount),
      category,
      title: title || (type === 'setor' ? `Setor ${category}` : `Penarikan Dana ${category}`),
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00',
      status: 'verified',
      referenceNumber,
      channel: channel || 'Transfer Bank',
      notes: notes || '',
      createdBy: req.user?.username || 'admin',
    };

    TRANSACTIONS.unshift(newTransaction);

    // Broadcast a notification
    NOTIFICATIONS.unshift({
      id: `notif-${Date.now()}`,
      title: type === 'setor' ? 'Setoran Baru Diverifikasi' : 'Penarikan Dana Dibukukan',
      message: `${newTransaction.title} sebesar Rp ${newTransaction.amount.toLocaleString('id-ID')} dicatat oleh Bendahara.`,
      date: 'Baru saja',
      read: false,
      type: 'transaction',
      targetRole: 'all',
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibukukan oleh Pengurus/Admin.',
      transaction: newTransaction,
    });
  });

  // 7. Edit Transaksi: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.put('/api/transactions/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const index = TRANSACTIONS.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    const updated = {
      ...TRANSACTIONS[index],
      ...req.body,
      id, // protect ID
      editedBy: req.user?.username,
      editedAt: new Date().toISOString(),
    };

    TRANSACTIONS[index] = updated;

    res.json({
      success: true,
      message: `Transaksi ${id} berhasil diperbarui oleh Admin.`,
      transaction: updated,
    });
  });

  // 8. Hapus Transaksi: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.delete('/api/transactions/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const index = TRANSACTIONS.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    const removed = TRANSACTIONS.splice(index, 1)[0];
    res.json({
      success: true,
      message: `Transaksi ${removed.referenceNumber} berhasil dihapus oleh Admin.`,
    });
  });

  // 9. Data Anggota: Admin ✅ (Semua Anggota) | Non-Admin Terbatas (Hanya Data Diri Sendiri)
  app.get('/api/members', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role === 'admin') {
      // Admin gets full member directory
      return res.json({
        accessLevel: 'full_admin',
        members: MEMBERS,
        totalMembers: MEMBERS.length,
      });
    }

    // Non-Admin (majelismasileh) gets ONLY their own profile data (Terbatas)
    const selfOnly = MEMBERS.filter((m) => m.username === req.user?.username);
    return res.json({
      accessLevel: 'limited_self_only',
      message: 'Hak akses terbatas: Non-Admin hanya dapat melihat data profil anggota sendiri.',
      members: selfOnly,
      totalMembers: 1,
    });
  });

  // 10. Tambah Anggota: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.post('/api/members', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { name, username, phoneNumber, targetAmount } = req.body;

    if (!name || !username) {
      return res.status(400).json({ error: 'Nama dan username anggota wajib diisi.' });
    }

    const newMemberId = `MSL-2026-08${40 + MEMBERS.length + 1}`;
    const newMember: AuthUser = {
      id: `usr-${Date.now()}`,
      username: username.toLowerCase().trim(),
      name,
      role: 'non-admin',
      memberId: newMemberId,
      phoneNumber: phoneNumber || '+62 812-0000-0000',
      joinDate: new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }),
      targetAmount: Number(targetAmount) || 10000000000,
    };

    MEMBERS.push(newMember);

    res.status(201).json({
      success: true,
      message: `Anggota baru ${name} (${newMemberId}) berhasil didaftarkan oleh Admin.`,
      member: newMember,
    });
  });

  // 11. Banner / Event: Admin ✅ Kelola | Non-Admin 👁️ Lihat (Read-Only)
  app.get('/api/events', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      event: COMMUNITY_EVENT,
      canManage: req.user?.role === 'admin',
    });
  });

  app.put('/api/events', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { title, tag, organizer, description, date, location } = req.body;
    COMMUNITY_EVENT = {
      ...COMMUNITY_EVENT,
      title: title || COMMUNITY_EVENT.title,
      tag: tag || COMMUNITY_EVENT.tag,
      organizer: organizer || COMMUNITY_EVENT.organizer,
      description: description || COMMUNITY_EVENT.description,
      date: date || COMMUNITY_EVENT.date,
      location: location || COMMUNITY_EVENT.location,
      updatedBy: req.user?.username || 'admin',
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Banner / Event berhasil diperbarui oleh Admin.',
      event: COMMUNITY_EVENT,
    });
  });

  // 12. Notifikasi: Admin ✅ Kelola | Non-Admin 👁️ Lihat
  app.get('/api/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      notifications: NOTIFICATIONS,
      canManage: req.user?.role === 'admin',
    });
  });

  app.post('/api/notifications', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Judul dan pesan notifikasi wajib diisi.' });
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: 'Baru saja',
      read: false,
      type: type || 'info',
      targetRole: 'all',
      createdBy: req.user?.username,
    };

    NOTIFICATIONS.unshift(newNotif);

    res.status(201).json({
      success: true,
      message: 'Pemberitahuan komunitas berhasil dikirimkan oleh Admin.',
      notification: newNotif,
    });
  });

  // 13. Laporan Keuangan Resmi: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.get('/api/reports', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const totalDeposit = TRANSACTIONS
      .filter((t) => t.type === 'setor')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraw = TRANSACTIONS
      .filter((t) => t.type === 'tarik')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      reportId: `REP-MSL-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.name,
      summary: {
        totalDeposit,
        totalWithdraw,
        netBalance: totalDeposit - totalWithdraw,
        transactionCount: TRANSACTIONS.length,
        memberCount: MEMBERS.length,
      },
      auditTrail: {
        status: 'Audited & Reconciled',
        auditor: 'Majelis Pengawas Keuangan Masileh',
      },
    });
  });

  // 14. Pengaturan Sistem & Edit Konten: Admin ✅ | Non-Admin ❌ (RBAC Enforced)
  app.get('/api/settings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    res.json({ settings: APP_SETTINGS });
  });

  app.put('/api/settings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    APP_SETTINGS = {
      ...APP_SETTINGS,
      ...req.body,
    };
    res.json({
      success: true,
      message: 'Pengaturan aplikasi berhasil disimpan oleh Admin.',
      settings: APP_SETTINGS,
    });
  });

  // 15. Reset Data endpoint (for testability)
  app.post('/api/test/reset', (req: Request, res: Response) => {
    TRANSACTIONS = [
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
        createdBy: 'admin',
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
        createdBy: 'admin',
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
        createdBy: 'admin',
      },
    ];
    res.json({ success: true, message: 'Data direset ke snapshot screenshot (Rp 8.000.200.000).' });
  });

  // ----------------------------------------------------
  // VITE / STATIC MIDDLEWARE
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[e-Masileh Backend] RBAC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
