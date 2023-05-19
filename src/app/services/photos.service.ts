import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response } from '../models/Response';
import { Photo } from '../models/Photo';


@Injectable({
    providedIn: 'root'
})
export class PhotosService {


    constructor(
        private http: HttpClient,
    ) { }


    getPhotos(): Observable<Photo[]> {
        return this.http.get<Photo[]>(`${environment.apiUrl}/photos`);
    }

    savePhoto(formData: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}/photos/register`, formData);
    }

    searchGroupPhotos(id: any): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/photos/${id}`);
    }

    deletePhoto(formData: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}/photos/delete`, formData);
    }


    updatePhotoGroup(formData: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}/photos/update`, formData);
    }

}
