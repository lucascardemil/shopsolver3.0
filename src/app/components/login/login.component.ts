import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    hide = true;

    userForm = new FormGroup({
        user: new FormControl(),
        password: new FormControl('20')
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

        if(this.userService.logIn()){
            this.router.navigate(['dashboard']);
        }
    }


    login(): any {
        
        this.userService.login(this.userForm.value)
        .subscribe(
            result => {
                if(result.token){
                    this.router.navigate(['dashboard']);
                    localStorage.setItem('auth_token', result.token);
                }else{
                    this.notifier.notify('error', result.message );
                }
            },
            
        );
    }


}
