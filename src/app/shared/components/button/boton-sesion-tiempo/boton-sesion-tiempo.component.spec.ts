import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonSesionTiempoComponent } from './boton-sesion-tiempo.component';

describe('BotonSesionTiempoComponent', () => {
  let component: BotonSesionTiempoComponent;
  let fixture: ComponentFixture<BotonSesionTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonSesionTiempoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonSesionTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
