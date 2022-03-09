import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(public userService: UsersService, private router: Router,) { }
    
    ngOnInit(): void {
        if(this.userService.logIn()){
            this.router.navigate(['dashboard']);
        }else{
            this.router.navigate(['login']);
        }

    }

    logout() {
        localStorage.removeItem('auth_token');
        this.router.navigate(['login']);
    }
 
}
