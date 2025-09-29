import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestDto } from '../Models/LinkDTO';

export abstract class BaseService<T> {
       constructor(protected http:HttpClient,protected apiPath:string){}

     private getHeaders(): HttpHeaders {
         const token = localStorage.getItem('token');
         return new HttpHeaders({
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
         });
     }

     getAll(pageIndex=0,pageSize=10,extraParams?:Record<string,string>):Observable<RestDto<T>>{
         let params=new HttpParams().set('pageIndex',pageIndex.toString()).set('pageSize',pageSize.toString());
         if(extraParams){
             Object.keys(extraParams).forEach(k=>params=params.set(k,extraParams[k]))
         }
         return this.http.get<RestDto<T>>(this.apiPath,{params, headers: this.getHeaders()})
     }

     getById(id:string):Observable<T>{
         return this.http.get<T>(`${this.apiPath}/${id}`, {headers: this.getHeaders()})
     }

     create(entity:Partial<T>):Observable<T>{
         return this.http.post<T>(this.apiPath, entity, {headers: this.getHeaders()})
     }

     update(id:string,entity:Partial<T>){
      return this.http.put<void>(`${this.apiPath}/${id}`, entity, {headers: this.getHeaders()})
     }
     delete(id:string){
         return this.http.delete<void>(`${this.apiPath}/${id}`, {headers: this.getHeaders()})
     }
}
