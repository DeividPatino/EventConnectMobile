import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { TabComponent } from './components/tab/tab.component';
import { HeaderComponent } from './components/header/header.component';
import { OrganizerDetailComponent } from './components/organizer-detail/organizer-detail.component';
import { EventPreviewModalComponent } from '../pages/homescreen/home/preview/event-preview-modal.component';
import { EventCardComponent } from './components/event-card/event-card.component';


const modules = [
  IonicModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

];

const components = [
  InputComponent,
  ButtonComponent,
  CardComponent,
  TabComponent,
  HeaderComponent
  ,
  EventPreviewModalComponent,
  EventCardComponent
  
];


@NgModule({ schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ...components
  
],
  imports: [
    CommonModule,
    ...modules,
    // OrganizerDetailComponent is standalone; import it here so consumers can use it via SharedModule
    OrganizerDetailComponent
  ],
  exports: [
  ...modules,
   ...components,
   OrganizerDetailComponent
  ],
 
})
export class SharedModule { }