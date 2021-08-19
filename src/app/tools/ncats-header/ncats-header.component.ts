import {Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {slideInOutAnimation} from './header-animations';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {LoginModalComponent} from '../../auth/login-modal/login-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {PharosProfileService} from '../../auth/pharos-profile.service';
import {HeaderOptionsService} from '../../pharos-services/header-options.service';
import {SelectedFacetService} from '../../pharos-main/data-list/filter-panel/selected-facet.service';
import {PathResolverService} from '../../pharos-main/data-list/filter-panel/path-resolver.service';
import {Facet} from '../../models/facet';
import {LocalStorageService} from '../../pharos-services/local-storage.service';
import {isPlatformBrowser} from '@angular/common';
import {TourType, TourService} from '../../pharos-services/tour.service';


/**
 * Component that contains basic NCATS branded menu, also contains pharos options
 */
@Component({
  selector: 'app-ncats-header',
  templateUrl: './ncats-header.component.html',
  styleUrls: ['./ncats-header.component.scss'],
  animations: [slideInOutAnimation]
})
export class NcatsHeaderComponent implements OnInit {

  /**
   * sidenav instance for mobile navigation menu
   */
  @ViewChild('mobilesidenav', {static: true}) sidenav: MatSidenav;
  /**
   * show search bar
   */
  @Input() searchBar?: boolean;

  /**
   * profile object
   * todo: create type object and see if useer and profile can be merged
   */
  profile: any;

  /**
   * animation state changed by scrolling
   * @type {string}
   */
  @Input() animationState = 'out';

  /**
   * constructor initialization
   * @param dialog
   * @param route
   * @param headerOptionsService
   * @param profileService
   */
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private headerOptionsService: HeaderOptionsService,
    public tourService: TourService,
    private profileService: PharosProfileService,
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(PLATFORM_ID) private platformID: any
  ) {
  }

  /**
   * subscribe to profile and header options services
   */
  ngOnInit() {
    this.profileService.profile$.subscribe(profile => {
      this.profile = profile && profile.data() ? profile.data() : profile;
    });

    this.headerOptionsService.headerOptions$.subscribe(res => {
      Object.entries(res).forEach((prop) => this[prop[0]] = prop[1]);
    });
  }

  /**
   * sets active section in nav
   * @param path
   */
  isActive(path: string): boolean {
    if (this.route.snapshot.data && this.route.snapshot.data.path) {
      return path === this.route.snapshot.data.path;
    } else if (this.route.snapshot.url && this.route.snapshot.url.length > 0) {
      return path === this.route.snapshot.url[0].path;
    } else {
      return false;
    }
  }

  getRequiredPath(tutorial: string) {
    switch (tutorial) {
      case TourType.StructureSearchTour:
        return '/structure';
      case TourType.CustomTargetListTour:
        return '/targets';
    }
    return '/';
  }

  gotoTutorial(tutorial: string) {
    const path = this.tourService.getPage();
    const onListPage = ['diseases', 'ligands', 'targets'].includes(path[0]) && path.length === 1;
    if (tutorial === TourType.CustomTargetListTour) {
      const navigationExtras: NavigationExtras = {
        queryParamsHandling: (path[0] === 'targets' ? 'merge' : ''),
        queryParams: {
          tutorial
        },
      };
      this.router.navigate([this.getRequiredPath(tutorial)], navigationExtras);
      return;
    }
    else if (tutorial === TourType.StructureSearchTour) {
      const navigationExtras: NavigationExtras = {
        queryParamsHandling: '',
        queryParams: {
          tutorial
        },
      };
      this.router.navigate( [this.getRequiredPath(tutorial)], navigationExtras);
      return;
    }
    else if (tutorial === TourType.ListPagesTour || tutorial === TourType.UpsetChartTour) {
      const navigationExtras: NavigationExtras = {
        queryParamsHandling: (onListPage ? 'merge' : ''),
        queryParams: {
          tutorial
        },
      };
      this.router.navigate([onListPage ? path[0] : '/targets'], navigationExtras);
    }
    else if (tutorial === TourType.TargetExpressionTour || tutorial === TourType.ProteinStructureTour) {
      const navigationExtras: NavigationExtras = {
        queryParamsHandling: '',
        queryParams: {
          tutorial
        },
      };
      if (path[0] === 'targets' && path.length > 1) {
        this.router.navigate([path.join('/')], navigationExtras);
      } else {
        const defaultPath = tutorial === TourType.TargetExpressionTour ? '/targets/camk2a' : '/targets/drd2';
        this.router.navigate([defaultPath], navigationExtras);
      }
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParamsHandling: (onListPage ? 'merge' : ''),
        queryParams: {
          tutorial
        },
      };
      this.router.navigate(path, navigationExtras);
    }
  }

  /**
   * opens modal for user to sign in
   */
  openSignInModal() {
    this.dialog.open(LoginModalComponent, {
        height: '75vh',
        width: '66vw',
      }
    );
  }

  /**
   * Shows the jira issue collector dialog
   */
  submitFeedback(event) {
    event.preventDefault();
    const w = (window as any);
    // w.ATL_JQ_PAGE_PROPS.fieldValues = w.ATL_JQ_PAGE_PROPS.fieldValues || {};
    // w.ATL_JQ_PAGE_PROPS.fieldValues.description = 'something by default';
    w.showCollectorDialog();
  }

  tutorialComplete(tutorial: string) {
    return isPlatformBrowser(this.platformID) && this.localStorage.store.getItem(tutorial) === 'complete';
  }

  /**
   * sign out user
   */
  signOut(): void {
    this.profileService.logout();
  }
}
