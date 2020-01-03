import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {PlantMaintenancesComponent} from "./plant-maintenances.component";

describe('PlantMaintenancesComponent', () => {
  let component: PlantMaintenancesComponent;
  let fixture: ComponentFixture<PlantMaintenancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantMaintenancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
