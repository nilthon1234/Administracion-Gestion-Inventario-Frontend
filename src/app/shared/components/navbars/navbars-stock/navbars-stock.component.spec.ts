import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsStockComponent } from './navbars-stock.component';

describe('NavbarsStockComponent', () => {
  let component: NavbarsStockComponent;
  let fixture: ComponentFixture<NavbarsStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
