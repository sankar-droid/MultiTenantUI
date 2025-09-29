export interface LinkDTO{
     href:string
     rel:string
     type:string
}


export interface RestDto<T>{
     data:T[]
     pageIndex?:number;
     pageSize?:number;
     recordCount?:number;
     links?:LinkDTO[]
}

