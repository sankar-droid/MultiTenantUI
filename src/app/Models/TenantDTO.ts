import { UserWebDTO } from './UserWebDTO';
import { WorkSpaceDTO } from './WorkSpaceDTO';

export interface TenantDTO {
     id:string;
     name:string;
     dataKey:string;
     email?:string;
}

export interface TenantDetailDto extends TenantDTO {
  users?: UserWebDTO[];
  workSpaces?: WorkSpaceDTO[];
}