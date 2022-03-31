import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from '../models/Group';
import { Response } from '../models/Response';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient,) { }

  getGroups(): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.apiUrl}/groups`);
  }

  getGroup(id: string): Observable<Group[]>{
    return this.http.get<Group[]>(`${environment.apiUrl}/groups/${id}`);
  }
  
  saveGroup(group: Group): Observable<Response>{
    return this.http.post<Response>(`${environment.apiUrl}/groups/register`, group);
  }

  deleteGroup(id: string): Observable<Response>{
    return this.http.delete<Response>(`${environment.apiUrl}/groups/${id}`);
  }
}
