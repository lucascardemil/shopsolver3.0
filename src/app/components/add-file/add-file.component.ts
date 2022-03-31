import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Group } from 'src/app/models/Group';
import { GroupsService } from 'src/app/services/groups.service';
import { Response } from 'src/app/models/Response';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css']
})
export class AddFileComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = ['id', 'name', 'accion'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  groupForm = new FormGroup({
    name: new FormControl(),
  }); 

  constructor(
      private formBuilder: FormBuilder,
      private groupsService: GroupsService,
      private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    })

    this.groupsService.getGroups().subscribe(res => (this.dataSource.data = res));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  addGroup(group: Group) {
    if(!group.name){
      this.notifier.notify('error', 'El nombre es requerido');
    }else{ 
      this.groupsService.saveGroup(group).subscribe(data =>{
          let dataResponse:Response = data;
          if(dataResponse.status == "ok"){
            this.notifier.notify('success', dataResponse.result.message );
            this.groupForm.reset();
            this.groupsService.getGroups().subscribe(res => (this.dataSource.data = res));
          }else{
            this.notifier.notify('error', dataResponse.result.message );
          }
      });
    }
  }

  deleteGroup(id: any){
    this.groupsService.deleteGroup(id).subscribe(data =>{
      let dataResponse:Response = data;
      if(dataResponse.status == "ok"){
        this.notifier.notify('success', dataResponse.result.message );
        this.groupsService.getGroups().subscribe(res => (this.dataSource.data = res));
      }else{
        this.notifier.notify('error', dataResponse.result.message );
      }
    });

  }
}
