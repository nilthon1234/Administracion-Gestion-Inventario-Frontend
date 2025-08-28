import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonAlertaComponent } from './boton-alerta.component';

describe('BotonAlertaComponent', () => {
  let component: BotonAlertaComponent;
  let fixture: ComponentFixture<BotonAlertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonAlertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
