import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Adviser, AdviserToCreate, CreationAdviserResponse, GetOneAdviserResponse, DeleteOneResponse} from "../interfaces/adviser";
@Injectable({
  providedIn: 'root'
})
export class AdviserService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<Adviser[]> {
    return this.http.get<Adviser[]>('owner/getAllData?type=Asesores%20Externos')
  }

  createOne(owner: AdviserToCreate): Observable<CreationAdviserResponse> {
    return this.http.post<CreationAdviserResponse>('owner/addNewData', owner)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`owner/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneAdviserResponse> {
    return this.http.get<GetOneAdviserResponse>(`owner/getById?id=${id}`)
  }

  update(data: Adviser): Observable<AdviserToCreate> {
    return this.http.put<AdviserToCreate>(`owner/updateData`, data);
  }
}
