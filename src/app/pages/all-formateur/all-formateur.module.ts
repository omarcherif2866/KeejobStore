import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFormateurComponent } from './all-formateur.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllFormateurComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AllFormateurComponent } // ← route par défaut du module
    ])
  ]
})
export class AllFormateurModule { }
