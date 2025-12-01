import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualiteComponent } from './actualite.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ActualiteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ActualiteComponent } // ← route par défaut du module
    ])    
  ]
})
export class ActualiteModule { }
