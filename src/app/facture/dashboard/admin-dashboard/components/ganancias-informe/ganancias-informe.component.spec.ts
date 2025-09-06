import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GananciasInformeComponent } from './ganancias-informe.component';

describe('GananciasInformeComponent', () => {
  let component: GananciasInformeComponent;
  let fixture: ComponentFixture<GananciasInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GananciasInformeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GananciasInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
