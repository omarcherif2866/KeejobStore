import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormateurComponent } from './formateur.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FormateurComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: FormateurComponent } // ← route par défaut du module
    ])    
  ]
})
export class FormateurModule { }
