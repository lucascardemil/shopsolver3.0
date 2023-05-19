import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Group } from 'src/app/models/Group';
import { GroupsService } from 'src/app/services/groups.service';
import { PhotosService } from 'src/app/services/photos.service';
import { Response } from 'src/app/models/Response';

@Component({
    selector: 'app-update-photos',
    templateUrl: './update-photos.component.html',
    styleUrls: ['./update-photos.component.css']
})
export class UpdatePhotosComponent implements OnInit {

    fileName = '';
    photo_edit: any = [];
    groups: Group[] = [];

    productForm = new FormGroup({
        image: new FormControl(),
        description: new FormControl(),
        price: new FormControl()
    });

    constructor(
        public dialogEditProduct: MatDialogRef<UpdatePhotosComponent>,
        @Inject(MAT_DIALOG_DATA) public id: any,
        private formBuilder: FormBuilder,
        private photoService: PhotosService,
        private notifier: NotifierService,
        private groupsService: GroupsService,) { }

    ngOnInit(): void {

        this.productForm = this.formBuilder.group({
            price: ['', [Validators.required]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            group: ['', [Validators.required]]
        })

        this.groupsService.getGroups().subscribe(res => (this.groups = res));
    }

    updateProduct(product: any) {

        var canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        if (product.price > 0 && product.description !== '' && product.group > 0 && this.photo_edit.length > 0) {

            let formData = new FormData();

            this.photo_edit.forEach((element: any) => {
                formData.append('image', element.file[0]);
            });

            formData.append('id', this.id);
            formData.append('price', product.price);
            formData.append('description', product.description);
            formData.append('group', product.group);


            this.photoService.savePhoto(formData).subscribe(data => {
                let dataResponse: Response = data;

                if (dataResponse.status === "ok") {
                    this.productForm.reset();
                    this.fileName = "";
                    this.photo_edit = [];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.classList.replace('d-block', 'd-none');
                    this.dialogEditProduct.close(dataResponse.result);
                }
            });

        }
    }
    
    onFileSelectedProduct(e: any) {
        var input_price = this.productForm.value.price;
        var input_description = this.productForm.value.description;

        var canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        var reader = new FileReader();
        var img = new Image();
        var file: File = e.target.files[0];
        var photo_edit: any = [];

        if (file) {
            this.fileName = file.name;
            reader.onload = (event: any) => {
                img = new Image();
                img.onload = () => {
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
                    var width_description = ctx.measureText(input_description).width;

                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fillRect(20, 20, width_price + width_description, 90);

                    ctx.fillStyle = 'white';
                    ctx.fillText('$' + input_price, 50, 50);
                    ctx.fillText(input_description, 50, 80);

                    var dataurl = canvas.toDataURL("image/png");
                    var blob = this.dataURItoBlob(dataurl);
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

    dataURItoBlob(dataURI: any) {
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

    onNoClick(): void {
        this.dialogEditProduct.close();
    }

}