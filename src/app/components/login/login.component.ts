import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/models/User';
import { Response } from 'src/app/models/Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    hide = true;

    userForm = new FormGroup({
        user: new FormControl(),
        password: new FormControl()
    }); 

    constructor(
        private formBuilder: FormBuilder,
        private userService: UsersService,
        private router: Router,
        private notifier: NotifierService
    ) { }

    ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            user: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(5)]],
        })
    }


    login(user: User) {
        
        this.userService.login(user).subscribe(data =>{
            let dataResponse:Response = data;
            if(dataResponse.status == "ok"){
                localStorage.setItem('token', dataResponse.result.token);
                this.router.navigateByUrl('generate-csv')
            }else{
                this.notifier.notify('error', dataResponse.result.message );
            }
        });
    }


}
