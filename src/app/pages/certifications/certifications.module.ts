import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationsComponent } from './certifications.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CertificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CertificationsComponent } // ← route par défaut du module
    ])
  ]
})
export class CertificationsModule { }
