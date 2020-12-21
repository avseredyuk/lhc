import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCropComponent } from './edit-crop.component';

describe('EditCropComponent', () => {
  let component: EditCropComponent;
  let fixture: ComponentFixture<EditCropComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
