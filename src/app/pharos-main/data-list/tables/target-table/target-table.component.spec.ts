import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TargetTableComponent} from './target-table.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {PharosApiService} from '../../../../pharos-services/pharos-api.service';
import {ActivatedRoute} from '@angular/router';
import {TargetCardComponent} from '../../cards/target-card/target-card.component';
import {IdgLevelIndicatorComponent} from '../../../../tools/idg-level-indicator/idg-level-indicator.component';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {FIRESTORESTUB} from '../../../../../../test/firestore-stub';
import {AngularFireModule} from '@angular/fire/compat';
import {COMMON_CONFIG} from '../../../../../../test/test-config';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {MOCKACTIVATEDROUTE} from '../../../../../../test/mock-activate-route';

describe('TargetTableComponent', () => {
  let component: TargetTableComponent;
  let fixture: ComponentFixture<TargetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        PharosApiService,
        AngularFireAuth,
        {provide: ActivatedRoute, useValue: MOCKACTIVATEDROUTE},
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ],
      declarations: [
        IdgLevelIndicatorComponent,
        TargetTableComponent,
        TargetCardComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
