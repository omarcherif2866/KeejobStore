import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormateurDetailsComponent } from './formateur-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FormateurDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FormateurDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class FormateurDetailsModule { }
