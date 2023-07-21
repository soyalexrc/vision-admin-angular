import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreationOwnerResponse, DeleteOneResponse, GetOneOwnerResponse, Owner, OwnerToCreate} from "../interfaces/owner";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(
    private  http: HttpClient
  ) { }

  getOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>('owner/getAllData?type=Propietarios')
  }

  createOne(owner: OwnerToCreate): Observable<CreationOwnerResponse> {
    return this.http.post<CreationOwnerResponse>('owner/addNewData', owner)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`owner/deleteData?id=${id}`);
  }

  getOwnerById(id: string): Observable<GetOneOwnerResponse> {
    return this.http.get<GetOneOwnerResponse>(`owner/getById?id=${id}`)
  }

  updateOwnerById(data: Owner): Observable<OwnerToCreate> {
    return this.http.put<OwnerToCreate>(`owner/updateData`, data);
  }
}
