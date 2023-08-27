import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {
  Attribute,
  PropertyType,
  PropertyStatus,
  UpdatePropertyHistoryPayload,
  PropertyStatusItem,
  PropertyReview,
  GetAllPreviews,
  PropertyFull, CreateEditPropertyResponse
} from "../interfaces/property";
import {DeleteResult} from "../interfaces/generics";

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

  getPreviews(pageSize: number, pageIndex: number): Observable<GetAllPreviews> {
    return this.http.get<GetAllPreviews>(`property/previews?pageSize=${pageSize}&pageIndex=${pageIndex}`)
  }

  getAllPreviews(): Observable<GetAllPreviews> {
    return this.http.get<GetAllPreviews>(`property/previews`)
  }

  createOne(property: PropertyFull): Observable<CreateEditPropertyResponse> {
    return this.http.post<CreateEditPropertyResponse>('property', property)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`property/${id}`);
  }

  getById(id: string): Observable<PropertyFull> {
    return this.http.get<PropertyFull>(`property/${id}`)
  }

  update(data: PropertyFull): Observable<CreateEditPropertyResponse> {
    return this.http.put<CreateEditPropertyResponse>(`property/${data.id}`, data);
  }

  getAttributesByPropertyType(propertyType: PropertyType): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`attribute/getByPropertyType?propertyType=${propertyType}`)
  }

  updateStatus(id: string | number, status: PropertyStatus): Observable<CreateEditPropertyResponse> {
    return this.http.put<CreateEditPropertyResponse>(`property/updateStatus`, {id, property_status: status})
  }

  updateHistory(payload: UpdatePropertyHistoryPayload): Observable<any> {
    return this.http.post(`property/addHistoric`, payload)
  }

  getPropertyStatusHistory(id: string | number) : Observable<PropertyStatusItem[]> {
    return this.http.get<PropertyStatusItem[]>(`property/getHistoricByPropertyId?property_id=${id}`)
  }
}
