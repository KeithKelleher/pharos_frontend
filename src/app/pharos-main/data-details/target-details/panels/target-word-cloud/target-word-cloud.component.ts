import {ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Target} from "../../../../../models/target";
import {PharosApiService} from "../../../../../pharos-services/pharos-api.service";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DynamicPanelComponent} from "../../../../../tools/dynamic-panel/dynamic-panel.component";
import {DynamicServicesService} from "../../../../../pharos-services/dynamic-services.service";
import {takeUntil} from "rxjs/operators";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'pharos-target-word-cloud',
  templateUrl: './target-word-cloud.component.html',
  styleUrls: ['./target-word-cloud.component.scss']
})
export class TargetWordCloudComponent extends DynamicPanelComponent implements OnInit {
  @Input() target: Target;
  isVerySmallScreen = false;
  cloudData: any[] = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private pharosApiService: PharosApiService,
    @Inject(PLATFORM_ID) private platformID: any,
    private _route: ActivatedRoute,
    public dynamicServices: DynamicServicesService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    super(dynamicServices);
  }


  ngOnInit(): void {
    this.isVerySmallScreen = this.breakpointObserver.isMatched('(max-width: 768px)')
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 1059px)');
    this.router.events
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getWordsFromDatabase();
      }
    });
    this.getWordsFromDatabase();
  }

  getWordsFromDatabase() {
    this.loadingStart();
    if (isPlatformBrowser(this.platformID) && this.target.publicationCount >= 2) {
      const target = this._route.snapshot.paramMap.get('id');
      const variables = {name: target};
      const minFont = this.isVerySmallScreen ? 8 : 10;
      const maxFont = this.isVerySmallScreen ? 25 : this.isSmallScreen ? 40 : 60;
      this.pharosApiService.adHocQuery(this.pharosApiService.PubmedCloudQuery, variables).toPromise()
        .then(
          (res: any) => {
            const myRes = JSON.parse(JSON.stringify(res));
            const words = myRes.data.target.abstractWordCounts;
            if (words.length == 0) {
              this.loadingComplete();
              return;
            }
            const minVal = Math.min(...words.map(w => w.pValue));
            const maxVal = Math.max(...words.map(w => w.pValue));
            const maxLog = Math.log(maxVal);
            const minLog = Math.log(minVal);
            this.cloudData = words.map((wordObj) => {
              const logVal = Math.log(wordObj.pValue);
              return { text: wordObj.name, value: ((maxFont - minFont) * (logVal - minLog) / (maxLog - minLog)) + minFont};
            });
            this.loadingComplete();
            this.changeRef.markForCheck();
          });
    } else {
      this.loadingComplete();
    }

  }
}
