import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MaterialModules } from '../../../../../shared/material.providers';

@Component({
  selector: 'app-inspeccion-info',
  imports: [MaterialModules],
  templateUrl: './inspeccion-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspeccionInfoComponent {
  data = input<any>();
}
