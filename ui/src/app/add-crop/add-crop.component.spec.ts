import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropComponent } from './add-crop.component';

describe('AddCropComponent', () => {
  let component: AddCropComponent;
  let fixture: ComponentFixture<AddCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
