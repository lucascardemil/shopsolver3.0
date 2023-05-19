import { Component, Inject, OnInit } from '@angular/core';
import { PhotosService } from '../../../services/photos.service';
import { Photo } from 'src/app/models/Photo';
import { PageEvent } from '@angular/material/paginator';
import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/models/Group';
import { Response } from 'src/app/models/Response';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { UpdateGroupsComponent } from '../update-groups/update-groups.component';
import { DeletePhotoComponent } from '../delete-photo/delete-photo.component';
import { DOCUMENT } from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { UpdatePhotosComponent } from '../update-photos/update-photos.component';

@Component({
    selector: 'app-generate-csv',
    templateUrl: './generate-csv.component.html',
    styleUrls: ['./generate-csv.component.css']
})
export class GenerateCsvComponent implements OnInit {
    gridColumns = 3;

    title: string = "Productos de Suprapp";
    photos: Photo[] = [];
    groups: Group[] = [];
    arrayCsv: any[] = [];
    imageZIP: any[] = [];



    constructor(
        private photosService: PhotosService,
        private groupsService: GroupsService,
        private notifier: NotifierService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) document: any
    ) { }

    ngOnInit(): void {

        this.photosService.getPhotos().subscribe(data => {
            this.photos = data;
            this.loadCSV();
        })

        this.groupsService.getGroups().subscribe(res => (this.groups = res));


    }

    paginator(e: PageEvent) {
        this.page_size = e.pageSize
        this.page_number = e.pageIndex + 1
    }

    page_size: number = 10
    page_number: number = 1


    toggleGridColumns() {
        this.gridColumns = this.gridColumns === 3 ? 4 : 3;
    }

    searchGroupPhotos(id: any) {
        this.photosService.searchGroupPhotos(id).subscribe(data => {
            let dataResponse: Response = data;
            if (dataResponse.status == "ok") {
                this.photos = dataResponse.result.photos;
                this.title = dataResponse.result.group;
                this.loadCSV();
            } else {
                this.notifier.notify('error', dataResponse.result.message);
            }
        })
    }

    deletePhoto(id: any) {
        this.photosService.deletePhoto(id).subscribe(data => {
            let dataResponse: Response = data;
            if (dataResponse.status == "ok") {
                this.notifier.notify('success', dataResponse.result.message);
                this.photosService.getPhotos().subscribe(data => {
                    this.photos = data;
                })
            } else {
                this.notifier.notify('error', dataResponse.result.message);
            }
        });
    }

    onChangePhoto(event: any) {
        const id = event.source.value;
        const isChecked = event.checked;
        this.photos = this.photos.map((d) => {
            if (d.id == id) {
                d.select = isChecked;
                return d;
            }
            return d;
        });
    }

    openEditProductDialog(id: number): void {
        const dialogEditProduct = this.dialog.open(UpdatePhotosComponent, {
            data: id
        });

        dialogEditProduct.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.notifier.notify('success', result.message);
                this.searchGroupPhotos(result.product.id_group);
            }
        });
    }

    openEditDialog(): void {
        const dialogEdit = this.dialog.open(UpdateGroupsComponent, {
            data: this.photos,
            width: '400px',
        });

        dialogEdit.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (result.product.length > 0) {
                    this.notifier.notify('success', result.message);
                    result.product.forEach((element: any) => {
                        this.photos = this.photos.filter((item: any) => item.id_group === element.id_group);
                    })
                } else {
                    this.notifier.notify('error', 'Seleccione una foto!');
                }
            }
        });
    }

    openDeleteDialog(): void {
        const dialogDelete = this.dialog.open(DeletePhotoComponent, {
            data: this.photos
        });

        dialogDelete.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (result.product.length > 0) {
                    this.notifier.notify('success', result.message);
                    result.product.forEach((element: any) => {
                        this.photos = this.photos.filter((item: any) => item.id !== element.id);
                    })
                } else {
                    this.notifier.notify('error', 'Seleccione una foto!');
                }
            }
        });

    }

    allPhotos() {
        this.title = "Productos de Suprapp";
        this.photosService.getPhotos().subscribe(data => {
            this.photos = data;
            this.loadCSV();
        })
    }

    convertCSV() {
        let date = new Date();
        let fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        let hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        let filename = fecha + '_' + hora;

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            filename: filename,
            showLabels: true,
            showTitle: false,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };

        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(this.arrayCsv);
    }


    loadCSV() {
        this.arrayCsv = [];
        this.imageZIP = [];
        this.photos.forEach((element) => {
            if (element.id_group) {
                this.groupsService.getGroup(element.id_group).subscribe(res => {
                    this.arrayCsv.push({
                        precio: element.price,
                        cantidad: 1,
                        descripcion: element.description,
                        carpeta: res.name,
                        imagen: element.image
                    });

                    this.toDataURL(element.image,
                        async (dataUrl: any) => {
                            var blob = this.dataURItoBlob(dataUrl);
                            this.imageZIP.push({
                                carpeta: res.name,
                                image: blob
                            });
                        }
                    )
                });
            }
        })
    }

    createZIP() {
        var zip = new JSZip();
        var date = new Date();
        var fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        var hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var filename = fecha + '_' + hora;

        this.imageZIP.forEach((element, index) => {
            var fold = zip.folder(`${element.carpeta}`);
            fold?.file(`img_${index}.jpg`, element.image, { base64: true });
        })

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                fileSaver.saveAs(content, `${filename}.zip`);
            });
    }

    toDataURL(url: any, cb: any) {
        var xhr = new XMLHttpRequest();
        xhr.onload = async () => {
            cb(await this.convertToDataUrlPromise(xhr.response));
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    convertToDataUrlPromise(blob: any) {
        return new Promise((r) => {
            var reader = new FileReader();
            reader.onloadend = function () {
                r(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }

    dataURItoBlob(dataURI: any) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }
}


