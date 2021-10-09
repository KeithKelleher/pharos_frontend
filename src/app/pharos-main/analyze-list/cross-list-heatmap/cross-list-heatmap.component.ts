import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PharosApiService} from '../../../pharos-services/pharos-api.service';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {HeatMapComponent, HeatMapData} from '../../../tools/visualizations/heat-map/heat-map.component';
import {DynamicPanelComponent} from '../../../tools/dynamic-panel/dynamic-panel.component';
import {DynamicServicesService} from '../../../pharos-services/dynamic-services.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'pharos-cross-list-heatmap',
  templateUrl: './cross-list-heatmap.component.html',
  styleUrls: ['./cross-list-heatmap.component.scss']
})
export class CrossListHeatmapComponent extends DynamicPanelComponent implements OnInit {

  constructor(private pharosApiService: PharosApiService,
              private _route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              public dynamicServices: DynamicServicesService) {
    super(dynamicServices);
  }

  @Input() model: string;
  @Input() crossModel: string;
  @Input() rowParseFunction: any;
  @Input() domain: number[] = [0, 5];
  @Input() measure = 'Confidence';
  @Input() title: string;
  showDetails = false;

  @ViewChild('heatMap', {static: true}) heatMapContainer: HeatMapComponent;
  results: any;

  @Output() detailsChanged = new EventEmitter<boolean>();

  activityMap: HeatMapData;

  selectedData;

  ngOnInit(): void {
    this._data
      // listen to data as long as term is undefined or null
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.initialize();
      });
    this.initialize();
  }

  initialize() {
    this.loading = true;
    this.pharosApiService.crossListquery(this._route.snapshot, this.model, this.crossModel).then((res: any) => {
      this.results = res.data.listCross;
      if (this.results && this.results.length > 0) {
        this.updateHeatmapData();
      }
    });
  }

  updateHeatmapData() {
    this.activityMap = new HeatMapData(this.model, this.crossModel, '', this.domain, this.measure);
    this.setMapData(this.activityMap, this.results);
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    this.heatMapContainer.redraw();
  }

  setMapData(heatMapData: HeatMapData, results: any[]) {
    results.forEach(row => {
      const parsedObj = this.rowParseFunction(row);
      heatMapData.addPoint(parsedObj.xVal, parsedObj.yVal, parsedObj.stringVal, parsedObj.numVal, parsedObj.data, parsedObj.metadata);
    });
  }

  heatmapClicked(data) {
    if (this.selectedData == data && this.showDetails) {
      this.showDetails = false;
      return;
    }
    this.showDetails = true;
    this.selectedData = data;
    this.pharosApiService.crossListDetailsQuery(this._route.snapshot, this.model, this.crossModel,
      data.metadata.x, data.metadata.y).then((res: any) => {
      this.detailsChanged.emit(res.data.listCrossDetails);
      this.changeDetectorRef.detectChanges();
    });
  }

}
