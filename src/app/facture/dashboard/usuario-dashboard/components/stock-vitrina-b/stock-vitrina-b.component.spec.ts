import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockVitrinaBComponent } from './stock-vitrina-b.component';

describe('StockVitrinaBComponent', () => {
  let component: StockVitrinaBComponent;
  let fixture: ComponentFixture<StockVitrinaBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockVitrinaBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockVitrinaBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
