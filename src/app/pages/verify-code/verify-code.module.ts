import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyCodeComponent } from './verify-code.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [VerifyCodeComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: VerifyCodeComponent } // ← route par défaut du module
    ])
  ]
})
export class VerifyCodeModule { }
