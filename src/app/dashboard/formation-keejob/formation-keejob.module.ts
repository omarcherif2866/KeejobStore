import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationKeejobComponent } from './formation-keejob.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SousFormationKeejobModule } from '../sous-formation-keejob/sous-formation-keejob.module';
import { LogicielModule } from '../logiciel/logiciel.module';



@NgModule({
  declarations: [
    FormationKeejobComponent
  ],
  imports: [
    CommonModule,
    SousFormationKeejobModule,
    LogicielModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: FormationKeejobComponent } // ← route par défaut du module
    ])    
  ]
})
export class FormationKeejobModule { }
