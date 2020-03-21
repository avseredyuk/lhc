import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorReportsComponent } from './sensor-reports.component';

describe('SensorReportsComponent', () => {
  let component: SensorReportsComponent;
  let fixture: ComponentFixture<SensorReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
