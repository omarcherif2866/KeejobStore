import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvComponent } from './cv.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CvComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CvComponent } // ← route par défaut du module
    ])    
  ]
})
export class CvModule { }
