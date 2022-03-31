import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Group } from 'src/app/models/Group';
import { GroupsService } from 'src/app/services/groups.service';
import { Photo } from 'src/app/models/Photo';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-groups',
  templateUrl: './update-groups.component.html',
  styleUrls: ['./update-groups.component.css']
})
export class UpdateGroupsComponent implements OnInit {

  groups: Group[] = [];
  photos: Photo[] = [];
  
  groupForm = new FormGroup({
    group: new FormControl()
  }); 


  constructor(public dialogEdit: MatDialogRef<UpdateGroupsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService,
              private formBuilder: FormBuilder)
  { }

  

  ngOnInit(): void {
    

    this.groupForm = this.formBuilder.group({
      group: ['', [Validators.required]]
    })

    this.groupsService.getGroups().subscribe(res => (this.groups = res));
  }


  updateGroup(group: any){

    if(group.group){
      let formArray: any[] = [];

      this.data.forEach((element: any) => {
        if(element.select == true){
          formArray.push({
            id : element.id, 
            id_group: group.group
          })
        }
      });

      this.dialogEdit.close(formArray);
    }
  }

  onNoClick(): void {
    this.dialogEdit.close();
  }
}
