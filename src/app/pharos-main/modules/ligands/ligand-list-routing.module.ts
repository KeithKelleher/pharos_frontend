import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DataListResolver} from '../../resolvers/data-list.resolver';
import {PharosMainComponent} from '../../pharos-main.component';
import {ComponentsResolver} from '../../resolvers/components.resolver';
import {Ligand, LigandSerializer} from '../../../models/ligand';

const routes: Routes = [
  {
    path: '',
    component: PharosMainComponent,
    data: {
      fragments: Ligand.ligandDetailsFragments,
      serializer: new LigandSerializer()
    },
    resolve: {
      components: ComponentsResolver,
      results: DataListResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [
    DataListResolver
  ],
  exports: [
    RouterModule
  ]
})

export class LigandListRoutingModule { }
