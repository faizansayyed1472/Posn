import fs from 'fs';
import path from 'path';

export interface CentralProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  unit: string;
  rate: number;
  costPrice?: number;
  stock?: number;
  popular?: boolean;
  minStockAlert?: number;
  barcode?: string;
  notes?: string;
  imageUrl?: string;
  updatedAt?: string;
}

export interface CentralTransaction {
  id: string;
  receiptNumber: string;
  type: 'sale' | 'expense';
  amount: number;
  baseAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  paymentMode: 'cash' | 'online_upi' | 'credit_udhaar';
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  staffName?: string;
  staffId?: string;
  remarks?: string;
  notes?: string;
  timestamp: string;
  items?: any[];
  storeId?: string;
  storeName?: string;
  outletId?: string;
  outletName?: string;
  voided?: boolean;
  voidReason?: string;
}

export interface CentralCustomer {
  id: string;
  name: string;
  phone: string;
  totalDue: number;
  creditLimit?: number;
  lastActive: string;
  notes?: string;
  outletId?: string;
  outletName?: string;
  storeId?: string;
}

export interface CentralStaff {
  id: string;
  name: string;
  username?: string;
  serverId?: string;
  role: 'master_admin' | 'owner' | 'manager' | 'cashier';
  pin: string;
  phone?: string;
  active: boolean;
  assignedOutletIds?: string[];
  defaultOutletId?: string;
  createdAt?: string;
  permissions?: Record<string, boolean>;
}

export interface CentralOutlet {
  id: string;
  shopName: string;
  shortcutName?: string;
  tagline?: string;
  phone: string;
  upiId: string;
  upiName?: string;
  gstin?: string;
  address: string;
  defaultTaxRate: number;
  createdAt?: string;
  updatedAt?: string;
  isDefault?: boolean;
  isPrimary?: boolean;
  active?: boolean;
  todaySales?: number;
  todayBillsCount?: number;
  cashSales?: number;
  upiSales?: number;
  udhaarSales?: number;
  totalRevenue?: number;
  totalBillsCount?: number;
  udhaarDueTotal?: number;
  customersCount?: number;
  assignedStaffCount?: number;
  assignedStaff?: Array<{ id: string; name: string; role: string; username?: string }>;
  lastSyncAt?: string;
  lastTransactionAt?: string;
}

export interface CentralAuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: 'product' | 'transaction' | 'customer' | 'settings' | 'staff' | 'database' | 'system';
  details: string;
  performedBy: string;
}

export interface CentralStoreDb {
  version: string;
  serverId?: string;
  serverAdmin?: string;
  masterAdminUsername?: string;
  lastUpdated: string;
  cloudSyncMode: 'central_api' | 'firebase_firestore' | 'hybrid';
  outletSyncTimestamps?: Record<string, string>;
  firebaseConfig?: {
    projectId?: string;
    apiKey?: string;
    firestoreDatabaseId?: string;
    autoSyncToCloud?: boolean;
    connected?: boolean;
  };
  products: CentralProduct[];
  transactions: CentralTransaction[];
  customers: CentralCustomer[];
  staff: CentralStaff[];
  settings: Record<string, any>;
  auditLogs: CentralAuditLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'central_store_db.json');

