import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DynamicPanelComponent} from '../../../../../tools/dynamic-panel/dynamic-panel.component';
import {MatDialog} from '@angular/material';
import { takeUntil} from 'rxjs/operators';
import {RadarChartViewerComponent} from '../../../../../tools/radar-chart-viewer/radar-chart-viewer.component';
import {Target} from '../../../../../models/target';
import {NavSectionsService} from '../../../../../tools/sidenav-panel/services/nav-sections.service';



@Component({
  selector: 'pharos-summary-panel',
  templateUrl: './summary-panel.component.html',
  styleUrls: ['./summary-panel.component.scss']
})
export class SummaryPanelComponent extends DynamicPanelComponent implements OnInit, OnDestroy {
  @Input() target: Target;

  constructor(
    public dialog: MatDialog,
    private navSectionsService: NavSectionsService
  ) {
    super();
  }

ngOnInit() {
  this._data
  // listen to data as long as term is undefined or null
  // Unsubscribe once term has value
    .pipe(
      // todo: this unsubscribe doesn't seem to work
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(x => {
      if (Object.values(this.data).length > 0) {
        this.ngUnsubscribe.next();
      }
    });
}

openModal(): void {
  const dialogRef = this.dialog.open(RadarChartViewerComponent, {
    height: '90vh',
    width: '85vw',
    data: { data: this.data.knowledge,
            id: this.data.knowledge[0].className,
      target: this.target,
      size: 'large'}
  });
}

active(fragment: string) {
    this.navSectionsService.setActiveSection(fragment);
}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
