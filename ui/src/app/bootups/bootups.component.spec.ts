import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootupsComponent } from './bootups.component';

describe('BootupsComponent', () => {
  let component: BootupsComponent;
  let fixture: ComponentFixture<BootupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
