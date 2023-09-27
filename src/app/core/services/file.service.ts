import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {DeleteResult} from "../interfaces/generics";
import {UiService} from "./ui.service";


interface UploadFileResult {
  secureUrl: string;
}

export interface FilesResult {
  file: string;
  type: FileType | null;
}

export interface FolderResult {
  message: string;
}

export interface GetDeleteRequests {
  rows: DeleteRequest[],
  count: number,
}

export interface DeleteRequest {
  id: number;
  type: string;
  user: string;
  path: string;
  createdAt?: Date;
}

type FileType = 'dir' | 'file'

@Injectable({
  providedIn: 'root'
})
export class FileService {

  currentImages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>( [])
  currentImagesArray: BehaviorSubject<string[][]> = new BehaviorSubject<string[][]>( [[]])
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

  removeFile(path: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/deleteFolderOrFile/${path}`)
  }

  removePropertyFile(code: string, fileName: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/propertyFile/${code}/${fileName}`)
  }

  storeImage(image: string) {
    this.currentImages.next([...this.currentImages.value, image])
  }
  storeImageInArray(image: string, indexCollection: number) {
    const currentArray = this.currentImagesArray.value;

    console.log(currentArray);
    console.log(image, indexCollection);

    console.log(currentArray[indexCollection]);

    while (currentArray.length <= indexCollection) {
      currentArray.push([]); // Add empty rows if necessary
    }

    currentArray[indexCollection].push(image);


    this.currentImagesArray.next(currentArray)
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
    const index = this.currentDocuments.value.findIndex((i) => i === file);
    const fileToDelete = this.currentDocuments.value[index].split('genericStaticFileAsset/')[1];
    const pathToFile = fileToDelete.split('/').join('+')
    this.removeFile(pathToFile).subscribe(res => {
      this.currentDocuments.value.splice(index, 1);
      this.uiService.createMessage('success', res.message)
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
    })
  }

  deleteImage(image: string) {
    const index = this.currentImages.value.findIndex((i) => i === image);
    const imageToDelete = this.currentImages.value[index].split('genericStaticFileAsset/')[1];
    const pathToImage = imageToDelete.split('/').join('+')
    this.removeFile(pathToImage).subscribe(res => {
      this.currentImages.value.splice(index, 1);
      this.uiService.createMessage('success', res.message)
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
    })
  }

  deleteImageInArray(image: string, indexCollection: number,) {
    const currentArray = this.currentImagesArray.value[indexCollection];
    const indexImage = currentArray.findIndex((i) => i === image);
    const imageToDelete = this.currentImages.value[indexImage].split('genericStaticFileAsset/')[1];
    const pathToImage = imageToDelete.split('/').join('+')
    this.removeFile(pathToImage).subscribe(res => {
      this.currentImages.value.splice(indexImage, 1);
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
      this.deleteFolderOrFile(image.split('genericStaticFileAsset/')[1]).subscribe(res => {
        this.uiService.createMessage('success', res.message)
      }, (error) => {
        this.uiService.createMessage('error', error.error.message)
      })
    })
  }

  deleteTemporalFiles() {
    const data = JSON.parse(localStorage.getItem('property_create_temporal')!)
    data.files.forEach((file: string) => {
      this.deleteFolderOrFile(file.split('genericStaticFileAsset/')[1]).subscribe(res => {
        this.uiService.createMessage('success', res.message)
      }, (error) => {
        this.uiService.createMessage('error', error.error.message)
      })
    })
  }

  getElementsByPath(path: string): Observable<FilesResult[]> {
    const actualPath = !path ? 'root' : path;
    return this.http.get<FilesResult[]>(`files/getElementsByPath/${actualPath}`);
  }

  getGenericStaticFile(path: string): Observable<UploadFileResult> {
    return this.http.post<UploadFileResult>(`files/genericStaticFile`, {path});
  }

  uploadGenericStaticFile(file: File, path: string): Observable<UploadFileResult> {
    const data = new FormData();

    data.append('file', file);
    return this.http.post<UploadFileResult>(`files/uploadGenericStaticFile/${path}`, data);
  }

  createFolder(path: string): Observable<FolderResult> {
    return this.http.post<FolderResult>(`files/uploadFolder/${path}`, {});
  }

  changeName(path: string, newName: string, isFile: boolean): Observable<FolderResult> {
    return this.http.post<FolderResult>(`files/changeName/${path}`, {newName, isFile});
  }

  deleteFolderOrFile(path: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/deleteFolderOrFile/${path}`)
  }

  requestDelete(path: string, userId: string | number): Observable<DeleteResult> {
    return this.http.post<DeleteResult>(`files/requestDeleteFolderOrFile/${path}/${userId}`, {})
  }

  getDeleteFileRequests(): Observable<GetDeleteRequests> {
    return this.http.get<GetDeleteRequests>('files/requestDeleteFolderOrFile')
  }

  cancelDeleteRequest(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`files/cancelDeleteRequest/${id}` )
  }

  acceptDeleteRequest(id: number): Observable<DeleteResult> {
    return this.http.post<DeleteResult>(`files/acceptDeleteRequest/${id}`, {} )
  }

  moveFileOrFolder(pathFrom: string, pathTo: string): Observable<DeleteResult> {
    return this.http.post<DeleteResult>(`files/moveFileOrFolder`, {pathFrom, pathTo} )
  }

}
