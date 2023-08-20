import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client, GetAllClients} from "../interfaces/client";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(pageIndex: number, pageSize: number) : Observable<GetAllClients> {
    return this.http.get<GetAllClients>(`client?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`client/${id}`)
  }

  updateOne(data: Client) {

  }

  findById(id: number) {

  }

  createOne(data: Client) {

  }
}
