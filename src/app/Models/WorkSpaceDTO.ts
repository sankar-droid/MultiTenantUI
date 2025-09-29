import { TenantDTO } from "./TenantDTO";
import { FileItemDetailDto } from "./FileItemDTO"
export interface WorkSpaceDTO{
    id:string;
    name:string;
    tenantId:string;
    files?: FileItemDetailDto[]; // To hold files for each workspace
}

export interface WorkSpaceDetailDto extends WorkSpaceDTO {
    tenant?:TenantDTO;
    // files property is now on the base DTO
}