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

  getAll(pageIndex: number, pageSize: number): Observable<GetAllAdvisers> {
    return this.http.get<GetAllAdvisers>(`external-adviser?pageIndex=${pageIndex}&pageSize=${pageSize}`)
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
