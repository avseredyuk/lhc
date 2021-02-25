import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSeasonComponent } from './edit.component';

describe('EditSeasonComponent', () => {
  let component: EditSeasonComponent;
  let fixture: ComponentFixture<EditSeasonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
