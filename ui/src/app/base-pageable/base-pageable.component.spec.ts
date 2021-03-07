import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePageableComponent } from './base-pageable.component';

describe('BasePageableComponent', () => {
  let component: BasePageableComponent;
  let fixture: ComponentFixture<BasePageableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasePageableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePageableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
