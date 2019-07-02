import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {SlideInOutAnimation} from './header-animations';
import {ActivatedRoute, Route} from "@angular/router";
import {LoginModalComponent} from "../../auth/login-modal/login-modal.component";
import {MatDialog, MatSidenav} from "@angular/material";
import {PharosAuthService} from "../../auth/pharos-auth.service";
import * as firebase from 'firebase/app';
import {PharosProfileService} from "../../auth/pharos-profile.service";


/**
 * Component that contains basic NCATS branded menu, also contains pharos options
 */
@Component({
  selector: 'app-ncats-header',
  templateUrl: './ncats-header.component.html',
  styleUrls: ['./ncats-header.component.scss'],
  animations: [SlideInOutAnimation]
})
export class NcatsHeaderComponent implements OnInit {

  @ViewChild('mobilesidenav', {static: true}) sidenav: MatSidenav;
  /**
   * show search bar
   */
  @Input() searchBar?: boolean;

  user;
  profile;

  /**
   * animation state changed by scrolling
   * @type {string}
   */
  @Input() animationState = 'in';

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private profileService: PharosProfileService
    ) { }

  ngOnInit() {
    console.log(this);
    this.profileService.profile$.subscribe(profile => {
      this.profile = profile && profile.data() ? profile.data() : profile;
    });


  }


  isActive(path: string): boolean {
    if (this.route.snapshot.data && this.route.snapshot.data.path) {
      return path === this.route.snapshot.data.path;
    } else if(this.route.snapshot.url && this.route.snapshot.url.length > 0 ) {
      return path === this.route.snapshot.url[0].path;
    } else {
      return false;
    }
  }

  openSignInModal() {
    const dialogRef = this.dialog.open(LoginModalComponent, {
        height: '75vh',
        width: '66vw',
      }
    );
  }

  signOut(): void {
    this.profileService.logout();
  }
}
