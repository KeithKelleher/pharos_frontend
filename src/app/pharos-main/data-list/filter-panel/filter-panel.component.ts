import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit,
  Output
} from '@angular/core';
import {Facet} from '../../../models/facet';
import {Subject} from 'rxjs';
import {PathResolverService} from '../../../pharos-services/path-resolver.service';
import {FacetRetrieverService} from './facet-retriever.service';
import {PharosConfig} from '../../../../config/pharos-config';
import {PharosProfileService} from '../../../auth/pharos-profile.service';
import {PanelOptions} from '../../pharos-main.component';

/**
 * panel that hold a facet table for selection
 */
@Component({
  selector: 'pharos-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FilterPanelComponent implements OnInit, OnDestroy {
  panelOptions: PanelOptions = {
    mode : 'side',
    class : 'filters-panel',
    opened: true,
    fixedInViewport: true,
    role: 'directory'
    /* [mode]="isSmallScreen!==true ? 'side' : 'over'"
     [opened]="isSmallScreen !== true"*/
  };

  /**
   * close the filter panel
   * @type {EventEmitter<boolean>}
   */
  @Output() closeClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * list of facets shown in the filter panel
   */
  facets: Facet[];

  /**
   * list of initial facets to display
   */
  filteredFacets: Facet[];

  /**
   * list of all facets to display
   */
  allFacets: Facet[];

  /**
   * show all facets boolean
   * @type {boolean}
   */
  fullWidth = false;

  /**
   * ngmodel of search value to filter facets when all are displayed
   */
  value: string;

  /**
   * boolean to track if facets are loading/shown
   * @type {boolean}
   */
  loading = false;


  /**
   * subject to unsubscribe on destroy
   * @type {Subject<any>}
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * set up services to get facets
   * @param {PathResolverService} pathResolverService
   * @param {ChangeDetectorRef} ref
   * @param profileService
   * @param {FacetRetrieverService} facetRetrieverService
   * @param {PharosConfig} pharosConfig
   */
  constructor(
              private pathResolverService: PathResolverService,
              private ref: ChangeDetectorRef,
              private profileService: PharosProfileService,
              private facetRetrieverService: FacetRetrieverService,
              private pharosConfig: PharosConfig) { }

  /**
   * set up subscriptions to get facets
    */
  ngOnInit() {
    this.loading = true;
    const flist = this.pharosConfig.getFacets(this.pathResolverService.getPath());
    this.facetRetrieverService.getAllFacets().subscribe(facets => {
      if (facets && facets.size) {
        this.filteredFacets = [];
        this.allFacets = Array.from(facets.values());
       flist.forEach(f => {
          const facet = facets.get(f.name);
          if (facet) {
            facet.label = f.label;
            facet.open = f.open;
            this.filteredFacets.push(facet);
          }
        });
        this.loading = false;
        this.facets = this.filteredFacets;

        this.ref.markForCheck();
      } else {
        this.closeMenu();
      }
    });
    this.loading = false;
  }

  /**
   * toggle the show all facets view
   * load all facets as needed
   */
  toggleFacets() {
    this.loading = true;
    this.fullWidth = !this.fullWidth;
    if (this.fullWidth) {
          this.facets = this.allFacets;
      this.loading = false;
    } else {
      this.facets = this.filteredFacets;
      this.loading = false;
    }
  }

  /**
   * search an filter facets
   * @param {string} term
   */
  search(term: string): void {
    this.facets = this.allFacets.filter(facet => {
      return JSON.stringify(facet).toLowerCase().includes(term.toLowerCase());
    });
  }

  /**
   * clear the all facets filter search
   */
  clear(): void {
    this.value = '';
    this.facets = this.allFacets;
  }

  /**
   * remove all selected facets
   */
  removeAll(): void {
    this.pathResolverService.removeAll();
  }


  /**
   * function to track facet object to avoid reloading if the facet doesn't change
   * @param {string} index
   * @param {Facet} item
   * @returns {Facet}
   */
  trackByFn(index: string, item: Facet) {
    return item;
  }

  /**
   * close the filter panel
   */
  closeMenu() {
    this.closeClick.emit();
  }

  /**
   * function to unsubscribe on destroy
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
