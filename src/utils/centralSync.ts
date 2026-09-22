import { Product, Transaction, CustomerUdhaar, StoreSettings, StaffAccount, AuditLogEntry, CentralDbStatus, StoreProfile } from '../types';

export interface SyncResult {
  success: boolean;
  snapshot?: {
    products: Product[];
    transactions: Transaction[];
    customers: CustomerUdhaar[];
    settings: StoreSettings;
    staff: StaffAccount[];
    auditLogs: AuditLogEntry[];
    cloudSyncMode: string;
    lastUpdated: string;
  };
  lastUpdated?: string;
  changesApplied?: boolean;
  error?: string;
}

const API_BASE = '/api/db';

/**
 * Check connectivity and telemetry status of the central server database
 */
export async function checkCentralStatus(): Promise<{
  connected: boolean;
  status: CentralDbStatus;
  latencyMs: number;
}> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE}/status`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(4000),
    });
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      connected: true,
      latencyMs,
      status: {
        status: 'connected',
        version: data.version || '2.0.0',
        serverId: data.serverId || 'faizan-inamdar',
        serverAdmin: data.serverAdmin || 'Faizan Inamdar',
        masterAdminUsername: data.masterAdminUsername || 'faizan',
        lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
        productsCount: data.productsCount || 0,
        transactionsCount: data.transactionsCount || 0,
        customersCount: data.customersCount || 0,
        storeName: data.storeName || 'sy Nayab',
        cloudSyncMode: data.cloudSyncMode || 'central_api',
        serverLatencyMs: latencyMs,
      },
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs,
      status: {
        status: 'offline',
        version: '2.0.0',
        serverId: 'faizan-inamdar',
        serverAdmin: 'Faizan Inamdar',
        masterAdminUsername: 'faizan',
        lastSyncedAt: '',
        productsCount: 0,
        transactionsCount: 0,
        customersCount: 0,
        storeName: 'Local Terminal Mode',
        cloudSyncMode: 'central_api',
        serverLatencyMs: latencyMs,
      },
    };
  }
}

/**
 * Pull full central database snapshot
 */
export async function pullCentralSnapshot(): Promise<SyncResult> {
  try {
    const res = await fetch(`${API_BASE}/sync`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      snapshot: data.snapshot,
      lastUpdated: data.timestamp,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to pull central snapshot',
    };
  }
}

/**
 * Convenience helper to directly fetch the snapshot data
 */
export async function fetchCentralSnapshot() {
  const res = await pullCentralSnapshot();
  if (res.success && res.snapshot) {
    return res.snapshot;
  }
  return null;
}

/**
 * Push local changes / delta and receive merged central snapshot
 */
export async function pushCentralSync(delta: {
  products?: Product[];
  transactions?: Transaction[];
  customers?: CustomerUdhaar[];
  settings?: StoreSettings;
  staff?: StaffAccount[];
  performedBy?: string;
  clientId?: string;
  outletId?: string;
}): Promise<SyncResult> {
  try {
    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(delta),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      snapshot: data.snapshot,
      lastUpdated: data.lastUpdated,
      changesApplied: data.changesApplied,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Push sync failed',
    };
  }
}

/**
 * Convenience alias for pushCentralSync
 */
export const pushCentralDelta = pushCentralSync;

/**
 * Master Admin: Verify Master Admin PIN credentials
 */
export async function verifyMasterAdminCredentials(pin: string): Promise<{
  authenticated: boolean;
  role?: string;
  staff?: StaffAccount;
  token?: string;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/master-admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!res.ok || !data.authenticated) {
      return { authenticated: false, message: data.message || 'Authentication failed' };
    }
    return {
      authenticated: true,
      role: data.role,
      staff: data.staff,
      token: data.token,
    };
  } catch (err: any) {
    // Fallback: if server is temporarily unreachable, check master admin pin locally ('nayab@q6')
    if (pin.trim() === 'nayab@q6') {
      return { authenticated: true, role: 'master_admin' };
    }
    return { authenticated: false, message: err.message || 'Authentication error' };
  }
}

/**
 * Master Admin: Save (add or update) product directly in central DB
 */
export async function saveCentralProduct(product: Product, performedBy = 'Master Admin'): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, performedBy }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, product: data.product };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Delete product from central DB
 */
export async function deleteCentralProduct(productId: string, performedBy = 'Master Admin'): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(productId)}?performedBy=${encodeURIComponent(performedBy)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Bulk rate adjustment
 */
export async function bulkAdjustCentralRates(params: {
  category?: string;
  percentageChange?: number;
  fixedOffset?: number;
  rounding?: 'integer' | 'half' | 'none';
  actor?: string;
}): Promise<{ success: boolean; count?: number; updatedProducts?: Product[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/products/bulk-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, count: data.count, updatedProducts: data.updatedProducts };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Void a transaction
 */
export async function voidCentralTransaction(id: string, reason: string, actor = 'Master Admin'): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/transactions/void`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reason, actor }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Update staff accounts
 */
