import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PharosPaginatorComponent} from './pharos-paginator.component';
import {SharedModule} from '../../shared/shared.module';
import {PharosApiService} from '../../pharos-services/pharos-api.service';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {AppRoutingModule} from '../../app-routing.module';
import {PathResolverService} from '../../pharos-services/path-resolver.service';
import {SuggestApiService} from '../search-component/suggest-api.service';
import {LoadingService} from '../../pharos-services/loading.service';
import {FacetRetrieverService} from '../../pharos-main/data-list/filter-panel/facet-retriever.service';
import {APP_BASE_HREF} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PharosPaginatorComponent', () => {
  let component: PharosPaginatorComponent;
  let fixture: ComponentFixture<PharosPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserTestingModule,
        AppRoutingModule,
        SharedModule
      ],
      providers: [
        PathResolverService,
        PharosApiService,
        LoadingService,
        FacetRetrieverService,
        SuggestApiService,
        {provide: APP_BASE_HREF, useValue: '/targets' }
      ],
      declarations: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharosPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
