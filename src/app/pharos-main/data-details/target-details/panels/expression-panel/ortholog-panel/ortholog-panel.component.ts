import {Component, Input, OnInit} from '@angular/core';
import {Ortholog, OrthologSerializer} from '../../../../../../models/ortholog';
import {DynamicPanelComponent} from '../../../../../../tools/dynamic-panel/dynamic-panel.component';
import {takeUntil} from 'rxjs/operators';
import {PharosProperty} from '../../../../../../models/pharos-property';
import {PageData} from '../../../../../../models/page-data';

/**
 * displays orthologs available for a target
 */
@Component({
  selector: 'pharos-ortholog-panel',
  templateUrl: './ortholog-panel.component.html',
  styleUrls: ['./ortholog-panel.component.css']
})

export class OrthologPanelComponent extends DynamicPanelComponent implements OnInit {
  /**
   * list of table fields to display
   */
  fields: PharosProperty[] = [
    new PharosProperty({
    name: 'species',
    label: 'Species',
    sortable: true
  }),
    new PharosProperty( {
      name: 'source',
      label: 'Source',
      externalLink: true
    })
  ];

  /**
   * page data object to track pagination
   */
  orthoPageData: PageData;

  /**
   * serializer to create new ortholog objects
   */
  orthologSerializer: OrthologSerializer = new OrthologSerializer();

  /**
   * list of orthologs
   */
  orthologs: any[];

  /**
   * list of species
   */
  species: string[];

  /**
   * table data to display
   */
  tableArr: any[] = [];


  /**
   * no args constructor
   * calls super object
   */
  constructor() {
    super();
  }

  /**
   * subscribe to data changes and create orthologs
   */
  ngOnInit() {
    this._data
    // listen to data as long as term is undefined or null
    // Unsubscribe once term has value
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        if (Object.values(this.data).length > 0) {
          this.ngUnsubscribe.next();
          this.setterFunction();
        }
      });
  }

  /**
   * parse data to serialize orthologs
   */
  setterFunction(): void {
      this.orthologs = [];
      const temp: Ortholog[] = [];
      this.data.forEach(obj => {
        // create new object to get PharosProperty class properties
        const newObj: Ortholog = this.orthologSerializer.fromJson(obj);
        // get source label
        const labelProp: PharosProperty =
          new PharosProperty(newObj.properties.filter(prop => prop.label === 'Ortholog Species')[0]);
        const dataSources: PharosProperty[] =
          newObj.properties.filter(prop => prop.label === 'Data Source').map(lab => new PharosProperty(lab));
        this.orthologs.push({species: labelProp, source: dataSources});
      });
      this.orthoPageData = new PageData(
        {
          top: 10,
          skip: 0,
          total: this.orthologs.length,
          count: 10
        });
    this.tableArr = this.orthologs
      .slice(this.orthoPageData.skip, this.orthoPageData.top);
    }

  /**
   * page ortholog list
   * @param event
   */
  page(event) {
    this.tableArr = this.orthologs.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
