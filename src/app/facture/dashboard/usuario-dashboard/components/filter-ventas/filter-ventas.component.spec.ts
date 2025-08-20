import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVentasComponent } from './filter-ventas.component';

describe('FilterVentasComponent', () => {
  let component: FilterVentasComponent;
  let fixture: ComponentFixture<FilterVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
