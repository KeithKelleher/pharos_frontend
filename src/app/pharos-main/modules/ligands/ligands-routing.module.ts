import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {CommonToolsModule} from "../../../tools/common-tools.module";
import {SharedListModule} from "../../../shared/shared-list.module";
import {SharedDetailsModule} from "../../../shared/shared-details.module";
import {LigandDetailsModule} from "../../data-details/ligand-details/ligand-details.module";
import {NgModule} from "@angular/core";
import {DataDetailsResolver} from "../../data-details/data-details.resolver";
import {DataDetailsComponent} from "../../data-details/data-details.component";


const pharosLigandsRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('../../../pharos-main/data-list/data-list.module').then(m => m.DataListModule)
  },
  {
    path: ':id',
    component: DataDetailsComponent,
    resolve: {
      pharosObject: DataDetailsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [
    SharedModule.forRoot(),
    CommonToolsModule,
    SharedListModule,
    SharedDetailsModule,
    LigandDetailsModule,
    RouterModule.forChild(pharosLigandsRoutes)

  ],
  exports: [
    RouterModule
  ],
  providers: [
  ],
  entryComponents: [
  ],
  declarations: [
  ]
})
export class LigandsRoutingModule {
}
