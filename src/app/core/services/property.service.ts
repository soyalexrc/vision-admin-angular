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
  PropertyFull,
  CreateEditPropertyResponse,
  PropertyStatusResponse,
  PropertyHistoryElement,
  PropertyAutomaticCodeResponse
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

  getPreviews(): Observable<GetAllPreviews> {
    return this.http.get<GetAllPreviews>(`property/previews`)
  }

  getPreviewsPaginated(
    pageSize: number,
    pageIndex: number,
    dateFrom: string,
    dateTo: string,
    status: string,
    code: string,
    propertyType: string,
    operationType: string,
  ): Observable<GetAllPreviews> {
    return this.http.get<GetAllPreviews>(`property/previews/paginated?pageSize=${pageSize}&pageIndex=${pageIndex}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&propertyType=${propertyType}&code=${code}&operationType=${operationType}`)
  }

  getPreviewsByUserId(pageSize: number, pageIndex: number, userId: number): Observable<GetAllPreviews> {
    return this.http.get<GetAllPreviews>(`property/previews/byUserId/${userId}?pageSize=${pageSize}&pageIndex=${pageIndex}`)
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

  updateStatus(data: PropertyHistoryElement): Observable<CreateEditPropertyResponse> {
    return this.http.post<CreateEditPropertyResponse>(`property/changeStatus`, data)
  }

  updateHistory(payload: UpdatePropertyHistoryPayload): Observable<any> {
    return this.http.post(`property/addHistoric`, payload)
  }

  getPropertyStatusHistory(id: string | number) : Observable<PropertyStatusResponse> {
    return this.http.get<PropertyStatusResponse>(`property/propertyStatus/${id}`)
  }

  getAutomaticPropertyCode(): Observable<PropertyAutomaticCodeResponse> {
    return this.http.get<PropertyAutomaticCodeResponse>('property/getAutomaticCode');
  }
}
