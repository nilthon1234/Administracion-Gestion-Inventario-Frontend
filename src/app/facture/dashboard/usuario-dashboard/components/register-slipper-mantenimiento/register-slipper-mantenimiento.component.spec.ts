import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSlipperMantenimientoComponent } from './register-slipper-mantenimiento.component';

describe('RegisterSlipperMantenimientoComponent', () => {
  let component: RegisterSlipperMantenimientoComponent;
  let fixture: ComponentFixture<RegisterSlipperMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSlipperMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSlipperMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
