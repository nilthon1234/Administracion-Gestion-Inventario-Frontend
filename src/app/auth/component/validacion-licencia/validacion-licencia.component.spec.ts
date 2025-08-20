import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionLicenciaComponent } from './validacion-licencia.component';

describe('ValidacionLicenciaComponent', () => {
  let component: ValidacionLicenciaComponent;
  let fixture: ComponentFixture<ValidacionLicenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionLicenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionLicenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
