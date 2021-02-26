import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceNameHeaderComponent } from './device-name-header.component';

describe('DeviceNameHeaderComponent', () => {
  let component: DeviceNameHeaderComponent;
  let fixture: ComponentFixture<DeviceNameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceNameHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
