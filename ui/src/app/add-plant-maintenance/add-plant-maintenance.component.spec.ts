import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AddPlantMaintenanceComponent} from "./add-plant-maintenance.component";

describe('AddPlantMaintenanceComponent', () => {
  let component: AddPlantMaintenanceComponent;
  let fixture: ComponentFixture<AddPlantMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
