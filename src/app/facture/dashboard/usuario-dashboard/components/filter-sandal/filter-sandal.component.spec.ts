import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSandalComponent } from './filter-sandal.component';

describe('FilterSandalComponent', () => {
  let component: FilterSandalComponent;
  let fixture: ComponentFixture<FilterSandalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSandalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSandalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
