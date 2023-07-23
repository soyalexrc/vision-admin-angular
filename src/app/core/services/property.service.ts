import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreationOwnerResponse, GetOneOwnerResponse, Owner, OwnerToCreate} from "../interfaces/owner";
import {
  Attribute,
  CreationPropertyResponse,
  GetPropertyPreviewResponse,
  PropertyToCreate,
  PropertyType,
  DeleteOneResponse
} from "../interfaces/property";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(
    private  http: HttpClient
  ) { }

  // TODO types de filtros

  getAllPreview(filters: any): Observable<GetPropertyPreviewResponse> {
    return this.http.post<GetPropertyPreviewResponse>('property/getallDataFilter', filters)
  }

  createOne(property: PropertyToCreate): Observable<CreationPropertyResponse> {
    return this.http.post<CreationPropertyResponse>('property/addNewData', property)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`property/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneOwnerResponse> {
    return this.http.get<GetOneOwnerResponse>(`property/getById?id=${id}`)
  }

  update(data: PropertyToCreate): Observable<CreationPropertyResponse> {
    return this.http.put<CreationPropertyResponse>(`property/updateData`, data);
  }

  getAttributesByPropertyType(propertyType: PropertyType) : Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`attribute/getAllDataByPropertyType?propertyType=${propertyType}`)
  }
}
