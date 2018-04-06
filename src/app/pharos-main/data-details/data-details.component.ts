import {Component, ComponentFactoryResolver, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ResponseParserService} from "../../pharos-services/response-parser.service";
import {Subject} from "rxjs/Subject";
import {TargetDetailsComponent} from "./target-details/target-details.component";
import {CustomContentDirective} from "../../tools/custom-content.directive";
import {EnvironmentVariablesService} from "../../pharos-services/environment-variables.service";
import {ActivatedRoute} from "@angular/router";
import {ComponentInjectorService} from "../../pharos-services/component-injector.service";

@Component({
  selector: 'pharos-data-details',
  templateUrl: './data-details.component.html',
  styleUrls: ['./data-details.component.css']
})
export class DataDetailsComponent implements OnInit, OnDestroy {
  data: any = {};
  path: string;
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(CustomContentDirective) componentHost: CustomContentDirective;


  constructor(
    private _route: ActivatedRoute,
    private componentInjectorService: ComponentInjectorService,
    private responseParserService: ResponseParserService,
  ) {
    this.path = this._route.snapshot.data.path;
  }

  ngOnInit() {
    this.responseParserService.detailsData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
       // this.data = res;
        const dynamicComponent = this.componentInjectorService.addDynamicComponent(this.componentHost, [this.path,'details']);
        dynamicComponent.instance.data = res;
      });
    console.log(this);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
