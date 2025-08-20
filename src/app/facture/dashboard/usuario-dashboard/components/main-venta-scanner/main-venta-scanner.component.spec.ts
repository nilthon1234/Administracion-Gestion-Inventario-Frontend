import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainVentaScannerComponent } from './main-venta-scanner.component';

describe('MainVentaScannerComponent', () => {
  let component: MainVentaScannerComponent;
  let fixture: ComponentFixture<MainVentaScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainVentaScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainVentaScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
