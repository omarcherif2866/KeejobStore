import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogicielComponent } from './logiciel.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LogicielComponent
  ],
  imports: [
    CommonModule,
    FormsModule  
  ],
    exports: [LogicielComponent] // ✅ Ajouter ceci

})
export class LogicielModule { }
