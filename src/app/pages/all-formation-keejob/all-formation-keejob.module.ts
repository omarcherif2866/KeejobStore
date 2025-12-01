import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFormationKeejobComponent } from './all-formation-keejob.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllFormationKeejobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AllFormationKeejobComponent } // ← route par défaut du module
    ])
  ]
})
export class AllFormationKeejobModule { }
