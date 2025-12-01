import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SousFormationKeejobComponent } from './sous-formation-keejob.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SousFormationKeejobComponent
  ],
  imports: [
    CommonModule,
    FormsModule  
  ],
    exports: [SousFormationKeejobComponent] // ✅ Ajouter ceci

})
export class SousFormationKeejobModule { }
