import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  Ally,
  CreateEditAllyResponse, GetAllAllies,
} from "../interfaces/ally";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class AllyService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<Ally[]> {
    return this.http.get<Ally[]>(`ally`)
  }

  getAllPaginated(pageIndex: number, pageSize: number): Observable<GetAllAllies> {
    return this.http.get<GetAllAllies>(`ally/paginated?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  createOne(owner: Ally): Observable<CreateEditAllyResponse> {
    return this.http.post<CreateEditAllyResponse>('ally', owner)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`ally/${id}`);
  }

  getById(id: string): Observable<Ally> {
    return this.http.get<Ally>(`ally/${id}`)
  }

  update(data: Ally): Observable<CreateEditAllyResponse> {
    return this.http.put<CreateEditAllyResponse>(`ally/${data.id}`, data);
  }
}
