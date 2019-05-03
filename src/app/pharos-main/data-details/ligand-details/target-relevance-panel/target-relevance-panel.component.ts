import { Component, OnInit } from '@angular/core';
import {DynamicPanelComponent} from '../../../../tools/dynamic-panel/dynamic-panel.component';
import {PharosProperty} from '../../../../models/pharos-property';
import {DynamicTablePanelComponent} from '../../../../tools/dynamic-table-panel/dynamic-table-panel.component';

@Component({
  selector: 'pharos-target-relevance-panel',
  templateUrl: './target-relevance-panel.component.html',
  styleUrls: ['./target-relevance-panel.component.css']
})

export class TargetRelevancePanelComponent extends DynamicTablePanelComponent implements OnInit {
  fields: PharosProperty[] = [
    new PharosProperty( {
      name: 'target',
      label: 'IDG Target',
      sortable: true,
      internalLink: true
    }),
    new PharosProperty( {
      name: 'developmentLevel',
      label: 'IDG Development Level',
      sortable: true,
      externalLink: true
    }),
    new PharosProperty({
      name: 'targetFamily',
      label: 'Target Family',
      sortable: true
    }),
    new PharosProperty( {
      name: 'activity',
      label: 'Ligand Activity',
      sortable: true,
      externalLink: true
    }),
    new PharosProperty( {
      name: 'developmentLevelValue',
      label: 'Activity Value',
      sortable: true,
      externalLink: true
    })
    ];

    tableArr: any[] = [];


  constructor() {
    super();
  }

  ngOnInit() {
    this._data
    // listen to data as long as term is undefined or null
    // Unsubscribe once term has value
      .pipe(
        // todo: this unsubscribe doesn't seem to work
        //    takeWhile(() => !this.data['references'])
      )
      .subscribe(x => {
        if (this.data.targetRelevance && this.data.targetRelevance.length > 0) {
          this.tableArr = [];
          this.data.targetRelevance.forEach(target => {
            const data = {
              target: new PharosProperty(target.properties.filter(prop => prop.label === 'IDG Target')[0]),
              developmentLevel: new PharosProperty(target.properties.filter(prop => prop.label === 'IDG Development Level')[0]),
              targetFamily: new PharosProperty(target.properties.filter(prop => prop.label === 'IDG Target Family')[0]),
              activity: new PharosProperty(target.properties
                .filter(prop => prop.label === 'Ligand Activity' || prop.label === 'Pharmalogical Action')[0])
            };
            data['developmentLevelValue'] = new PharosProperty(
              target.properties.filter(prop => prop.label === data.activity.term)[0] ?
                target.properties.filter(prop => prop.label === data.activity.term)[0] :
                data.activity
            );
            this.tableArr.push(data);
          });
        }
      });

  }
}
