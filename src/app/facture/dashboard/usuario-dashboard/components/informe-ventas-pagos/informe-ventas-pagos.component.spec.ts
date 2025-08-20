import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeVentasPagosComponent } from './informe-ventas-pagos.component';

describe('InformeVentasPagosComponent', () => {
  let component: InformeVentasPagosComponent;
  let fixture: ComponentFixture<InformeVentasPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeVentasPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeVentasPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
