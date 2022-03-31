import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-photo',
  templateUrl: './delete-photo.component.html',
  styleUrls: ['./delete-photo.component.css']
})
export class DeletePhotoComponent implements OnInit {

  constructor(public dialogDelete: MatDialogRef<DeletePhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
{ }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogDelete.close();
  }

  deletePhoto(){
    let formArray: any[] = [];

      this.data.forEach((element: any) => {
        if(element.select == true){
          formArray.push({
            id : element.id,
            image: element.image
          })
        }
      });

      this.dialogDelete.close(formArray);
  }

}
