import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SousFormationKeejobDetailsComponent } from './sous-formation-keejob-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SousFormationKeejobDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SousFormationKeejobDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class SousFormationKeejobDetailsModule { }
