import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PingsComponent } from './pings.component';

describe('PingsComponent', () => {
  let component: PingsComponent;
  let fixture: ComponentFixture<PingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
