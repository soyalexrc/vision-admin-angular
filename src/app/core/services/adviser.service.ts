import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  Adviser,
  AdviserToCreate,
  CreationAdviserResponse,
  GetOneAdviserResponse,
  DeleteOneResponse,
  GetAllAdvisers, CreateEditAdviserResponse
} from "../interfaces/adviser";
import {DeleteResult} from "../interfaces/generics";
@Injectable({
  providedIn: 'root'
})
export class AdviserService {

  constructor(
    private  http: HttpClient
  ) { }

  getAllPaginated(pageIndex: number, pageSize: number): Observable<GetAllAdvisers> {
    return this.http.get<GetAllAdvisers>(`external-adviser/paginated?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }
  getAll(): Observable<Adviser[]> {
    return this.http.get<Adviser[]>(`external-adviser`)
  }

  getAllWithRoleAdviser(): Observable<Adviser[]> {
    return this.http.get<Adviser[]>('')
  }

  createOne(owner: Adviser): Observable<CreateEditAdviserResponse> {
    return this.http.post<CreateEditAdviserResponse>('external-adviser', owner)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`external-adviser/${id}`);
  }

  getById(id: string): Observable<Adviser> {
    return this.http.get<Adviser>(`external-adviser/${id}`)
  }

  update(data: Adviser): Observable<CreateEditAdviserResponse> {
    return this.http.put<CreateEditAdviserResponse>(`external-adviser/${data.id}`, data);
  }
}
