import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'proyecto_foto';
    
    
    constructor(public userService: UsersService, private router: Router,) {
        
    }
  
  
    logout() {
        this.userService.logout();
        this.router.navigate(['login']);
    }

    
}
