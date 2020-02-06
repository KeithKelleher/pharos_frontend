import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {NavSectionsService} from './services/nav-sections.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {PanelOptions} from '../../pharos-main/pharos-main.component';
import {PharosPanel} from '../../../config/components-config';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Location} from '@angular/common';
import {DynamicPanelComponent} from '../dynamic-panel/dynamic-panel.component';
import {CustomContentDirective} from '../custom-content.directive';

/**
 * panel that lists available sections of the details page, with jump to section navigation
 */
@Component({
  selector: 'pharos-sidenav-panel',
  templateUrl: './sidenav-panel.component.html',
  styleUrls: ['./sidenav-panel.component.scss']
})
export class SidenavPanelComponent implements OnInit, AfterViewInit {
  @ViewChildren(CustomContentDirective) componentHost: CustomContentDirective;


  /**
   * close the filter panel
   * @type {EventEmitter<boolean>}
   */
  @Output() menuToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * page section currently in view
   */
  @Input() activeElement: string;

  /**
   * list of all available sections
   * @type {any[]}
   */
  @Input() sections: PharosPanel[] = [];

  /**
   * boolean to toggle mobile views and parameters
   * @type {boolean}
   */
  isSmallScreen = false;

  panelOptions: PanelOptions = {
    mode: 'side',
    class: 'filters-panel',
    opened: true,
    fixedInViewport: true,
    fixedTopGap: 120,
    role: 'directory'
    /* [mode]="isSmallScreen!==true ? 'side' : 'over'"
     [opened]="isSmallScreen !== true"*/
  };

  /**
   * get router to navigate
   * @param {Router} router
   * @param _route
   * @param breakpointObserver
   * @param shared
   * @param {NavSectionsService} navSectionsService
   */
  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    @Inject('AppComponentService') shared,
    private navSectionsService: NavSectionsService) {
  }

  /**
   * subscribe to available sections and set first one as active,
   * change active element on scroll change
   */
  ngOnInit() {
    console.log(this);
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');
    if (this.isSmallScreen) {
      this.panelOptions.opened = false;
      this.panelOptions.mode = 'over';
      this.toggleMenu();
    }
    this.navSectionsService.setSections(this._route.snapshot.data.components
      .filter(component => component.navHeader)
      .map(comp => comp.navHeader));


    this.navSectionsService.sections$.subscribe(res => {
      if (res && res.length) {
        this.sections = res;
        this.activeElement = this.sections[0].section.toString();
      }
    });
    this.navSectionsService.activeSection$.subscribe(res => {
      if (res) {
        this.activeElement = res;
      }
    });

    // this covers url change when navigation/click to go to section
    this._route.fragment.subscribe(fragment => {
      this.activeElement = fragment;
    });
  }

  /**
   * close the filter panel
   */
  toggleMenu() {
    this.menuToggle.emit();
  }

  /**
   * jump to section on click
   * @param fragment
   */
  public scroll(fragment: any): void {
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: 'merge',
      fragment
    };
    this.router.onSameUrlNavigation = 'ignore';
    console.log(this.router);
    this.router.navigate([], navigationExtras);
  }

  /**
   * check of section header is the active one
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }

  ngAfterViewInit() {
    console.log(this);
  }
}
