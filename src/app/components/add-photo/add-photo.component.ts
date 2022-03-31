import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import * as markerjs2 from "markerjs2";
import { Photo } from 'src/app/models/Photo';
import { Group } from 'src/app/models/Group';
import { Response } from 'src/app/models/Response';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.css']
})
export class AddPhotoComponent implements OnInit {


    fileName = '';
    src = '';
    photo_not_edit: any = [];
    photo_edit: any = [];

    groups: Group[] = [];

    photoForm = new FormGroup({
        price: new FormControl(),
        description: new FormControl(),
        group: new FormControl()
    }); 
    
    
    constructor(
        private formBuilder: FormBuilder,
        private photoService: PhotosService,
        private notifier: NotifierService,
        private groupsService: GroupsService,
        
    ) {    }
    
    
    ngOnInit(): void {

        this.photoForm = this.formBuilder.group({
            price: ['', [Validators.required]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            group: ['', [Validators.required]]
        })

        this.groupsService.getGroups().subscribe(res => (this.groups = res));

    }

    addPhoto(photo: any){
        if(!photo.price){
            this.notifier.notify('error', 'El precio es requerido');
        }if(!photo.description){
            this.notifier.notify('error', 'La descripcion es requerida');
        }if(!photo.group){
            this.notifier.notify('error', 'La carpeta es requerida');
        }if(!this.photo_not_edit.length && !this.photo_edit.length){
            this.notifier.notify('error', 'Seleccione un foto!');
        }else{
            let formData = new FormData();
            if(this.photo_not_edit.length){
                this.photo_not_edit.forEach((element: any) => {
                    formData.append('image', element);
                });
            }else{
                this.photo_edit.forEach((element: any) => {
                    formData.append('image', element); 
                });
            }

            formData.append('price', photo.price);
            formData.append('description', photo.description);
            formData.append('group', photo.group);

            this.photoService.savePhoto(formData).subscribe(data => {
                let dataResponse:Response = data;

                if(dataResponse.status == "ok"){
                    this.photoForm.reset();
                    this.src = "";
                    this.fileName = "";
                    this.photo_edit = [];
                    this.photo_not_edit = [];
                    this.notifier.notify('success', dataResponse.result.message);
                }else{
                    this.notifier.notify('error', dataResponse.result.message );
                }
            });   
        }
    }
    
    onFileSelected(event: any) {
        const file:File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            var reader = new FileReader();
            
    
            reader.onload = (event:any) => {
                this.src = event.target.result;
            }
            reader.readAsDataURL(file);
            this.photo_edit = [];
            this.photo_not_edit.push(file);
        }
    }


    showMarkerArea() {
        const sampleImage: any = document.getElementById("image");
        const markerArea = new markerjs2.MarkerArea(sampleImage);
        markerArea.addEventListener("render", (event) => {
            this.src = event.dataUrl;
            var blob = dataURItoBlob(this.src);
            var imagen = new File([blob], 'imagen.jpg', { type: 'image/jpg' });
            this.photo_not_edit = [];
            this.photo_edit.push(imagen);

        });
        markerArea.show();
    }
    
}


function dataURItoBlob(dataURI: any) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}
