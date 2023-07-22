import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Image} from "../interfaces/property";


@Injectable({
  providedIn: 'root'
})
export class FileService {

  currentImages: BehaviorSubject<Image[]> = new BehaviorSubject<Image[]>( [])
  currentDocuments: BehaviorSubject<Image[]> = new BehaviorSubject<Image[]>( [])

  constructor(
    private  http: HttpClient
  ) { }

  uploadFile(fileObj: Image): Observable<string> {
    return this.http.post<string>('file/upload', fileObj)
  }

  storeImage(image: Image) {
    this.currentImages.next([...this.currentImages.value, image])
  }

  storeDocument(document: Image) {
    this.currentDocuments.next([...this.currentDocuments.value, document])
  }

  deleteDocument(image: Image) {
    const index = this.currentImages.value.findIndex((i) => i === image);
    this.currentImages.value.splice(index, 1);
  }

  deleteImage(image: Image) {
    const index = this.currentImages.value.findIndex((i) => i === image);
    this.currentImages.value.splice(index, 1);
  }

  cleanFiles() {
    this.currentImages.next([]);
    this.currentDocuments.next([]);
  }


}
