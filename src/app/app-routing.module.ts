import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { GenerateCsvComponent } from './components/generate-csv/generate-csv.component';
import { AuthGuard } from './auth.guard';

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
        component: AddFileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'add-photo',
        component: AddPhotoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'generate-csv',
        component: GenerateCsvComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        component: GenerateCsvComponent,
    },
    
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
