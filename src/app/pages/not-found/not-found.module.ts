import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { NotFound } from './not-found.component'
import { ComponentsModule } from 'src/app/components/components.module'

const routes = [
  {
    path: '',
    component: NotFound,
  },
]

@NgModule({
  declarations: [NotFound],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [NotFound],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotFoundModule {}
