import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { CongregationListComponent } from './congregation-list/congregation-list';
@NgModule({
    declarations: [CongregationListComponent],
    imports: [IonicModule],
    exports: [CongregationListComponent]
})
export class ComponentsModule {}
