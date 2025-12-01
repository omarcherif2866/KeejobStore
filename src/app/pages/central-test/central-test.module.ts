import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralTestComponent } from './central-test.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CentralTestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CentralTestComponent } // ← route par défaut du module
    ])
  ]
})
export class CentralTestModule { }
