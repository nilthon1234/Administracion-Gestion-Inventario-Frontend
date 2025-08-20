import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInfoSalesComponent } from './main-info-sales.component';

describe('MainInfoSalesComponent', () => {
  let component: MainInfoSalesComponent;
  let fixture: ComponentFixture<MainInfoSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainInfoSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainInfoSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
