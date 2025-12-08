import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCoachingComponent } from './all-coaching.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllCoachingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AllCoachingComponent } // ← route par défaut du module
    ])
  ]
})
export class AllCoachingModule { }
