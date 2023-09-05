import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {mergeMap, Observable} from "rxjs";
import {Ally, AllyToCreate, GetOneAllyResponse} from "../interfaces/ally";
import {
  CashFlowRegister,
  GenericResponse,
  TemporalTransactionResponse,
  TemporalTransactionToCreate,
  DeleteOneResponse,
  CashFlowTotals,
  GetAllCashFlowRegister,
  GetAllTemporalTransaction,
  CreateEditCashFlowResponse, CashFlowPerson,
} from "../interfaces/cashFlow";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(pageIndex: number, pageSize: number): Observable<GetAllCashFlowRegister> {
    return this.http.get<GetAllCashFlowRegister>(`cashflow?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  createOne(data: CashFlowRegister): Observable<CreateEditCashFlowResponse> {
    return this.http.post<CreateEditCashFlowResponse>('cashFlow', data)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`cashFlow/${id}`);
  }

  getById(id: string): Observable<CashFlowRegister> {
    return this.http.get<CashFlowRegister>(`cashFlow/${id}`)
  }

  update(data: CashFlowRegister): Observable<CreateEditCashFlowResponse> {
    return this.http.put<CreateEditCashFlowResponse>(`cashFlow/${data.id}`, data);
  }

  createTemporalTransaction(data: TemporalTransactionToCreate): Observable<TemporalTransactionResponse> {
    return this.http.post<TemporalTransactionResponse>('format/cashFlow/transferAmount', data)
  }

  getTemporalTransactions(pageIndex: number, pageSize: number): Observable<GetAllTemporalTransaction> {
    return this.http.get<GetAllTemporalTransaction>(`cashFlow/getTemporalTransactions?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  getTotals(): Observable<CashFlowTotals> {
    return this.http.get<CashFlowTotals>('cashFlow/getTotals')
  }

  getPeople(): Observable<CashFlowPerson[]> {
    return this.http.get<CashFlowPerson[]>('cashFlow/getPeople');
  }

  createPerson(data: {name: string}): Observable<CreateEditCashFlowResponse> {
    return this.http.post<CreateEditCashFlowResponse>('cashFlow/createPerson', data );
  }
}
