import { Component, Inject, OnInit } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { Photo } from 'src/app/models/Photo';
import { PageEvent } from '@angular/material/paginator';
import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/models/Group';
import { Response } from 'src/app/models/Response';
import { NotifierService } from 'angular-notifier';
import {MatDialog} from '@angular/material/dialog';
import { UpdateGroupsComponent } from '../update-groups/update-groups.component';
import { DeletePhotoComponent } from '../delete-photo/delete-photo.component';
import { ConvertCSVService } from 'src/app/services/convert-csv.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-generate-csv',
  templateUrl: './generate-csv.component.html',
  styleUrls: ['./generate-csv.component.css']
})
export class GenerateCsvComponent implements OnInit {
  gridColumns = 3;

  title: string = "";
  photos: Photo[] = [];
  groups: Group[] = [];
  

  constructor(
    private photosService: PhotosService, 
    private groupsService: GroupsService,
    private notifier: NotifierService,
    public dialog: MatDialog,
    private convertCsv: ConvertCSVService,
    @Inject(DOCUMENT) document: any
  ) { }

  ngOnInit(): void {

    this.photosService.getPhotos().subscribe(data =>{
      this.photos = data;
    })

    this.groupsService.getGroups().subscribe(res => (this.groups = res));
  }

  paginator(e: PageEvent){
    this.page_size = e.pageSize
    this.page_number = e.pageIndex + 1
  }

  page_size: number = 10
  page_number: number = 1
  

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  searchGroupPhotos(id: any){
    this.photosService.searchGroupPhotos(id).subscribe(data =>{
      let dataResponse:Response = data;
      if(dataResponse.status == "ok"){
        this.photos = dataResponse.result.photos;
        this.title = dataResponse.result.group;
      }else{
        this.notifier.notify('error', dataResponse.result.message);
      }
    })
  }

  deletePhoto(id: any){
    this.photosService.deletePhoto(id).subscribe(data =>{
      let dataResponse:Response = data;
      if(dataResponse.status == "ok"){
        this.notifier.notify('success', dataResponse.result.message );
        this.photosService.getPhotos().subscribe(data =>{
          this.photos = data;
        })
      }else{
        this.notifier.notify('error', dataResponse.result.message );
      }
    });
  }

  onChangePhoto(event: any){
    const id = event.source.value;
    const isChecked = event.checked;
    this.photos = this.photos.map((d) =>{
      if(d.id == id){
        d.select = isChecked;
        return d;
      }
      return d;
    });
  }



  openEditDialog(): void {
    const dialogEdit = this.dialog.open(UpdateGroupsComponent, {
      width: '30%',
      data: this.photos
    });

    dialogEdit.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.length > 0){
          this.photosService.updatePhotoGroup(result).subscribe(data =>{
            let dataResponse:Response = data;
            if(dataResponse.status == "ok"){
              this.notifier.notify('success', dataResponse.result.message );
              // this.searchGroupPhotos(dataResponse.result.group);
              this.photosService.getPhotos().subscribe(data =>{
                this.photos = data;
              })
            }else{
              this.notifier.notify('error', dataResponse.result.message );
            }
          });
        }else{
          this.notifier.notify('error', 'Seleccione una foto!' );
        }
      }
    });
  }

  openDeleteDialog(): void {
    const dialogDelete = this.dialog.open(DeletePhotoComponent, {
      width: '20%',
      data: this.photos
    });

    dialogDelete.afterClosed().subscribe(result => {

      if(result != undefined){
        if(result.length > 0){
          this.photosService.deletePhoto(result).subscribe(data =>{
            let dataResponse:Response = data;
            if(dataResponse.status == "ok"){
              this.notifier.notify('success', dataResponse.result.message );
              // this.searchGroupPhotos(dataResponse.result.group);
              this.photosService.getPhotos().subscribe(data =>{
                this.photos = data;
              })
            }else{
              this.notifier.notify('error', dataResponse.result.message );
            }
          });
        }else{
          this.notifier.notify('error', 'Seleccione una foto!' );
        }
      }
    });

  }

  allPhotos(){
    this.photosService.getPhotos().subscribe(data =>{
      this.photos = data;
    })
  }

  convertCSV() {

    let arrayCsv: any[] = [];
    let date = new Date();
    let fecha = date.getDate() + '/' + ( date.getMonth() + 1 ) + '/' + date.getFullYear();
    let hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let filename = fecha + '_' + hora;


    this.photos.forEach(function (element) {
      arrayCsv.push({
        price: element.price,
        description: element.description,
        image: document.location.host + element.image
      })
    })
    this.convertCsv.downloadFile(arrayCsv, filename);
  } 

}


