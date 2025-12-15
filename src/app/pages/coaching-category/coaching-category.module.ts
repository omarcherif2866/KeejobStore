import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingCategoryComponent } from './coaching-category.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CoachingCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CoachingCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class CoachingCategoryModule { }
