import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-generate-csv',
  templateUrl: './generate-csv.component.html',
  styleUrls: ['./generate-csv.component.css']
})
export class GenerateCsvComponent implements OnInit {

    constructor(public userService: UsersService, private router: Router,) { }

  ngOnInit(): void {
    if(this.userService.logIn()){
        this.router.navigate(['generate-csv']);
    }else{
        this.router.navigate(['login']);
    }
  }

}
