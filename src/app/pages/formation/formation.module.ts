import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationComponent } from './formation.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FormationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormationComponent } // ← route par défaut du module
    ])
  ]
})
export class FormationModule { }
