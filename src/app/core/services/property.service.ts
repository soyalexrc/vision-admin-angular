import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {CreationOwnerResponse, GetOneOwnerResponse, Owner, OwnerToCreate} from "../interfaces/owner";
import {
  Attribute,
  CreationPropertyResponse,
  GetPropertyPreviewResponse,
  PropertyToCreate,
  PropertyType,
  DeleteOneResponse, PropertyStatus, UpdatePropertyHistoryPayload, PropertyStatusItem, PropertyReview
} from "../interfaces/property";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  currentPropertyReview: BehaviorSubject<PropertyReview | null> = new BehaviorSubject<PropertyReview | null>(null);

  constructor(
    private http: HttpClient
  ) {
  }

  storePropertyReview(property: PropertyReview) {
    this.currentPropertyReview.next(property);
  }

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

  getById(id: string): Observable<PropertyToCreate> {
    return this.http.get<PropertyToCreate>(`property/getById?id=${id}`)
  }

  update(data: PropertyToCreate): Observable<CreationPropertyResponse> {
    return this.http.put<CreationPropertyResponse>(`property/updateData`, data);
  }

  getAttributesByPropertyType(propertyType: PropertyType): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`attribute/getAllDataByPropertyType?propertyType=${propertyType}`)
  }

  updateStatus(id: string | number, status: PropertyStatus): Observable<DeleteOneResponse> {
    return this.http.put<DeleteOneResponse>(`property/updateStatus`, {id, property_status: status})
  }

  updateHistory(payload: UpdatePropertyHistoryPayload): Observable<any> {
    return this.http.post(`property/addHistoric`, payload)
  }

  getPropertyStatusHistory(id: string | number) : Observable<PropertyStatusItem[]> {
    return this.http.get<PropertyStatusItem[]>(`property/getHistoricByPropertyId?property_id=${id}`)
  }
}
