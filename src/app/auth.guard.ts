import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsersService } from './services/users.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private userService: UsersService
    ) { }

    canActivate(): boolean | Promise<boolean> {
        var isAuthenticated = this.userService.getAuthStatus();
        if (isAuthenticated !== true) {
            this.userService.logout();
        }
        return isAuthenticated;
    }

}
