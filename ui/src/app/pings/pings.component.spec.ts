import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PingsComponent } from './pings.component';

describe('PingsComponent', () => {
  let component: PingsComponent;
  let fixture: ComponentFixture<PingsComponent>;

  beforeEach(async(() => {
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
