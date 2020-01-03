import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {EditPlantMaintenanceComponent} from "./edit-plant-maintenance.component";

describe('EditPlantMaintenanceComponent', () => {
  let component: EditPlantMaintenanceComponent;
  let fixture: ComponentFixture<EditPlantMaintenanceComponent>;

  beforeEach(async(() => {
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
