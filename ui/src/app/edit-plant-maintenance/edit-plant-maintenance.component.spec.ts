import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {EditPlantMaintenanceComponent} from "./edit-plant-maintenance.component";

describe('EditPlantMaintenanceComponent', () => {
  let component: EditPlantMaintenanceComponent;
  let fixture: ComponentFixture<EditPlantMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlantMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlantMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
