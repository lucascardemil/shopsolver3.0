import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
    
    API_URI = 'http://localhost:3000/api';

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
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    updateUser(id: string, user: User): Observable<User> { 
        return this.http.put(`${environment.apiUrl}/users/${id}`, user);
    }

    login(user: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/login`, user)
    }

    
    logIn(): boolean {
        return (localStorage.getItem('auth_token') !== null);
    }

    logout(){
        localStorage.removeItem('auth_token');
    }
}
