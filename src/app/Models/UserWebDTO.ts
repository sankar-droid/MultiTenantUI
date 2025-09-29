import { TenantDTO } from "./TenantDTO";

export interface UserWebDTO{
    id:string;
    username:string;
    passwordHash:string;
    email:string;
    tenantId:string;
}

export interface UserWebDetail extends UserWebDTO{
     
    tenant?:TenantDTO;
    

}