import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreFormationComponent } from './centre-formation.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CentreFormationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CentreFormationComponent } // ← route par défaut du module
    ])
  ]
})
export class CentreFormationModule { }
