import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

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
        return this.http.get(`${this.API_URI}/users`);
    }

    getUser(id: string){
        return this.http.get(`${this.API_URI}/users/${id}`);
    }

    deleteUser(id: string){
        return this.http.delete(`${this.API_URI}/users/${id}`);
    }

    createUser(user: User){
        return this.http.post(`${this.API_URI}/users`, user);
    }

    updateUser(id: string, user: User): Observable<User> { 
        return this.http.put(`${this.API_URI}/users/${id}`, user);
    }

    login(user: any): Observable<any> {
        return this.http.post(`${this.API_URI}/users/login`, user)
    }

    
    logIn(): boolean {
        return (localStorage.getItem('auth_token') !== null);
    }

}
