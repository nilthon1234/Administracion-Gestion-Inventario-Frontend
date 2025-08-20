import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainVentaComponent } from './main-venta.component';

describe('MainVentaComponent', () => {
  let component: MainVentaComponent;
  let fixture: ComponentFixture<MainVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
