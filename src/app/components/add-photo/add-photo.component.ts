import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
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

    ) { }


    ngOnInit(): void {

        this.photoForm = this.formBuilder.group({
            price: ['', [Validators.required]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            group: ['', [Validators.required]]
        })

        this.groupsService.getGroups().subscribe(res => (this.groups = res));

    }

    addPhoto(photo: any) {
        var canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        if (!photo.price) {
            this.notifier.notify('error', 'El precio es requerido');
        } if (!photo.description) {
            this.notifier.notify('error', 'La descripcion es requerida');
        } if (!photo.group) {
            this.notifier.notify('error', 'La carpeta es requerida');
        } if (!this.photo_edit.length) {
            this.notifier.notify('error', 'Seleccione un foto!');
        } else {
            let formData = new FormData();

            this.photo_edit.forEach((element: any) => {
                formData.append('image', element.file[0]);
            });

            formData.append('price', photo.price);
            formData.append('description', photo.description);
            formData.append('group', photo.group);

            this.photoService.savePhoto(formData).subscribe(data => {
                let dataResponse: Response = data;

                if (dataResponse.status == "ok") {
                    this.photoForm.reset();
                    this.fileName = "";
                    this.photo_edit = [];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.classList.replace('d-block', 'd-none');
                    this.notifier.notify('success', dataResponse.result.message);
                } else {
                    this.notifier.notify('error', dataResponse.result.message);
                }
            });
        }
    }



    onFileSelected(e: any) {
        var input_price = this.photoForm.value.price;
        var input_description = this.photoForm.value.description;

        var canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        var reader = new FileReader();
        var img = new Image();
        var file: File = e.target.files[0];
        var photo_edit: any = [];


        if (file) {
            this.fileName = file.name;
            reader.onload = function (event: any) {
                img = new Image();
                img.onload = function () {

                    var MAX_WIDTH = 1000;
                    var MAX_HEIGHT = 1000;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    ctx.textBaseline = 'middle';
                    ctx.font = '20px arial';

                    var width_price = ctx.measureText(input_price).width;
                    var width_descripcion = ctx.measureText(input_description).width;

                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fillRect(20, 20, width_price + width_descripcion, 90);

                    ctx.fillStyle = 'white';
                    ctx.fillText('$' + input_price, 50, 50);
                    ctx.fillText(input_description, 50, 80);

                    var dataurl = canvas.toDataURL("image/png");
                    var blob = dataURItoBlob(dataurl);
                    var imagen = new File([blob], 'imagen.jpg', { type: 'image/jpg' });
                    photo_edit.push(imagen);
                };
                img.src = event.target.result;
                canvas.classList.replace('d-none', 'd-block');
            };
            reader.readAsDataURL(file);
            this.photo_edit.push({ file: photo_edit });
        }
    }


    // showMarkerArea() {
    //     const sampleImage: any = document.getElementById("image");
    //     const markerArea = new markerjs2.MarkerArea(sampleImage);
    //     markerArea.addEventListener("render", (event) => {
    //         this.src = event.dataUrl;
    //         var blob = dataURItoBlob(this.src);
    //         var imagen = new File([blob], 'imagen.jpg', { type: 'image/jpg' });
    //         this.photo_not_edit = [];
    //         this.photo_edit.push(imagen);

    //     });
    //     markerArea.show();
    // }





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












