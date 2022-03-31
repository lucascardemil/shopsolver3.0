import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { Response } from '../models/Response';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

    constructor(
        private http: HttpClient,
    ) {
    }

   
    getUsers(){
        return this.http.get(`$${environment.apiUrl}/users`);
    }

    getUser(id: string){
        return this.http.get(`$${environment.apiUrl}/users/${id}`);
    }

    deleteUser(id: string){
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    createUser(user: User){
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    // updateUser(id: string, user: User): Observable<User> { 
    //     return this.http.put(`${environment.apiUrl}/users/${id}`, user);
    // }

    login(user: User): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}/users/login`, user)
    }

    
    logIn(): boolean {
        return (localStorage.getItem('token') !== null);
    }

    logout(){
        localStorage.removeItem('token');
    }
}
