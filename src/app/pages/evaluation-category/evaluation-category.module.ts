import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationCategoryComponent } from './evaluation-category.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EvaluationCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EvaluationCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class EvaluationCategoryModule { }
