import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SousFormationKeejobComponent } from './sous-formation-keejob.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SousFormationKeejobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([

      { path: '', component: SousFormationKeejobComponent } // ← route par défaut du module
    ])
  ]
})
export class SousFormationKeejobModule { }