const DEFAULT_PRODUCTS: CentralProduct[] = [
  { id: 'sp-1', name: 'Haldi Powder (Turmeric)', hindiName: 'हल्दी पाउडर', category: 'spices', unit: 'kg', rate: 260, costPrice: 195, stock: 45, popular: true, barcode: '8901058852011' },
  { id: 'sp-2', name: 'Jeera (Cumin Seeds)', hindiName: 'साबुत जीरा', category: 'spices', unit: 'kg', rate: 380, costPrice: 290, stock: 28, popular: true, barcode: '8901058852028' },
  { id: 'sp-3', name: 'Dhaniya Powder (Coriander)', hindiName: 'धनिया पाउडर', category: 'spices', unit: 'kg', rate: 220, costPrice: 160, stock: 35, popular: true, barcode: '8901058852035' },
  { id: 'sp-4', name: 'Lal Mirch Powder (Red Chilli)', hindiName: 'लाल मिर्च पाउडर', category: 'spices', unit: 'kg', rate: 340, costPrice: 250, stock: 18, popular: true, barcode: '8901058852042' },
  { id: 'sp-5', name: 'Garam Masala Special', hindiName: 'शाही गरम मसाला', category: 'spices', unit: 'kg', rate: 680, costPrice: 480, stock: 6, popular: true, barcode: '8901058852059', minStockAlert: 10 },
  { id: 'sp-6', name: 'Chhoti Elaichi (Green Cardamom)', hindiName: 'छोटी इलायची', category: 'spices', unit: 'g', rate: 3.2, costPrice: 2.4, stock: 250, popular: true, barcode: '8901058852066' },
  { id: 'sp-7', name: 'Sabut Kali Mirch (Black Pepper)', hindiName: 'काली मिर्च', category: 'spices', unit: 'kg', rate: 850, costPrice: 650, stock: 14, popular: true, barcode: '8901058852073' },
  { id: 'sp-8', name: 'Laung (Cloves)', hindiName: 'साबुत लौंग', category: 'spices', unit: 'kg', rate: 1150, costPrice: 880, stock: 7, popular: false, barcode: '8901058852080', minStockAlert: 10 },
  { id: 'sp-9', name: 'Dalchini (Cinnamon Bark)', hindiName: 'दालचीनी', category: 'spices', unit: 'kg', rate: 460, costPrice: 340, stock: 12, popular: false, barcode: '8901058852097' },
  { id: 'sp-10', name: 'Badi Elaichi (Black Cardamom)', hindiName: 'बड़ी इलायची', category: 'spices', unit: 'kg', rate: 1750, costPrice: 1350, stock: 2, popular: false, barcode: '8901058852103', minStockAlert: 5 },
  { id: 'sp-11', name: 'Rai / Sarson (Mustard Seeds)', hindiName: 'राई / सरसों दाना', category: 'spices', unit: 'kg', rate: 110, costPrice: 82, stock: 60, popular: true, barcode: '8901058852110' },
  { id: 'sp-12', name: 'Saunf (Fennel Seeds)', hindiName: 'सौंफ मोटी', category: 'spices', unit: 'kg', rate: 240, costPrice: 180, stock: 22, popular: false, barcode: '8901058852127' },
  { id: 'sp-13', name: 'Ajwain (Carom Seeds)', hindiName: 'अजवाइन', category: 'spices', unit: 'kg', rate: 290, costPrice: 215, stock: 16, popular: false, barcode: '8901058852134' },
  { id: 'sp-14', name: 'Kasuri Methi', hindiName: 'कस्तूरी मेथी', category: 'spices', unit: 'packet', rate: 45, costPrice: 32, stock: 25, popular: false, barcode: '8901058852141' },
  { id: 'sp-15', name: 'Asafoetida (Hing Vandevi 50g)', hindiName: 'हींग (50 ग्राम)', category: 'spices', unit: 'packet', rate: 115, costPrice: 88, stock: 4, popular: true, barcode: '8901058852158', minStockAlert: 8 },
  { id: 'sp-16', name: 'Biryani Masala (Pack 100g)', hindiName: 'बिरयानी मसाला', category: 'spices', unit: 'packet', rate: 75, costPrice: 54, stock: 30, popular: true, barcode: '8901058852165' },
  { id: 'sp-17', name: 'Kashmiri Mirch (Deggi)', hindiName: 'कश्मीरी लाल मिर्च', category: 'spices', unit: 'kg', rate: 480, costPrice: 370, stock: 15, popular: true, barcode: '8901058852172' },
  { id: 'sp-18', name: 'Amchur Powder (Dry Mango)', hindiName: 'आमचूर पाउडर', category: 'spices', unit: 'kg', rate: 320, costPrice: 240, stock: 9, popular: false, barcode: '8901058852189' },
  { id: 'dal-1', name: 'Toor Dal (Arhar Dal)', hindiName: 'अरहर / तूर दाल', category: 'dal_pulses', unit: 'kg', rate: 165, costPrice: 142, stock: 85, popular: true, barcode: '8902058852018' },
  { id: 'dal-2', name: 'Moong Dal Dhuli (Yellow)', hindiName: 'मूंग दाल धुली', category: 'dal_pulses', unit: 'kg', rate: 130, costPrice: 108, stock: 40, popular: true, barcode: '8902058852025' },
  { id: 'dal-3', name: 'Chana Dal', hindiName: 'चना दाल', category: 'dal_pulses', unit: 'kg', rate: 92, costPrice: 76, stock: 55, popular: true, barcode: '8902058852032' },
  { id: 'dal-4', name: 'Urad Dal Dhuli (White)', hindiName: 'उड़द दाल धुली', category: 'dal_pulses', unit: 'kg', rate: 145, costPrice: 122, stock: 18, popular: false, barcode: '8902058852049' },
  { id: 'dal-5', name: 'Kabuli Chana (White Chickpeas)', hindiName: 'काबुली चना', category: 'dal_pulses', unit: 'kg', rate: 135, costPrice: 110, stock: 32, popular: true, barcode: '8902058852056' },
  { id: 'dal-6', name: 'Kala Chana (Desi Gram)', hindiName: 'काला चना', category: 'dal_pulses', unit: 'kg', rate: 85, costPrice: 68, stock: 24, popular: false, barcode: '8902058852063' },
  { id: 'dal-7', name: 'Rajma Chitra (Kidney Beans)', hindiName: 'चित्रा राजमा', category: 'dal_pulses', unit: 'kg', rate: 155, costPrice: 128, stock: 20, popular: true, barcode: '8902058852070' },
  { id: 'gr-1', name: 'Chakki Fresh Sharbati Atta', hindiName: 'शरबती गेहूं आटा', category: 'grains_flour', unit: 'kg', rate: 44, costPrice: 36, stock: 150, popular: true, barcode: '8903058852015' },
  { id: 'gr-2', name: 'Basmati Rice Premium 1121', hindiName: 'बासमती चावल 1121', category: 'grains_flour', unit: 'kg', rate: 135, costPrice: 105, stock: 75, popular: true, barcode: '8903058852022' },
  { id: 'gr-3', name: 'Maida (Refined Flour)', hindiName: 'मैदा', category: 'grains_flour', unit: 'kg', rate: 38, costPrice: 30, stock: 45, popular: false, barcode: '8903058852039' },
  { id: 'gr-4', name: 'Sooji / Rava (Semolina)', hindiName: 'सूजी / रवा', category: 'grains_flour', unit: 'kg', rate: 42, costPrice: 33, stock: 38, popular: false, barcode: '8903058852046' },
  { id: 'gr-5', name: 'Besan (Gram Flour)', hindiName: 'चना बेसन', category: 'grains_flour', unit: 'kg', rate: 98, costPrice: 80, stock: 30, popular: true, barcode: '8903058852053' },
  { id: 'oil-1', name: 'Kachi Ghani Sarson Oil (1L)', hindiName: 'कच्ची घानी सरसों तेल', category: 'oil_ghee', unit: 'litre', rate: 158, costPrice: 138, stock: 50, popular: true, barcode: '8904058852012' },
  { id: 'oil-2', name: 'Fortune Refined Sunflower Oil (1L)', hindiName: 'रिफाइंड तेल 1L', category: 'oil_ghee', unit: 'packet', rate: 138, costPrice: 122, stock: 40, popular: true, barcode: '8904058852029' },
  { id: 'oil-3', name: 'Pure Desi Cow Ghee (1L)', hindiName: 'शुद्ध देशी गाय घी', category: 'oil_ghee', unit: 'litre', rate: 640, costPrice: 520, stock: 15, popular: true, barcode: '8904058852036' },
  { id: 'df-1', name: 'Kaju W320 Cashews (1kg)', hindiName: 'काजू साबुत W320', category: 'dry_fruits', unit: 'kg', rate: 840, costPrice: 680, stock: 25, popular: true, barcode: '8905058852019' },
  { id: 'df-2', name: 'California Badam Almonds (1kg)', hindiName: 'कैलिफोर्निया बादाम', category: 'dry_fruits', unit: 'kg', rate: 780, costPrice: 630, stock: 30, popular: true, barcode: '8905058852026' },
  { id: 'df-3', name: 'Kishmish Green Raisins (1kg)', hindiName: 'हरी किशमिश', category: 'dry_fruits', unit: 'kg', rate: 340, costPrice: 260, stock: 20, popular: true, barcode: '8905058852033' },
  { id: 'df-4', name: 'Phool Makhana (Fox Nuts)', hindiName: 'फूल मखाना', category: 'dry_fruits', unit: 'kg', rate: 920, costPrice: 750, stock: 12, popular: true, barcode: '8905058852040' },
  { id: 'dn-1', name: 'Tata Salt (1kg Pouch)', hindiName: 'टाटा नमक 1kg', category: 'daily_needs', unit: 'packet', rate: 28, costPrice: 24, stock: 90, popular: true, barcode: '8906058852016' },
  { id: 'dn-2', name: 'Sugar / Cheeni (1kg)', hindiName: 'सफेद चीनी', category: 'daily_needs', unit: 'kg', rate: 45, costPrice: 39, stock: 120, popular: true, barcode: '8906058852023' },
  { id: 'dn-3', name: 'Red Label Tea (250g)', hindiName: 'चाय पत्ती 250g', category: 'daily_needs', unit: 'packet', rate: 140, costPrice: 120, stock: 35, popular: true, barcode: '8906058852030' },
];

