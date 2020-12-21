import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {PlantMaintenanceComponent} from "./plant-maintenance.component";

describe('PlantMaintenanceComponent', () => {
  let component: PlantMaintenanceComponent;
  let fixture: ComponentFixture<PlantMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
