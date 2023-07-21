import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Ally, AllyToCreate, CreationAllyResponse, DeleteOneResponse, GetOneAllyResponse} from "../interfaces/ally";
import {GetOneOwnerResponse} from "../interfaces/owner";

@Injectable({
  providedIn: 'root'
})
export class AllyService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<Ally[]> {
    return this.http.get<Ally[]>('owner/getAllData?type=Aliados')
  }

  createOne(owner: AllyToCreate): Observable<CreationAllyResponse> {
    return this.http.post<CreationAllyResponse>('owner/addNewData', owner)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`owner/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneAllyResponse> {
    return this.http.get<GetOneAllyResponse>(`owner/getById?id=${id}`)
  }

  update(data: Ally): Observable<AllyToCreate> {
    return this.http.put<AllyToCreate>(`owner/updateData`, data);
  }
}
