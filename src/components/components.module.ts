import { NgModule } from '@angular/core';
import { HelpComponent } from './help/help';
import { HelpFormComponent } from './help-form/help-form';
@NgModule({
	declarations: [HelpComponent,
    HelpFormComponent,
    HelpComponent],
	imports: [],
	exports: [HelpComponent,
    HelpFormComponent,
    HelpComponent]
})
export class ComponentsModule {}