const DEFAULT_STAFF: CentralStaff[] = [
  {
    id: 'faizan-inamdar',
    name: 'Faizan Inamdar (admin)',
    username: 'faizan',
    serverId: 'faizan-inamdar',
    role: 'owner',
    pin: 'nayab@q6',
    phone: '9876543210',
    active: true,
    assignedOutletIds: ['store-1', 'store-2'],
    defaultOutletId: 'store-1',
    createdAt: new Date().toISOString(),
    permissions: {
      canEditProducts: true,
      canViewReports: true,
      canManageUdhaar: true,
      canVoidBills: true,
      canAccessMasterAdmin: true,
    },
  },
  {
    id: 'staff-1',
    name: 'Abdullah',
    username: 'abdullah',
    role: 'cashier',
    pin: '0000',
    phone: '9876500001',
    active: true,
    assignedOutletIds: ['store-1'],
    defaultOutletId: 'store-1',
    createdAt: new Date().toISOString(),
    permissions: {
      canEditProducts: false,
      canViewReports: false,
      canManageUdhaar: true,
      canVoidBills: false,
      canAccessMasterAdmin: false,
    },
  },
  {
    id: 'staff-2',
    name: 'Ayan',
    username: 'ayan',
    role: 'cashier',
    pin: '0000',
    phone: '9876500002',
    active: true,
    assignedOutletIds: ['store-2'],
    defaultOutletId: 'store-2',
    createdAt: new Date().toISOString(),
    permissions: {
      canEditProducts: false,
      canViewReports: false,
      canManageUdhaar: true,
      canVoidBills: false,
      canAccessMasterAdmin: false,
    },
  },
];

const DEFAULT_CUSTOMERS: CentralCustomer[] = [];

const DEFAULT_SETTINGS = {
  shopName: 'sy Nayab',
  tagline: 'Authentic Indian Spices & Daily Groceries',
  phone: '9876543210',
  upiId: 'nayabmasale@upi',
  upiName: 'sy Nayab',
  address: 'Main Bazaar, Outlet 1',
  defaultTaxRate: 0,
  lowStockThreshold: 10,
  staffAccounts: DEFAULT_STAFF,
  activeStaffId: 'staff-owner',
  stores: [
    {
      id: 'store-1',
      shopName: 'sy Nayab',
      shortcutName: 'SY',
      tagline: 'Authentic Indian Spices & Daily Groceries',
      phone: '9876543210',
      upiId: 'nayabmasale@upi',
      upiName: 'sy Nayab',
      address: 'Main Bazaar, Outlet 1',
      defaultTaxRate: 0,
      isDefault: true,
      isPrimary: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'store-2',
      shopName: 'kp Nayab',
      shortcutName: 'KP',
      tagline: 'Authentic Indian Spices & Daily Groceries',
      phone: '9876543210',
      upiId: 'nayabmasale@upi',
      upiName: 'kp Nayab',
      address: 'Branch 2, Outlet 2',
      defaultTaxRate: 0,
      isDefault: false,
      createdAt: new Date().toISOString(),
    },
  ],
  activeStoreId: 'store-1',
  printerConfig: {
    printerType: 'browser',
    paperWidth: '58mm',
    autoPrintOnSale: false,
    connected: false,
    printQrCodeOnSlip: true,
  },
};

class CentralDatabaseManager {
  private db: CentralStoreDb;
  private isWriting = false;

