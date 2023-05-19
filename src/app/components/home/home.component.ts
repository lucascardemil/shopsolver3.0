import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public userService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
      this.userService.logout();
      this.router.navigate(['login']);
  }

}
