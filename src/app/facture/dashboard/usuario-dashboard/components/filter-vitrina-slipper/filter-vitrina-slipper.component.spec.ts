import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVitrinaSlipperComponent } from './filter-vitrina-slipper.component';

describe('FilterVitrinaSlipperComponent', () => {
  let component: FilterVitrinaSlipperComponent;
  let fixture: ComponentFixture<FilterVitrinaSlipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterVitrinaSlipperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterVitrinaSlipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