  constructor() {
    this.ensureDataDir();
    this.db = this.loadOrInitDb();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create central data directory:', err);
      }
    }
  }

  private loadOrInitDb(): CentralStoreDb {
    // Check for provisioned firebase-applet-config.json
    let provisionedConfig: any = null;
    const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(firebaseConfigPath)) {
      try {
        provisionedConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));
      } catch (e) {
        console.warn('Error reading firebase-applet-config.json:', e);
      }
    }

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products)) {
          // Verify staff has master_admin
          if (!parsed.staff || !parsed.staff.some((s: CentralStaff) => s.role === 'master_admin' || s.role === 'owner')) {
            parsed.staff = DEFAULT_STAFF;
          }
          // Ensure transactions and customers arrays exist
          if (!Array.isArray(parsed.transactions)) {
            parsed.transactions = [];
          }
          if (!Array.isArray(parsed.customers)) {
            parsed.customers = [];
          }
          // Ensure staff accounts have outlet assignments
          if (Array.isArray(parsed.staff)) {
            parsed.staff = parsed.staff.map((s: CentralStaff) => {
              if (s.name?.toLowerCase().includes('abdullah') || s.id === 'staff-1') {
                return {
                  ...s,
                  username: s.username || 'abdullah',
                  assignedOutletIds: s.assignedOutletIds?.length ? s.assignedOutletIds : ['store-1'],
                  defaultOutletId: s.defaultOutletId || 'store-1',
                };
              }
              if (s.name?.toLowerCase().includes('ayan') || s.id === 'staff-2') {
                return {
                  ...s,
                  username: s.username || 'ayan',
                  assignedOutletIds: s.assignedOutletIds?.length ? s.assignedOutletIds : ['store-2'],
                  defaultOutletId: s.defaultOutletId || 'store-2',
                };
              }
              if (s.role === 'owner' || s.role === 'master_admin' || s.id === 'staff-owner' || s.id === 'faizan-inamdar' || s.name?.toLowerCase().includes('faizan')) {
                return {
                  ...s,
                  id: s.id === 'staff-owner' ? 'faizan-inamdar' : (s.id || 'faizan-inamdar'),
                  name: 'Faizan Inamdar (admin)',
                  username: s.username || 'faizan',
                  serverId: 'faizan-inamdar',
                  assignedOutletIds: s.assignedOutletIds?.length ? s.assignedOutletIds : ['store-1', 'store-2'],
                  defaultOutletId: s.defaultOutletId || 'store-1',
                };
              }
              return s;
            });
          }
          parsed.serverId = parsed.serverId || 'faizan-inamdar';
          parsed.serverAdmin = parsed.serverAdmin || 'Faizan Inamdar';
          parsed.masterAdminUsername = parsed.masterAdminUsername || 'faizan';
          if (!parsed.outletSyncTimestamps) {
            parsed.outletSyncTimestamps = {
              'store-1': new Date().toISOString(),
              'store-2': new Date().toISOString(),
            };
          }
          if (provisionedConfig) {
            parsed.firebaseConfig = {
              projectId: provisionedConfig.projectId,
              apiKey: provisionedConfig.apiKey,
              firestoreDatabaseId: provisionedConfig.firestoreDatabaseId,
              autoSyncToCloud: true,
              connected: true,
            };
            parsed.cloudSyncMode = 'firebase_firestore';
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Central DB file unreadable, initializing fresh central database:', err);
    }

    const initialDb: CentralStoreDb = {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      cloudSyncMode: provisionedConfig ? 'firebase_firestore' : 'central_api',
      firebaseConfig: provisionedConfig
        ? {
            projectId: provisionedConfig.projectId,
            apiKey: provisionedConfig.apiKey,
            firestoreDatabaseId: provisionedConfig.firestoreDatabaseId,
            autoSyncToCloud: true,
            connected: true,
          }
        : undefined,
      products: DEFAULT_PRODUCTS,
      transactions: [],
      customers: DEFAULT_CUSTOMERS,
      staff: DEFAULT_STAFF,
      settings: DEFAULT_SETTINGS,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'DATABASE_INITIALIZED',
          entity: 'database',
          details: 'Central Server Database initialized with initial catalog & master admin.',
          performedBy: 'System Bootstrap',
        },
      ],
    };

    this.persist(initialDb);
    return initialDb;
  }

  private persist(dbToSave = this.db) {
    if (this.isWriting) return;
    this.isWriting = true;
    try {
      dbToSave.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(dbToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed writing central database to disk:', err);
    } finally {
      this.isWriting = false;
    }
  }

  public getStatus() {
    return {
      status: 'connected' as const,
      version: this.db.version,
      serverId: this.db.serverId || 'faizan-inamdar',
      serverAdmin: this.db.serverAdmin || 'Faizan Inamdar',
      masterAdminUsername: this.db.masterAdminUsername || 'faizan',
      lastSyncedAt: this.db.lastUpdated,
      productsCount: this.db.products.length,
      transactionsCount: this.db.transactions.length,
      customersCount: this.db.customers.length,
      storeName: this.db.settings?.shopName || 'sy Nayab',
      cloudSyncMode: this.db.cloudSyncMode,
      firebaseConfigured: Boolean(this.db.firebaseConfig?.projectId),
    };
  }

  public getFullSnapshot(): CentralStoreDb {
    return this.db;
  }

  public getProducts(): CentralProduct[] {
    return this.db.products;
  }

  public getTransactions(): CentralTransaction[] {
    return this.db.transactions;
  }

  public getCustomers(): CentralCustomer[] {
    return this.db.customers;
  }

  public getStaff(): CentralStaff[] {
    return this.db.staff;
  }

  public getSettings(): Record<string, any> {
    return this.db.settings;
  }

  public getAuditLogs(limit = 100): CentralAuditLog[] {
    return this.db.auditLogs.slice(-limit).reverse();
  }

  public addAuditLog(action: string, entity: CentralAuditLog['entity'], details: string, performedBy = 'Master Admin') {
    const entry: CentralAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      entity,
      details,
      performedBy,
    };
    this.db.auditLogs.push(entry);
    // Keep max 1000 audit entries
    if (this.db.auditLogs.length > 1000) {
      this.db.auditLogs = this.db.auditLogs.slice(-800);
    }
    this.persist();
    return entry;
  }

  public verifyMasterAdmin(pin: string, usernameOrServerId?: string): { success: boolean; staff?: CentralStaff; serverId?: string; serverAdmin?: string; message?: string } {
    const cleanPin = (pin || '').trim();
    const cleanId = (usernameOrServerId || '').trim().toLowerCase();
    const cleanIdStripped = cleanId.replace(/[^a-z0-9]/g, '');

    const isFaizanAttempt =
      !cleanId ||
      cleanId === 'faizan' ||
      cleanId === 'faizan inamdar' ||
      cleanId === 'faizan-inamdar' ||
      cleanIdStripped === 'faizaninamdar' ||
      cleanIdStripped === 'faizaninamdaradmin' ||
      cleanIdStripped === 'faizan' ||
      cleanId === 'server' ||
      cleanId === 'admin' ||
      cleanId === 'owner' ||
      cleanId === 'staff-owner';

    // Default master admin pin fallback is 'nayab@q6'
    if (cleanPin === 'nayab@q6') {
      const admin = this.db.staff.find((s) =>
        s.role === 'master_admin' ||
        s.role === 'owner' ||
        s.username === 'faizan' ||
        s.id === 'faizan-inamdar' ||
        s.id === 'staff-owner'
      ) || this.db.staff[0];
      return {
        success: true,
        staff: admin,
        serverId: this.db.serverId || 'faizan-inamdar',
        serverAdmin: this.db.serverAdmin || 'Faizan Inamdar',
      };
    }

    const matched = this.db.staff.find((s) => {
      const isOwnerOrMaster = s.role === 'master_admin' || s.role === 'owner';
      const u = (s.username || '').toLowerCase();
      const n = (s.name || '').toLowerCase();
      const nStripped = n.replace(/[^a-z0-9]/g, '');
      const rawId = (s.id || '').toLowerCase();
      const rawServerId = ((s as any).serverId || '').toLowerCase();

      const pinMatches = s.pin === cleanPin;
      if (!pinMatches) return false;

      if (!cleanId) return isOwnerOrMaster;

      return (
        (isFaizanAttempt && isOwnerOrMaster) ||
        u === cleanId ||
        rawServerId === cleanId ||
        n === cleanId ||
        nStripped === cleanIdStripped ||
        rawId === cleanId
      );
    });

    if (matched) {
      return {
        success: true,
        staff: matched,
        serverId: this.db.serverId || 'faizan-inamdar',
        serverAdmin: this.db.serverAdmin || 'Faizan Inamdar',
      };
    }

    return {
      success: false,
      message: 'Invalid Master Admin credentials. Please check Faizan Inamdar server ID and PIN.',
    };
  }

  /**
   * Merge sync delta from client terminal
   */
  public syncClient(delta: {
    clientTimestamp?: string;
    clientId?: string;
    outletId?: string;
    products?: CentralProduct[];
    transactions?: CentralTransaction[];
    customers?: CentralCustomer[];
    settings?: Record<string, any>;
    staff?: CentralStaff[];
    performedBy?: string;
  }) {
    const actor = delta.performedBy || 'Counter Terminal';

    let hasChanges = false;

    // Track outlet-specific sync timestamp if outletId provided
    if (delta.outletId) {
      this.db.outletSyncTimestamps = this.db.outletSyncTimestamps || {};
      this.db.outletSyncTimestamps[delta.outletId] = new Date().toISOString();
      const outletName = delta.outletId === 'store-2' ? 'kp Nayab' : 'sy Nayab';
      this.addAuditLog(
        'OUTLET_SYNCED',
        'database',
        `Synchronized data separately for outlet: ${outletName} (${delta.outletId})`,
        actor
      );
      hasChanges = true;
    }

    // 1. Merge Products: match by ID; if client has newer or new products, update/insert
    if (Array.isArray(delta.products) && delta.products.length > 0) {
      const productMap = new Map<string, CentralProduct>(this.db.products.map((p) => [p.id, p]));
      for (const p of delta.products) {
        if (!p || !p.id) continue;
        const existing = productMap.get(p.id);
        if (!existing) {
          productMap.set(p.id, { ...p, updatedAt: p.updatedAt || new Date().toISOString() });
          hasChanges = true;
        } else {
          // Compare updatedAt or rate/stock
          if (p.updatedAt && (!existing.updatedAt || p.updatedAt >= existing.updatedAt)) {
            productMap.set(p.id, { ...existing, ...p });
            hasChanges = true;
          } else if (p.rate !== existing.rate || p.stock !== existing.stock || p.name !== existing.name) {
            productMap.set(p.id, { ...existing, ...p, updatedAt: new Date().toISOString() });
            hasChanges = true;
          }
        }
      }
      this.db.products = Array.from(productMap.values());
    }

    // 2. Merge Transactions: prevent duplicates by ID or receiptNumber
    if (Array.isArray(delta.transactions) && delta.transactions.length > 0) {
      const txIds = new Set(this.db.transactions.map((t) => t.id));
      const receiptNos = new Set(this.db.transactions.map((t) => t.receiptNumber));
      const newTxs: CentralTransaction[] = [];

      for (const t of delta.transactions) {
        if (!t || (!t.id && !t.receiptNumber)) continue;
        const existing = this.db.transactions.find(
          (tx) => tx.id === t.id || (tx.receiptNumber && tx.receiptNumber === t.receiptNumber)
        );

        if (!existing) {
          const storeId = t.outletId || t.storeId || 'store-1';
          const defaultOutletName = storeId === 'store-2' ? 'kp Nayab' : 'sy Nayab';
          const normalizedTx: CentralTransaction = {
            ...t,
            storeId,
            outletId: storeId,
            storeName: t.outletName || t.storeName || defaultOutletName,
            outletName: t.outletName || t.storeName || defaultOutletName,
          };
          newTxs.push(normalizedTx);
          txIds.add(t.id);
          if (t.receiptNumber) receiptNos.add(t.receiptNumber);
          hasChanges = true;
        } else {
          // If voided status changed, update it
          if (t.voided && !existing.voided) {
            existing.voided = true;
            existing.voidReason = t.voidReason;
            hasChanges = true;
          }
          // Backfill outletId/storeId if missing
          if (!existing.outletId && (t.outletId || t.storeId)) {
            existing.outletId = t.outletId || t.storeId;
            existing.storeId = existing.outletId;
            hasChanges = true;
          }
        }
      }

      if (newTxs.length > 0) {
        this.db.transactions = [...newTxs, ...this.db.transactions];
        this.addAuditLog(
          'TRANSACTIONS_SYNCED',
          'transaction',
          `Synced ${newTxs.length} new transaction(s) from counter terminal.`,
          actor
        );
      }
    }

    // 3. Merge Customers: preserve highest totalDue or latest activity and preserve outlet
    if (Array.isArray(delta.customers) && delta.customers.length > 0) {
      const custMap = new Map<string, CentralCustomer>(this.db.customers.map((c) => [c.id, c]));
      for (const c of delta.customers) {
        if (!c || !c.id) continue;
        const storeId = c.outletId || c.storeId || 'store-1';
        const defaultOutletName = storeId === 'store-2' ? 'kp Nayab' : 'sy Nayab';
        const normalizedCust: CentralCustomer = {
          ...c,
          storeId,
          outletId: storeId,
          outletName: c.outletName || defaultOutletName,
        };

        const existing = custMap.get(c.id);
        if (!existing) {
          custMap.set(c.id, normalizedCust);
          hasChanges = true;
        } else {
          if (new Date(c.lastActive || 0) >= new Date(existing.lastActive || 0) || c.totalDue !== existing.totalDue) {
            custMap.set(c.id, { ...existing, ...normalizedCust });
            hasChanges = true;
          }
        }
      }
      this.db.customers = Array.from(custMap.values());
    }

    // 4. Merge Settings if provided
    if (delta.settings && typeof delta.settings === 'object' && Object.keys(delta.settings).length > 0) {
      this.db.settings = { ...this.db.settings, ...delta.settings };
      hasChanges = true;
    }

    // 5. Merge Staff if provided (ensuring Faizan Inamdar maintains serverId)
    if (Array.isArray(delta.staff) && delta.staff.length > 0) {
      const staffMap = new Map<string, CentralStaff>(this.db.staff.map((s) => [s.id, s]));
      for (const s of delta.staff) {
        if (!s || !s.id) continue;
        const isFaizan =
          s.role === 'owner' ||
          s.role === 'master_admin' ||
          s.id === 'staff-owner' ||
          s.id === 'faizan-inamdar' ||
          s.name?.toLowerCase().includes('faizan');

        const normalizedStaff: CentralStaff = {
          ...s,
          serverId: isFaizan ? 'faizan-inamdar' : s.serverId,
        };

        const existing = staffMap.get(s.id);
        if (!existing) {
          staffMap.set(s.id, normalizedStaff);
          hasChanges = true;
        } else {
          staffMap.set(s.id, { ...existing, ...normalizedStaff });
          hasChanges = true;
        }
      }
      this.db.staff = Array.from(staffMap.values());
    }

    if (hasChanges) {
      this.persist();
    }

    return {
      success: true,
      status: 'success',
      snapshot: this.db,
      lastSyncedAt: this.db.lastUpdated,
      lastUpdated: this.db.lastUpdated,
      changesApplied: hasChanges,
    };
  }

  /**
   * Master Admin: Add or update single product
   */
  public saveProduct(product: CentralProduct, actor = 'Master Admin'): CentralProduct {
    const existingIndex = this.db.products.findIndex((p) => p.id === product.id);
    const updatedProd: CentralProduct = {
      ...product,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const old = this.db.products[existingIndex];
      this.db.products[existingIndex] = updatedProd;
      this.addAuditLog(
        'PRODUCT_UPDATED',
        'product',
        `Updated ${product.name}: Rate ₹${old.rate} → ₹${product.rate}, Stock ${old.stock ?? 0} → ${product.stock ?? 0}`,
        actor
      );
    } else {
      this.db.products.unshift(updatedProd);
      this.addAuditLog(
        'PRODUCT_CREATED',
        'product',
        `Added new product ${product.name} (@ ₹${product.rate}/${product.unit})`,
        actor
      );
    }

    this.persist();
    return updatedProd;
  }

  /**
   * Master Admin: Delete product
   */
  public deleteProduct(productId: string, actor = 'Master Admin'): boolean {
    const target = this.db.products.find((p) => p.id === productId);
    if (!target) return false;
    this.db.products = this.db.products.filter((p) => p.id !== productId);
    this.addAuditLog('PRODUCT_DELETED', 'product', `Deleted product: ${target.name} (ID: ${productId})`, actor);
    this.persist();
    return true;
  }

  /**
   * Master Admin: Bulk rate adjustment (e.g. increase all spices by 10% or apply flat offset)
   */
  public bulkAdjustRates(params: {
    category?: string;
    percentageChange?: number; // e.g. +10 or -5
    fixedOffset?: number; // e.g. +5 or -2
    rounding?: 'integer' | 'half' | 'none';
    actor?: string;
  }): { count: number; updatedProducts: CentralProduct[] } {
    const { category, percentageChange = 0, fixedOffset = 0, rounding = 'integer', actor = 'Master Admin' } = params;
    let count = 0;
    const updatedList: CentralProduct[] = [];

    this.db.products = this.db.products.map((p) => {
      if (category && category !== 'all' && p.category !== category) {
        return p;
      }

      let newRate = p.rate;
      if (percentageChange !== 0) {
        newRate = newRate * (1 + percentageChange / 100);
      }
      if (fixedOffset !== 0) {
        newRate += fixedOffset;
      }

      if (rounding === 'integer') {
        newRate = Math.round(newRate);
      } else if (rounding === 'half') {
        newRate = Math.round(newRate * 2) / 2;
      } else {
        newRate = Math.round(newRate * 100) / 100;
      }

      if (newRate < 0.1) newRate = 0.1;

      if (newRate !== p.rate) {
        count++;
        const updated = { ...p, rate: newRate, updatedAt: new Date().toISOString() };
        updatedList.push(updated);
        return updated;
      }
      return p;
    });

    if (count > 0) {
      this.addAuditLog(
        'BULK_RATE_ADJUSTMENT',
        'product',
        `Adjusted rates for ${count} product(s) in category [${category || 'all'}]: ${percentageChange >= 0 ? '+' : ''}${percentageChange}%, offset ${fixedOffset}`,
        actor
      );
      this.persist();
    }

    return { count, updatedProducts: updatedList };
  }

  /**
   * Master Admin: Void / Delete a transaction
   */
  public voidTransaction(id: string, reason: string, actor = 'Master Admin'): boolean {
    const tx = this.db.transactions.find((t) => t.id === id);
    if (!tx) return false;
    tx.voided = true;
    tx.voidReason = reason || 'Voided by Master Admin';
    this.addAuditLog('TRANSACTION_VOIDED', 'transaction', `Voided bill #${tx.receiptNumber} (₹${tx.amount}): ${reason}`, actor);
    this.persist();
    return true;
  }

  /**
   * Master Admin: Update staff accounts
   */
  public updateStaff(staffAccounts: CentralStaff[], actor = 'Master Admin') {
    this.db.staff = staffAccounts;
    this.addAuditLog('STAFF_ACCOUNTS_UPDATED', 'staff', `Updated ${staffAccounts.length} staff account(s)`, actor);
    this.persist();
    return this.db.staff;
  }

  /**
   * Get all store outlets configured in settings
   */
  public getOutlets(): CentralOutlet[] {
    if (!this.db.settings) {
      this.db.settings = {};
    }
    if (!Array.isArray(this.db.settings.stores) || this.db.settings.stores.length === 0) {
      this.db.settings.stores = [
        {
          id: 'store-1',
          shopName: this.db.settings.shopName || 'sy Nayab',
          shortcutName: 'SY',
          tagline: this.db.settings.tagline || 'Authentic Indian Spices & Daily Groceries',
          phone: this.db.settings.phone || '9876543210',
          upiId: this.db.settings.upiId || 'nayabmasale@upi',
          upiName: this.db.settings.upiName || 'sy Nayab',
          address: this.db.settings.address || 'Main Bazaar, Outlet 1',
          defaultTaxRate: this.db.settings.defaultTaxRate || 0,
          isDefault: true,
          isPrimary: true,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'store-2',
          shopName: 'kp Nayab',
          shortcutName: 'KP',
          tagline: 'Authentic Indian Spices & Daily Groceries',
          phone: '9876543210',
          upiId: 'nayabmasale@upi',
          upiName: 'kp Nayab',
          address: 'Branch 2, Outlet 2',
          defaultTaxRate: 0,
          isDefault: false,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      this.persist();
    }
    return this.db.settings.stores;
  }

  /**
   * Get all outlets enriched with real-time sales, collections, udhaar, and staff metrics
   * accessible by admin owner from any device online.
   */
  public getEnrichedOutlets(): CentralOutlet[] {
    const outlets = this.getOutlets();
    const todayStr = new Date().toISOString().slice(0, 10);

    return outlets.map((outlet) => {
      const outletId = outlet.id;
      // Filter transactions for this outlet
      const outletTxs = this.db.transactions.filter(
        (t) =>
          !t.voided &&
          (t.outletId === outletId ||
            t.storeId === outletId ||
            (!t.outletId && !t.storeId && (outlet.isDefault || outlet.isPrimary)))
      );
      const todayTxs = outletTxs.filter((t) => (t.timestamp || '').startsWith(todayStr));

      const todaySales = todayTxs
        .filter((t) => t.type === 'sale')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const cashSales = todayTxs
        .filter((t) => t.type === 'sale' && t.paymentMode === 'cash')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const upiSales = todayTxs
        .filter((t) => t.type === 'sale' && t.paymentMode === 'online_upi')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const udhaarSales = todayTxs
        .filter((t) => t.type === 'sale' && t.paymentMode === 'credit_udhaar')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalRevenue = outletTxs
        .filter((t) => t.type === 'sale')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Customers assigned or registered to this outlet
      const outletCusts = this.db.customers.filter(
        (c) =>
          c.outletId === outletId ||
          c.storeId === outletId ||
          (!c.outletId && !c.storeId && (outlet.isDefault || outlet.isPrimary))
      );
      const udhaarDueTotal = outletCusts.reduce((sum, c) => sum + (c.totalDue || 0), 0);

      // Staff members assigned
      const assignedStaff = this.db.staff
        .filter(
          (s) =>
            !s.assignedOutletIds ||
            s.assignedOutletIds.length === 0 ||
            s.assignedOutletIds.includes(outletId)
        )
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          username: s.username,
        }));

      const lastSyncAt =
        this.db.outletSyncTimestamps?.[outletId] || outlet.updatedAt || this.db.lastUpdated;
      const lastTransactionAt = outletTxs.length > 0 ? outletTxs[0].timestamp : undefined;

      return {
        ...outlet,
        todaySales,
        todayBillsCount: todayTxs.length,
        cashSales,
        upiSales,
        udhaarSales,
        totalRevenue,
        totalBillsCount: outletTxs.length,
        udhaarDueTotal,
        customersCount: outletCusts.length,
        assignedStaffCount: assignedStaff.length,
        assignedStaff,
        lastSyncAt,
        lastTransactionAt,
      };
    });
  }

  /**
   * Get detailed performance & records for a single outlet
   */
  public getOutletDetails(outletId: string) {
    const outlets = this.getEnrichedOutlets();
    const target = outlets.find((o) => o.id === outletId);
    if (!target) return null;

    const todayStr = new Date().toISOString().slice(0, 10);
    const outletTxs = this.db.transactions.filter(
      (t) =>
        t.outletId === outletId ||
        t.storeId === outletId ||
        (!t.outletId && !t.storeId && (target.isDefault || target.isPrimary))
    );
    const outletCusts = this.db.customers.filter(
      (c) =>
        c.outletId === outletId ||
        c.storeId === outletId ||
        (!c.outletId && !c.storeId && (target.isDefault || target.isPrimary))
    );
    const assignedStaff = this.db.staff.filter(
      (s) =>
        !s.assignedOutletIds ||
        s.assignedOutletIds.length === 0 ||
        s.assignedOutletIds.includes(outletId)
    );

    return {
      outlet: target,
      recentTransactions: outletTxs.slice(0, 50),
      customers: outletCusts,
      staff: assignedStaff,
      metrics: {
        totalRevenue: target.totalRevenue,
        totalBills: target.totalBillsCount,
        todaySales: target.todaySales,
        todayBills: target.todayBillsCount,
        cashSales: target.cashSales,
        upiSales: target.upiSales,
        udhaarSales: target.udhaarSales,
        udhaarDue: target.udhaarDueTotal,
      },
    };
  }

  /**
   * Save (create or update) outlet data from online admin client
   */
  public saveOutlet(outletData: any, actor = 'Master Admin'): CentralOutlet {
    const outlets = this.getOutlets();
    const id = (outletData.id || '').trim() || `store-${Date.now()}`;
    const cleanShopName = (outletData.shopName || '').trim();
    if (!cleanShopName) {
      throw new Error('Store / Outlet name is required');
    }

    const existingIndex = outlets.findIndex((o) => o.id === id);
    const nowIso = new Date().toISOString();

    const updatedOutlet: CentralOutlet = {
      id,
      shopName: cleanShopName,
      shortcutName: (outletData.shortcutName || cleanShopName.slice(0, 2).toUpperCase()).trim(),
      tagline: (outletData.tagline || 'Authentic Indian Spices & Daily Groceries').trim(),
      phone: (outletData.phone || '9876543210').trim(),
      upiId: (outletData.upiId || 'nayabmasale@upi').trim(),
      upiName: (outletData.upiName || cleanShopName).trim(),
      gstin: (outletData.gstin || '').trim(),
      address: (outletData.address || '').trim(),
      defaultTaxRate: Number(outletData.defaultTaxRate) || 0,
      isDefault: Boolean(outletData.isDefault),
      isPrimary: Boolean(outletData.isPrimary || (existingIndex >= 0 && outlets[existingIndex].isPrimary)),
      active: outletData.active !== false,
      createdAt: existingIndex >= 0 ? outlets[existingIndex].createdAt || nowIso : nowIso,
      updatedAt: nowIso,
    };

    // If marked default, unset isDefault on other outlets
    if (updatedOutlet.isDefault) {
      for (const o of outlets) {
        if (o.id !== id) o.isDefault = false;
      }
    }

    if (existingIndex >= 0) {
      outlets[existingIndex] = updatedOutlet;
      this.addAuditLog(
        'OUTLET_UPDATED',
        'settings',
        `Admin owner updated outlet "${cleanShopName}" (ID: ${id}) via online client-server architecture`,
        actor
      );
    } else {
      outlets.push(updatedOutlet);
      this.addAuditLog(
        'OUTLET_CREATED',
        'settings',
        `Admin owner created new branch outlet "${cleanShopName}" (ID: ${id}) via online client-server architecture`,
        actor
      );
    }

    // Sync primary settings if this is default outlet
    if (updatedOutlet.isDefault) {
      this.db.settings.shopName = updatedOutlet.shopName;
      this.db.settings.tagline = updatedOutlet.tagline;
      this.db.settings.phone = updatedOutlet.phone;
      this.db.settings.upiId = updatedOutlet.upiId;
      this.db.settings.upiName = updatedOutlet.upiName;
      this.db.settings.address = updatedOutlet.address;
      this.db.settings.defaultTaxRate = updatedOutlet.defaultTaxRate;
    }

    this.db.settings.stores = outlets;
    this.persist();
    return updatedOutlet;
  }

  /**
   * Delete outlet from online admin client
   */
  public deleteOutlet(outletId: string, actor = 'Master Admin'): { success: boolean; remainingOutlets: CentralOutlet[] } {
    const outlets = this.getOutlets();
    if (outlets.length <= 1) {
      throw new Error('Cannot delete the only store outlet. At least one outlet must remain active.');
    }
    const target = outlets.find((o) => o.id === outletId);
    if (!target) {
      throw new Error(`Outlet with ID ${outletId} not found.`);
    }
    if (target.isPrimary) {
      throw new Error('Cannot delete primary HQ outlet.');
    }

    this.db.settings.stores = outlets.filter((o) => o.id !== outletId);

    // If deleted outlet was default, make the first remaining outlet default
    if (target.isDefault && this.db.settings.stores.length > 0) {
      this.db.settings.stores[0].isDefault = true;
    }

    // If activeStoreId was the deleted outlet, switch to first remaining
    if (this.db.settings.activeStoreId === outletId && this.db.settings.stores.length > 0) {
      this.db.settings.activeStoreId = this.db.settings.stores[0].id;
    }

    this.addAuditLog(
      'OUTLET_DELETED',
      'settings',
      `Admin owner deleted outlet "${target.shopName}" (ID: ${outletId}) via online client-server architecture`,
      actor
    );

    this.persist();
    return { success: true, remainingOutlets: this.db.settings.stores };
  }

  /**
   * Switch active counter outlet POS
   */
  public switchActiveOutlet(outletId: string, actor = 'Counter User') {
    const outlets = this.getOutlets();
    const target = outlets.find((o) => o.id === outletId);
    if (!target) {
      throw new Error(`Outlet with ID ${outletId} not found.`);
    }
    this.db.settings.activeStoreId = outletId;
    this.addAuditLog(
      'OUTLET_SWITCHED',
      'settings',
      `Switched active counter POS to outlet "${target.shopName}" (ID: ${outletId})`,
      actor
    );
    this.persist();
    return { success: true, activeStoreId: outletId, outlet: target };
  }

  /**
   * Master Admin: Configure Firebase / Cloud sync parameters
   */
  public updateCloudSyncConfig(config: {
    cloudSyncMode?: 'central_api' | 'firebase_firestore' | 'hybrid';
    firebaseConfig?: {
      projectId?: string;
      apiKey?: string;
      firestoreDatabaseId?: string;
      autoSyncToCloud?: boolean;
    };
    actor?: string;
  }) {
    if (config.cloudSyncMode) {
      this.db.cloudSyncMode = config.cloudSyncMode;
    }
    if (config.firebaseConfig) {
      this.db.firebaseConfig = {
        ...this.db.firebaseConfig,
        ...config.firebaseConfig,
        connected: Boolean(config.firebaseConfig.projectId),
      };
    }
    this.addAuditLog(
      'CLOUD_CONFIG_UPDATED',
      'settings',
      `Cloud database config updated. Mode: ${this.db.cloudSyncMode}`,
      config.actor || 'Master Admin'
    );
    this.persist();
    return {
      cloudSyncMode: this.db.cloudSyncMode,
      firebaseConfig: this.db.firebaseConfig,
    };
  }

  /**
   * Master Admin: Restore Full Database Backup
   */
  public restoreDatabase(backupData: any, actor = 'Master Admin'): boolean {
    try {
      if (!backupData || typeof backupData !== 'object') return false;
      const data = backupData.data || backupData;

      if (Array.isArray(data.products)) this.db.products = data.products;
      if (Array.isArray(data.transactions)) this.db.transactions = data.transactions;
      if (Array.isArray(data.customers)) this.db.customers = data.customers;
      if (data.storeSettings) this.db.settings = { ...this.db.settings, ...data.storeSettings };
      if (Array.isArray(data.staff)) this.db.staff = data.staff;

      this.addAuditLog(
        'DATABASE_RESTORED',
        'database',
        `Restored database snapshot (${this.db.products.length} products, ${this.db.transactions.length} transactions)`,
        actor
      );
      this.persist();
      return true;
    } catch (err) {
      console.error('Failed to restore database:', err);
      return false;
    }
  }

  /**
   * Factory reset database
   */
  public resetToDefaults(actor = 'Master Admin'): CentralStoreDb {
    this.db = {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      cloudSyncMode: 'central_api',
      products: DEFAULT_PRODUCTS,
      transactions: [],
      customers: DEFAULT_CUSTOMERS,
      staff: DEFAULT_STAFF,
      settings: DEFAULT_SETTINGS,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'DATABASE_FACTORY_RESET',
          entity: 'database',
          details: 'Central database reset to initial factory state.',
          performedBy: actor,
        },
      ],
    };
    this.persist();
    return this.db;
  }
}

export const centralDb = new CentralDatabaseManager();
