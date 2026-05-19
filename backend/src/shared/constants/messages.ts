export const Messages = {
  SUCCESS: "Operation completed successfully",
  ERROR: "An error occurred",
  UNAUTHORIZED: "Unauthorized access",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Invalid request parameters",
  
  // Auth
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid credentials",
  
  // Inventory
  ITEM_CREATED: "Inventory item created successfully",
  ITEM_UPDATED: "Inventory item updated successfully",
  ITEM_DELETED: "Inventory item deleted successfully",
  ITEM_NOT_FOUND: "Inventory item not found",
  
  // Customers
  CUSTOMER_CREATED: "Customer registered successfully",
  CUSTOMER_UPDATED: "Customer details updated successfully",
  CUSTOMER_DELETED: "Customer removed successfully",
  CUSTOMER_NOT_FOUND: "Customer not found",
  
  // Sales
  SALE_RECORDED: "Sale transaction recorded successfully",
  SALE_FAILED: "Failed to record sale transaction",
  
  // Exports
  EXPORT_SUCCESS: "Report generated successfully",
} as const;
