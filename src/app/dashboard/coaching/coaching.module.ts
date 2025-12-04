import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingComponent } from './coaching.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CoachingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CoachingComponent } // ← route par défaut du module
    ])    
  ]
})
export class CoachingModule { }
