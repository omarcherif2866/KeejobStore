import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllcvComponent } from './all-cv.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllcvComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AllcvComponent } // ← route par défaut du module
    ])
  ]
})
export class AllCvModule { }
