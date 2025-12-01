import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvLettreComponent } from './cv-lettre.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CvLettreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CvLettreComponent } // ← route par défaut du module
    ])
  ]
})
export class CvLettreModule { }
