import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { HomePage } from './home-page.component'
import { ComponentsModule } from 'src/app/components/components.module'

const routes = [
  {
    path: '',
    component: HomePage,
  },
]

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
