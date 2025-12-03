import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvDetailsComponent } from './cv-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CvDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CvDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CvDetailsModule { }
