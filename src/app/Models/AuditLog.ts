export interface AuditLog {
  id: string;
  timestamp: Date;
  userName: string;
  action: string;
  entityName: string;
  details: string;
  tenantId: string;
}