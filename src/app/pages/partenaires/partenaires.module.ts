import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartenairesComponent } from './partenaires.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PartenairesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PartenairesComponent } // ← route par défaut du module
    ])
  ]
})
export class PartenairesModule { }
