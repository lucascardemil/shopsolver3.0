import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AddFileComponent } from './components/home/add-file/add-file.component';
import { AddPhotoComponent } from './components/home/add-photo/add-photo.component';
import { GenerateCsvComponent } from './components/home/generate-csv/generate-csv.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent, children: [
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
                component: GenerateCsvComponent
            },
        ], canActivate: [AuthGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/home/generate-csv', pathMatch: 'full' },
    { path: '**', component: GenerateCsvComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
