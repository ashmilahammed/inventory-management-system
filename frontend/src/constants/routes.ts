export const PageRoutes = {
  LOGIN: '/login',
  DASHBOARD: '/',
  INVENTORY: '/inventory',
  CUSTOMERS: '/customers',
  SALES: '/sales',
  REPORTS: '/reports',
} as const;

export const ApiRoutes = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string | number) => `/inventory/${id}`,
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string | number) => `/customers/${id}`,
  },
  SALES: {
    BASE: '/sales',
  },
  REPORTS: {
    SALES: '/reports/sales',
    ITEMS: '/reports/items',
    LEDGER: (customerId: string | number) => `/reports/ledger/${customerId}`,
    SALES_EXPORT: '/reports/sales/export',
    ITEMS_EXPORT: '/reports/items/export',
    LEDGER_EXPORT: (customerId: string | number) => `/reports/ledger/${customerId}/export`,
    EMAIL: '/reports/email',
  },
} as const;
