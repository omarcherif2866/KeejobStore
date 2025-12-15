import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationKeejobCategoryComponent } from './formation-keejob-category.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FormationKeejobCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormationKeejobCategoryComponent } // ← route par défaut du module
    ])
  ]
})
export class FormationKeejobCategoryModule { }
