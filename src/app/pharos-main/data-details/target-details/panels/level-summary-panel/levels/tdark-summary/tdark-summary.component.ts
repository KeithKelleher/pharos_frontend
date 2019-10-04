import {Component, Input, OnInit} from '@angular/core';
import {Target} from '../../../../../../../models/target';
import {DynamicPanelComponent} from '../../../../../../../tools/dynamic-panel/dynamic-panel.component';

/**
 * shows details about tdark targets
 */
@Component({
  selector: 'pharos-tdark-summary',
  templateUrl: './tdark-summary.component.html',
  styleUrls: ['./tdark-summary.component.scss']
})
export class TdarkSummaryComponent {
  /**
   * input target
   */
  @Input() target: Target;

  /**
   * additional data for tracking completion
   */
  @Input() data: any;

  @Input() apiSources: any[];
  /**
   * no args constructor
   */
  constructor() {
  }

  getTooltip(label: string): string {
    if (this.apiSources) {
      const tooltip = this.apiSources.filter(source => source.field === label);
      if (tooltip.length) {
        return tooltip[0].description;
      } else {
        return null;
      }
    }
  }
}
