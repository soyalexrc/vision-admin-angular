import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {DeleteResult} from "../interfaces/generics";
import {UiService} from "./ui.service";


interface UploadFileResult {
  secureUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  currentImages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>( [])
  currentDocuments: BehaviorSubject<string[]> = new BehaviorSubject<string[]>( [])

  constructor(
    private  http: HttpClient,
    private uiService: UiService
  ) { }

  uploadPropertyImage(file: File, code: string): Observable<UploadFileResult> {
    const data = new FormData();

    data.append('file', file);
    return this.http.post<UploadFileResult>(`files/propertyImage/${code}`, data)
  }

  uploadPropertyFile(file: File, code: string): Observable<UploadFileResult> {
    const data = new FormData();

    data.append('file', file);
    return this.http.post<UploadFileResult>(`files/propertyFile/${code}`, data)
  }

  removePropertyImage(code: string, fileName: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/propertyImage/${code}/${fileName}`)
  }

  removePropertyFile(code: string, fileName: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/propertyFile/${code}/${fileName}`)
  }

  storeImage(image: string) {
    this.currentImages.next([...this.currentImages.value, image])
  }

  setReorderImages(images: string[]) {
    this.currentImages.next(images);
  }

  setReorderDocuments(documents: string[]) {
    this.currentDocuments.next(documents);
  }

  storeDocument(document: string) {
    this.currentDocuments.next([...this.currentDocuments.value, document])
  }

  deleteDocument(file: string) {
    const index = this.currentImages.value.findIndex((i) => i === file);
    const fileToDelete = this.currentImages.value[index];
    const fileCode = fileToDelete.split('properties')[1].split('/')[1];
    const fileName = fileToDelete.split('properties')[1].split('/')[3]
    this.removePropertyFile(fileCode, fileName).subscribe(res => {
      this.currentDocuments.value.splice(index, 1);
      this.uiService.createMessage('success', res.message)
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
    })
  }

  deleteImage(image: string) {
    const index = this.currentImages.value.findIndex((i) => i === image);
    const imageToDelete = this.currentImages.value[index];
    const imageCode = imageToDelete.split('properties')[1].split('/')[1];
    const fileName = imageToDelete.split('properties')[1].split('/')[3]
    this.removePropertyImage(imageCode, fileName).subscribe(res => {
      this.currentImages.value.splice(index, 1);
      this.uiService.createMessage('success', res.message)
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
    })
  }

  cleanFiles() {
    this.currentImages.next([]);
    this.currentDocuments.next([]);
  }

  deleteTemporalImages() {
    const data = JSON.parse(localStorage.getItem('property_create_temporal')!)
    data.images.forEach((image: string) => {
      const imageCode = image.split('properties')[1].split('/')[1];
      const fileName = image.split('properties')[1].split('/')[3]
      this.removePropertyImage(imageCode, fileName).subscribe(res => {
        this.uiService.createMessage('success', res.message)
      }, (error) => {
        this.uiService.createMessage('error', error.error.message)
      })
    })
  }

  deleteTemporalFiles() {
    const data = JSON.parse(localStorage.getItem('property_create_temporal')!)
    data.files.forEach((file: string) => {
      const fileCode = file.split('properties')[1].split('/')[1];
      const fileName = file.split('properties')[1].split('/')[3]
      this.removePropertyFile(fileCode, fileName).subscribe(res => {
        this.uiService.createMessage('success', res.message)
      }, (error) => {
        this.uiService.createMessage('error', error.error.message)
      })
    })
  }


}
