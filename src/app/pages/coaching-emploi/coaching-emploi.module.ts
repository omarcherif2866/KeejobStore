import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingEmploiComponent } from './coaching-emploi.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CoachingEmploiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CoachingEmploiComponent } // ← route par défaut du module
    ])
  ]
})
export class CoachingEmploiModule { }
