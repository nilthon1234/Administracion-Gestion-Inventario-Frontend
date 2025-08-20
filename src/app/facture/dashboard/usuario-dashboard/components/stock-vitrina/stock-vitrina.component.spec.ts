import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockVitrinaComponent } from './stock-vitrina.component';

describe('StockVitrinaComponent', () => {
  let component: StockVitrinaComponent;
  let fixture: ComponentFixture<StockVitrinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockVitrinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
