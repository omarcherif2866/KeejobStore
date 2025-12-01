import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternationalComponent } from './international.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [InternationalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: InternationalComponent } // ← route par défaut du module
    ])
  ]
})
export class InternationalModule { }
