import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms"
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from './services/users.service';
import { PhotosService } from './services/photos.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NotifierModule } from 'angular-notifier';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { GenerateCsvComponent } from './components/generate-csv/generate-csv.component';
import { AngularImgEditorModule } from  'angular-img-editor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSliderModule} from '@angular/material/slider';
import { PaginatePipe } from './pipes/paginate.pipe';
import { AddFileComponent } from './components/add-file/add-file.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { UpdateGroupsComponent } from './components/update-groups/update-groups.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SpinnerModule } from './components/spinner/spinner.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { DeletePhotoComponent } from './components/delete-photo/delete-photo.component';
import { DeleteGroupComponent } from './components/delete-group/delete-group.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddPhotoComponent,
    GenerateCsvComponent,
    PaginatePipe,
    AddFileComponent,
    UpdateGroupsComponent,
    DeletePhotoComponent,
    DeleteGroupComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NotifierModule,
    MatToolbarModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    AngularImgEditorModule,
    FlexLayoutModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    DragDropModule,
    MatMenuModule,
    MatGridListModule,
    NgxMatFileInputModule,
    MatTableModule,
    MatSliderModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatDialogModule,
    SpinnerModule
    
  ],
  providers: [
      UsersService,
      PhotosService,
      CookieService,
      {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
