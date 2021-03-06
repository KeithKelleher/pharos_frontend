import {NgModule} from '@angular/core';
import {FilterPanelComponent} from '../pharos-main/data-list/filter-panel/filter-panel.component';
import {SelectedFacetListComponent} from '../pharos-main/data-list/selected-facet-list/selected-facet-list.component';
import {DataListVisualizationsComponent} from '../pharos-main/data-list/data-list-visualizations/data-list-visualizations.component';
import {SharedModule} from './shared.module';
import {DonutChartComponent} from '../tools/visualizations/donut-chart/donut-chart.component';
import {VisualizationOptionsComponent} from '../pharos-main/data-list/data-list-visualizations/visualization-options/visualization-options.component';
import {CommonToolsModule} from '../tools/common-tools.module';
import {RouterModule} from '@angular/router';
import {PharosLoadingSpinnerModule} from '../tools/pharos-loading-spinner/pharos-loading-spinner.module';
import {DataListResolver} from '../pharos-main/resolvers/data-list.resolver';
import {ComponentsResolver} from '../pharos-main/resolvers/components.resolver';
import {TOKENS} from '../../config/component-tokens';
import {FacetHistogramComponent} from '../pharos-main/data-list/filter-panel/facet-histogram/facet-histogram.component';
import {RangeSliderComponent} from '../tools/range-slider/range-slider.component';
import {FacetTableModule} from '../pharos-main/data-list/filter-panel/facet-table/facet-table.module';

@NgModule({
  imports: [
    SharedModule,
    CommonToolsModule,
    RouterModule,
    PharosLoadingSpinnerModule,
    FacetTableModule
  ],
  declarations: [
    DataListVisualizationsComponent,
    FilterPanelComponent,
    FacetHistogramComponent,
    SelectedFacetListComponent,
    DonutChartComponent,
    VisualizationOptionsComponent,
    RangeSliderComponent
  ],
  providers: [
    DataListResolver,
    ComponentsResolver,
    {provide: TOKENS.PHAROS_VISUALIZATION_COMPONENT, useValue: DataListVisualizationsComponent},
    {provide: TOKENS.PHAROS_SELECTED_FACET_LIST_COMPONENT, useValue: SelectedFacetListComponent},
    {provide: TOKENS.PHAROS_FACETS_COMPONENT, useValue: FilterPanelComponent}
  ],
  exports: [
    SharedModule,
    DataListVisualizationsComponent,
    FilterPanelComponent,
    FacetHistogramComponent,
    SelectedFacetListComponent,
    DonutChartComponent,
    VisualizationOptionsComponent,
    RangeSliderComponent
  ]
})
export class SharedListModule { }
