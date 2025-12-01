import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartenaireComponent } from './partenaire.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PartenaireComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: PartenaireComponent } // ← route par défaut du module
    ])    
  ]
})
export class PartenaireModule { }
