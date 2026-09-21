import { Transaction, MemberProfile, CommunityEvent, AppNotification } from '../types';

export interface UserSession {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'non-admin';
  memberId: string;
  phoneNumber: string;
  joinDate: string;
  targetAmount: number;
}

export interface ApiError {
  error: string;
  code?: string;
  message: string;
  requiredRole?: string;
  currentRole?: string;
  timestamp?: string;
}

const TOKEN_KEY = 'emasileh_auth_token';
const USER_KEY = 'emasileh_auth_user';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || 'tok_majelismasileh_standard_key_1109';
  },

  setSession(token: string, user: UserSession) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getCurrentUser(): UserSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
    // Default account: majelismasileh (Non-Admin) as requested in prompt!
    return {
      id: 'usr-majelis',
      username: 'majelismasileh',
      name: 'Anggota Masileh',
      role: 'non-admin',
      memberId: 'MSL-2026-0842',
      phoneNumber: '+62 812-3456-7890',
      joinDate: '15 Januari 2024',
      targetAmount: 10_000_000_000,
    };
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      const error: ApiError = {
        error: data.error || 'ERROR',
        code: data.code,
        message: data.message || 'Terjadi kesalahan pada server.',
        requiredRole: data.requiredRole,
        currentRole: data.currentRole,
        timestamp: data.timestamp,
      };
      throw error;
    }

    return data as T;
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: UserSession }> {
    const res = await this.request<{ success: boolean; token: string; user: UserSession }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setSession(res.token, res.user);
    return { token: res.token, user: res.user };
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    this.clearSession();
  },

  async getMe(): Promise<UserSession> {
    const res = await this.request<{ user: UserSession }>('/api/auth/me');
    return res.user;
  },

  // Dashboard & Transactions
  async getDashboard() {
    return this.request<{
      totalBalance: number;
      totalDeposit: number;
      totalWithdraw: number;
      transactionCount: number;
      currentMonth: string;
      userRole: string;
    }>('/api/dashboard');
  },

  async getTransactions() {
    return this.request<{ transactions: Transaction[]; userRole: string }>('/api/transactions');
  },

  // ADMIN-ONLY Endpoints (Directly protected on server)
  async createTransaction(trx: Omit<Transaction, 'id' | 'referenceNumber'>) {
    return this.request<{ success: boolean; message: string; transaction: Transaction }>(
      '/api/transactions',
      {
        method: 'POST',
        body: JSON.stringify(trx),
      }
    );
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    return this.request<{ success: boolean; message: string; transaction: Transaction }>(
      `/api/transactions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async deleteTransaction(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Members (Admin sees all; Non-Admin sees only self)
  async getMembers() {
    return this.request<{
      accessLevel: string;
      message?: string;
      members: UserSession[];
      totalMembers: number;
    }>('/api/members');
  },

  async createMember(newMember: { name: string; username: string; phoneNumber?: string; targetAmount?: number }) {
    return this.request<{ success: boolean; message: string; member: UserSession }>(
      '/api/members',
      {
        method: 'POST',
        body: JSON.stringify(newMember),
      }
    );
  },

  // Banner / Event
  async getEvent() {
    return this.request<{ event: CommunityEvent; canManage: boolean }>('/api/events');
  },

  async updateEvent(eventData: Partial<CommunityEvent>) {
    return this.request<{ success: boolean; message: string; event: CommunityEvent }>('/api/events', {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: AppNotification[]; canManage: boolean }>('/api/notifications');
  },

  async createNotification(notif: { title: string; message: string; type?: string }) {
    return this.request<{ success: boolean; message: string; notification: AppNotification }>(
      '/api/notifications',
      {
        method: 'POST',
        body: JSON.stringify(notif),
      }
    );
  },

  // Reports (Admin only)
  async getReport() {
    return this.request<{
      reportId: string;
      generatedAt: string;
      generatedBy: string;
      summary: any;
      auditTrail: any;
    }>('/api/reports');
  },

  // Settings (Admin only)
  async getSettings() {
    return this.request<{ settings: any }>('/api/settings');
  },

  async updateSettings(settings: any) {
    return this.request<{ success: boolean; message: string; settings: any }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Reset database back to exact screenshot values
  async resetDatabase() {
    return this.request<{ success: boolean; message: string }>('/api/test/reset', {
      method: 'POST',
    });
  },
};
