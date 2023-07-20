import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreationOwnerResponse, Owner, OwnerToCreate} from "../interfaces/owner";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(
    private  http: HttpClient
  ) { }

  getOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>('owner/getAllData?type=Propietarios')
  }

  createOne(owner: OwnerToCreate): Observable<CreationOwnerResponse> {
    return this.http.post<CreationOwnerResponse>('owner/addNewData', owner)
  }
}
