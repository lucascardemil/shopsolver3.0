import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { GenerateCsvComponent } from './components/generate-csv/generate-csv.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'add-file',
        component: AddFileComponent
    },
    {
        path: 'add-photo',
        component: AddPhotoComponent
    },
    {
        path: 'generate-csv',
        component: GenerateCsvComponent,
    },
    
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
