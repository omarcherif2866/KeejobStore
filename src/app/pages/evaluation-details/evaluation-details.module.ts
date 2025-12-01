import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationDetailsComponent } from './evaluation-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EvaluationDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EvaluationDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class EvaluationDetailsModule { }
