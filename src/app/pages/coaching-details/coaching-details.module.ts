import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingDetailsComponent } from './coaching-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CoachingDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CoachingDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class CoachingDetailsModule { }
