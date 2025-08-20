import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSlipperComponent } from './filter-slipper.component';

describe('FilterSlipperComponent', () => {
  let component: FilterSlipperComponent;
  let fixture: ComponentFixture<FilterSlipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSlipperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSlipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
