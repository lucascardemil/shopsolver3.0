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
export class SpinnerComponent implements AfterViewInit {
    isLoading$ = this.spinnerServices.isLoading$;

    constructor(
        private spinnerServices: SpinnerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngAfterViewInit(): void {
        this.isLoading$.subscribe(() => {
            this.cdr.detectChanges();
        });
    }
}
