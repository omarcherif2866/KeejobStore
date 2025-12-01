import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationPartnerComponent } from './formation-partner.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FormationPartnerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormationPartnerComponent } // ← route par défaut du module
    ])
  ]
})
export class FormationPartnerModule { }
