import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="overlay" *ngIf="isLoading$ | async">
    <mat-spinner></mat-spinner>
  </div>`,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent{
  isLoading$ = this.spinnerServices.isLoading$;

  constructor(private spinnerServices: SpinnerService) {}

}
