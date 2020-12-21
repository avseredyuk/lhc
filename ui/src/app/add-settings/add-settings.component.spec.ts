import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSettingsComponent } from './add-settings.component';

describe('AddSettingsComponent', () => {
  let component: AddSettingsComponent;
  let fixture: ComponentFixture<AddSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
