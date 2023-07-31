import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {mergeMap, Observable} from "rxjs";
import {Ally, AllyToCreate, GetOneAllyResponse} from "../interfaces/ally";
import {
  CashFlowRegister, GenericResponse, TemporalTransactionResponse,
  TemporalTransactionToCreate, DeleteOneResponse, CashFlowTotals,
} from "../interfaces/cashFlow";

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<CashFlowRegister[]> {
    return this.http.get<CashFlowRegister[]>('format/cashFlow/getAllData')
  }

  createOne(data: CashFlowRegister): Observable<GenericResponse> {
    return this.http.post<GenericResponse>('format/cashFlow/addNewData', data)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`format/cashFlow/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneAllyResponse> {
    return this.http.get<GetOneAllyResponse>(`format/cashFlow/getById?id=${id}`)
  }

  update(data: Ally): Observable<AllyToCreate> {
    return this.http.put<AllyToCreate>(`owner/updateData`, data);
  }

  createTemporalTransaction(data: TemporalTransactionToCreate): Observable<TemporalTransactionResponse> {
    return this.http.post<TemporalTransactionResponse>('format/cashFlow/transferAmount', data)
  }

  getTemporalTransactions(): Observable<CashFlowRegister[]> {
    return this.http.get<CashFlowRegister[]>('format/cashFlow/getAllByTemporalTransaction')
  }

  getTotals(): Observable<CashFlowTotals> {
    return this.http.get<CashFlowTotals>('format/cashFlow/getTotals')
  }
}
