import { Component, OnInit} from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.css']
})
export class AddPhotoComponent implements OnInit {

    fileName = '';

    photoForm = new FormGroup({
        precio: new FormControl(),
        descripcion: new FormControl(),
        imagen: new FormControl()
    }); 
    
    
    constructor(
        private formBuilder: FormBuilder,
        private userService: UsersService,
        private router: Router,
        private notifier: NotifierService,
        
    ) { }
    
    
    ngOnInit(): void {

        this.photoForm = this.formBuilder.group({
            precio: ['', [Validators.required]],
            descripcion: ['', [Validators.required, Validators.minLength(5)]],
            imagen: ['', [Validators.required]],
        })


        if(this.userService.logIn()){
            this.router.navigate(['add-photo']);
        }else{
            this.router.navigate(['login']);
        }

        
        
        

    }

    addPhoto(): any {
        
        // this.userService.login(this.userForm.value)
        // .subscribe(
        //     result => {
        //         if(result.token){
        //             this.router.navigate(['dashboard']);
        //             localStorage.setItem('auth_token', result.token);
        //         }else{
        //             this.notifier.notify('error', result.message );
        //         }
        //     },
            
        // );
    }


    url = '';
    onFileSelected(event: any) {

        const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);

            // const upload$ = this.http.post("/api/thumbnail-upload", formData);

            // upload$.subscribe();
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                this.url = event.target?.result as string;

                var ctx = document.getElementById('c') as HTMLCanvasElement;
                var context = ctx.getContext('2d') as CanvasRenderingContext2D;

                var kitty = new Image();
                kitty.src = this.url;
                kitty.onload = function(){
                    context.drawImage(kitty, 0,0);
                    context.fillStyle = "white";
                    context.textBaseline = 'middle';
                    context.font = "50px 'Montserrat'";
                    // context.fillText(this.userForm.value, 50, 50);
                };

                // document.getElementById('name').addEventListener('keyup', function() {
                //     ctx.clearRect(0, 0, canvas.width, canvas.height);
                //     DrawOverlay(img);
                //     DrawText(); 
                //     text_title = this.value;
                //     ctx.fillText(text_title, 50, 50);
                //   });

                
            }
            
        }

        

    
    }


    
    
    


 

    

}
