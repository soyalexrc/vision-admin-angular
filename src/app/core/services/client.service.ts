import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client, CreateEditClientResponse, GetAllClients} from "../interfaces/client";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>('client');
  }

  getAllPaginated(
    pageIndex: number,
    pageSize: number,
    service_id: string,
    subService_id: string,
    dateFrom: string,
    dateTo: string,
    status: string,
    contactFrom: string,
    isPotentialInvestor: string,
  ) : Observable<GetAllClients> {
    return this.http.get<GetAllClients>(`client/getPreviews?pageIndex=${pageIndex}&pageSize=${pageSize}&service_id=${service_id}&subService_id=${subService_id}&dateFrom=${dateFrom}&dateTo=${dateTo}&requirementStatus=${status}&contactFrom=${contactFrom}&isPotentialInvestor=${isPotentialInvestor}`)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`client/${id}`)
  }

  updateOne(data: Client): Observable<CreateEditClientResponse> {
    return this.http.put<CreateEditClientResponse>(`client/${data.id}`, data)
  }

  getById(id: number | string): Observable<Client> {
    return this.http.get<Client>(`client/${id}`);
  }

  createOne(data: Client): Observable<CreateEditClientResponse> {
    return this.http.post<CreateEditClientResponse>('client', data);
  }

  changeStatus(status: string, id: number): Observable<DeleteResult> {
    return this.http.post<DeleteResult>('client/changeStatus', {status, id})
  }
}
