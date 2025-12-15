import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvCategoryComponent } from './cv-category.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CvCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CvCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class CvCategoryModule { }
