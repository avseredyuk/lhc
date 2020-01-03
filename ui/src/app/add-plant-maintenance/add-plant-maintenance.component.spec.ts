import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AddPlantMaintenanceComponent} from "./add-plant-maintenance.component";

describe('AddPlantMaintenanceComponent', () => {
  let component: AddPlantMaintenanceComponent;
  let fixture: ComponentFixture<AddPlantMaintenanceComponent>;

  beforeEach(async(() => {
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
