import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEspecificarComponent } from './pago-especificar.component';

describe('PagoEspecificarComponent', () => {
  let component: PagoEspecificarComponent;
  let fixture: ComponentFixture<PagoEspecificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoEspecificarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoEspecificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
