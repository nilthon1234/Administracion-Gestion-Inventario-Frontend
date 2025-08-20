import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVitrinaBComponent } from './filter-vitrina-b.component';

describe('FilterVitrinaBComponent', () => {
  let component: FilterVitrinaBComponent;
  let fixture: ComponentFixture<FilterVitrinaBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterVitrinaBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterVitrinaBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
