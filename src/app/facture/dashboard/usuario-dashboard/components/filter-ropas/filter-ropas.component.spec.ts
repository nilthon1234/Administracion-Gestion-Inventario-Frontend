import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRopasComponent } from './filter-ropas.component';

describe('FilterRopasComponent', () => {
  let component: FilterRopasComponent;
  let fixture: ComponentFixture<FilterRopasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterRopasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterRopasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
