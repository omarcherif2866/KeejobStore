import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationComponent } from './evaluation.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EvaluationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EvaluationComponent } // ← route par défaut du module
    ])
  ]
})
export class EvaluationModule {}