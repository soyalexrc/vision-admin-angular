import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  CreateEditOwnerResponse,
  CreationOwnerResponse,
  DeleteOneResponse,
  GetAllOwners,
  GetOneOwnerResponse,
  Owner,
  OwnerToCreate
} from "../interfaces/owner";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<GetAllOwners> {
    return this.http.get<GetAllOwners>(`owner`)
  }

  getAllPaginated(pageIndex: number, pageSize: number): Observable<GetAllOwners> {
    return this.http.get<GetAllOwners>(`owner/paginated?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  createOne(owner: Owner): Observable<CreateEditOwnerResponse> {
    return this.http.post<CreateEditOwnerResponse>('owner', owner)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`owner/${id}`);
  }

  getById(id: string): Observable<Owner> {
    return this.http.get<Owner>(`owner/${id}`)
  }

  update(data: Owner): Observable<CreateEditOwnerResponse> {
    return this.http.put<CreateEditOwnerResponse>(`owner/${data.id}`, data);
  }
}
