///<reference path="../../../node_modules/@angular/router/src/router_module.d.ts"/>
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SearchComponent} from '../tools/search-component/search.component';
import {HighlightPipe} from '../tools/search-component/highlight.pipe';
import {MaterialModule} from '../../assets/material/material.module';
import {ScrollToTopComponent} from '../tools/scroll-to-top/scroll-to-top.component';
import {IdgLevelIndicatorComponent} from '../tools/idg-level-indicator/idg-level-indicator.component';
import {CustomContentDirective} from '../tools/custom-content.directive';
import {ComponentInjectorService} from '../pharos-services/component-injector.service';
import {TermDisplayComponent} from '../tools/term-display/term-display.component';
import {LinkListComponent} from '../tools/link-list/link-list.component';
import {ToiCardComponent} from '../pharos-dashboard/toi-card/toi-card.component';
import {BreadcrumbComponent} from '../tools/breadcrumb/breadcrumb.component';
import {NcatsHeaderComponent} from '../tools/ncats-header/ncats-header.component';
import {BarChartComponent} from '../tools/visualizations/bar-chart/bar-chart.component';
import {HelpPanelComponent} from '../tools/help-panel/help-panel.component';
import {PharosFooterComponent} from '../tools/pharos-footer/pharos-footer.component';
import {HelpPanelTriggerComponent} from '../tools/help-panel/components/help-panel-trigger/help-panel-trigger.component';
import {HelpDataService} from '../tools/help-panel/services/help-data.service';
import {HelpPanelOpenerService} from '../tools/help-panel/services/help-panel-opener.service';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {KnowledgeTableComponent} from '../tools/knowledge-table/knowledge-table.component';
import {ProteinStructureViewerComponent} from '../tools/protein-structure-viewer/protein-structure-viewer.component';
import {EquationRendererComponent} from '../tools/equation-renderer/equation-renderer.component';
import {ScrollspyDirective} from '../tools/sidenav-panel/directives/scrollspy.directive';
import {GenericTableModule} from '../tools/generic-table/generic-table.module';
import {HelpArticlesModule} from './help-articles.module';
import {LinkVisualComponent} from '../tools/visualizations/force-directed-graph/components/shared/link-visual/link-visual.component';
import {HoverableNodeDirective} from '../tools/visualizations/force-directed-graph/directives/hoverable-node.directive';
import {HoverableLinkDirective} from '../tools/visualizations/force-directed-graph/directives/hoverable-link.directive';
import {DraggableDirective} from '../tools/visualizations/force-directed-graph/directives/draggable.directive';
import {ClickableNodeDirective} from '../tools/visualizations/force-directed-graph/directives/clickable-node.directive';
import {ClickableLinkDirective} from '../tools/visualizations/force-directed-graph/directives/clickable-link.directive';
import {NodeVisualComponent} from '../tools/visualizations/force-directed-graph/components/shared/node-visual/node-visual.component';
import {ZoomableDirective} from '../tools/visualizations/force-directed-graph/directives/zoomable.directive';
import {ScatterPlotComponent} from '../tools/visualizations/scatter-plot/scatter-plot.component';
import {LineChartComponent} from '../tools/visualizations/line-chart/line-chart.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    NgxJsonViewerModule,
    HelpArticlesModule,
    GenericTableModule
  ],
  declarations: [
    NcatsHeaderComponent,
    PharosFooterComponent,
    BreadcrumbComponent,
    SearchComponent,
    HighlightPipe,
    ScrollToTopComponent,
    CustomContentDirective,
    IdgLevelIndicatorComponent,
    TermDisplayComponent,
    LineChartComponent,
    BarChartComponent,
    LinkListComponent,
    ToiCardComponent,
    HelpPanelComponent,
    HelpPanelTriggerComponent,
    KnowledgeTableComponent,
    ProteinStructureViewerComponent,
    ScrollspyDirective,
    ScatterPlotComponent,

    LinkVisualComponent,
    NodeVisualComponent,
    ClickableLinkDirective,
    ClickableNodeDirective,
    DraggableDirective,
    HoverableLinkDirective,
    HoverableNodeDirective,
    ZoomableDirective


  ],
  providers: [
    HelpDataService,
    HelpPanelOpenerService
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HelpArticlesModule,
    GenericTableModule,
    NcatsHeaderComponent,
    PharosFooterComponent,
    BreadcrumbComponent,
    SearchComponent,
    HighlightPipe,
    ScrollToTopComponent,
    CustomContentDirective,
    IdgLevelIndicatorComponent,
    TermDisplayComponent,
    LineChartComponent,
    BarChartComponent,
    LinkListComponent,
    ToiCardComponent,
    HelpPanelComponent,
    HelpPanelTriggerComponent,
    KnowledgeTableComponent,
    ProteinStructureViewerComponent,
    ScrollspyDirective,
    ScatterPlotComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ComponentInjectorService
      ]
    };
  }
}
