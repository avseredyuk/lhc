import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDeviceComponent } from './edit.component';

describe('EditDeviceComponent', () => {
  let component: EditDeviceComponent;
  let fixture: ComponentFixture<EditDeviceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
