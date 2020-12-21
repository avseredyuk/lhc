import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SensorReportsComponent } from './sensor-reports.component';

describe('SensorReportsComponent', () => {
  let component: SensorReportsComponent;
  let fixture: ComponentFixture<SensorReportsComponent>;

  beforeEach(waitForAsync(() => {
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
