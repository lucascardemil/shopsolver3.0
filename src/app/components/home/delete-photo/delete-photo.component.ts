import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Response } from 'src/app/models/Response';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
    selector: 'app-delete-photo',
    templateUrl: './delete-photo.component.html',
    styleUrls: ['./delete-photo.component.css']
})
export class DeletePhotoComponent implements OnInit {

    constructor(public dialogDelete: MatDialogRef<DeletePhotoComponent>,
        private photosService: PhotosService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogDelete.close();
    }

    deletePhoto() {
        let result: any = []
        this.data.forEach((element: any) => {
            if (element.select == true) {
                result.push({
                    id: element.id,
                    image: element.image,
                    id_group: element.id_group
                })
            }
        });

        this.photosService.deletePhoto(result).subscribe(data => {
            let dataResponse: Response = data;
            if (dataResponse.status == "ok") {
                this.dialogDelete.close(dataResponse.result);
            }
        });
    }

}
