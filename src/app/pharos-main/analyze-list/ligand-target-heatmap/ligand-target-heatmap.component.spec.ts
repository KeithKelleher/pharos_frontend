import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigandTargetHeatmapComponent } from './ligand-target-heatmap.component';

describe('TargetDiseaseHeatmapComponent', () => {
  let component: LigandTargetHeatmapComponent;
  let fixture: ComponentFixture<LigandTargetHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LigandTargetHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LigandTargetHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
