import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMantenimientoSlipperComponent } from './main-mantenimiento-slipper.component';

describe('MainMantenimientoSlipperComponent', () => {
  let component: MainMantenimientoSlipperComponent;
  let fixture: ComponentFixture<MainMantenimientoSlipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainMantenimientoSlipperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainMantenimientoSlipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
