import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePagosActualizadosComponent } from './informe-pagos-actualizados.component';

describe('InformePagosActualizadosComponent', () => {
  let component: InformePagosActualizadosComponent;
  let fixture: ComponentFixture<InformePagosActualizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformePagosActualizadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformePagosActualizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
