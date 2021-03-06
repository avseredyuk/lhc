import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PumpActionsComponent } from './pump-actions.component';

describe('PumpActionsComponent', () => {
  let component: PumpActionsComponent;
  let fixture: ComponentFixture<PumpActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
