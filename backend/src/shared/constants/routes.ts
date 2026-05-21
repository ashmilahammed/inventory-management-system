export const API_PREFIX = "/api";

export const Routes = {
  AUTH: {
    BASE: `${API_PREFIX}/auth`,
    LOGIN: "/login",
  },
  TEST: {
    BASE: `${API_PREFIX}/test`,
    PROTECTED: "/protected",
  },
  INVENTORY: {
    BASE: `${API_PREFIX}/inventory`,
    CREATE: "/",
    GET_ALL: "/",
    UPDATE: "/:id",
    DELETE: "/:id",
  },
  CUSTOMERS: {
    BASE: `${API_PREFIX}/customers`,
    CREATE: "/",
    GET_ALL: "/",
    UPDATE: "/:id",
    DELETE: "/:id",
  },
  SALES: {
    BASE: `${API_PREFIX}/sales`,
    RECORD: "/",
  },
  REPORTS: {
    BASE: `${API_PREFIX}/reports`,
    SALES: "/sales",
    ITEMS: "/items",
    LEDGER: "/ledger/:customerId",
    SALES_EXPORT: "/sales/export",
    ITEMS_EXPORT: "/items/export",
    LEDGER_EXPORT: "/ledger/:customerId/export",
    EMAIL: "/email",
  },
} as const;