export async function updateCentralStaff(staff: StaffAccount[], actor = 'Master Admin'): Promise<{ success: boolean; staff?: StaffAccount[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff, actor }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, staff: data.staff };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Fetch audit logs
 */
export async function fetchCentralAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Master Admin: Configure Cloud Database (Firebase Firestore / Central REST API)
 */
export async function updateCentralCloudConfig(params: {
  cloudSyncMode?: 'central_api' | 'firebase_firestore' | 'hybrid';
  firebaseConfig?: {
    projectId?: string;
    apiKey?: string;
    firestoreDatabaseId?: string;
    autoSyncToCloud?: boolean;
  };
  actor?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/master-admin/cloud-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Restore Database
 */
export async function restoreCentralDatabase(backupData: any, actor = 'Master Admin'): Promise<SyncResult> {
  try {
    const res = await fetch(`${API_BASE}/master-admin/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupData, actor }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, snapshot: data.snapshot };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Factory Reset Database
 */
export async function resetCentralDatabase(confirmPhrase: string, actor = 'Master Admin'): Promise<SyncResult> {
  try {
    const res = await fetch(`${API_BASE}/master-admin/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPhrase, actor }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, snapshot: data.snapshot };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Verify Master Admin / Server Owner credentials with central server
 */
export async function verifyCentralMasterAdmin(pin: string, serverIdOrUsername?: string): Promise<{
  authenticated: boolean;
  role?: string;
  staff?: StaffAccount;
  serverId?: string;
  serverAdmin?: string;
  token?: string;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/master-admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, serverId: serverIdOrUsername, username: serverIdOrUsername }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { authenticated: false, message: err.message || 'Server connection failed' };
  }
}

/**
 * Master Admin: Fetch all store outlets with live operational metrics
 * Enables admin owner to view outlets from anywhere online from another device
 */
export async function fetchCentralOutlets(): Promise<{
  success: boolean;
  outlets?: StoreProfile[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/outlets`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, outlets: data.outlets };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Fetch detailed live data & metrics for a specific outlet
 */
export async function fetchCentralOutletData(outletId: string): Promise<{
  success: boolean;
  outlet?: StoreProfile;
  recentTransactions?: Transaction[];
  customers?: CustomerUdhaar[];
  staff?: StaffAccount[];
  metrics?: any;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/outlets/${encodeURIComponent(outletId)}`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      outlet: data.outlet,
      recentTransactions: data.recentTransactions,
      customers: data.customers,
      staff: data.staff,
      metrics: data.metrics,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Save (create or update) outlet data on central server
 * Enables admin owner to edit outlets from any device online
 */
export async function saveCentralOutlet(
  outlet: Partial<StoreProfile> & { shopName: string },
  performedBy = 'Admin Owner Online'
): Promise<{
  success: boolean;
  outlet?: StoreProfile;
  outlets?: StoreProfile[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/outlets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outlet, actor: performedBy }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return {
      success: true,
      outlet: data.outlet,
      outlets: data.outlets,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Master Admin: Delete outlet on central server
 */
export async function deleteCentralOutlet(
  outletId: string,
  performedBy = 'Admin Owner Online'
): Promise<{
  success: boolean;
  remainingOutlets?: StoreProfile[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/outlets/${encodeURIComponent(outletId)}?actor=${encodeURIComponent(performedBy)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return { success: true, remainingOutlets: data.remainingOutlets };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Switch active counter outlet POS
 */
export async function switchCentralActiveOutlet(
  outletId: string,
  performedBy = 'Counter User'
): Promise<{ success: boolean; activeStoreId?: string; outlet?: StoreProfile; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/outlets/switch-active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outletId, actor: performedBy }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, activeStoreId: data.activeStoreId, outlet: data.outlet };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
