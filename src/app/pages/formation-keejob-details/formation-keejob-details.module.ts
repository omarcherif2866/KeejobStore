import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationKeejobDetailsComponent } from './formation-keejob-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FormationKeejobDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormationKeejobDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class FormationKeejobDetailsModule { }
