import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesVitrinaComponent } from './observaciones-vitrina.component';

describe('ObservacionesVitrinaComponent', () => {
  let component: ObservacionesVitrinaComponent;
  let fixture: ComponentFixture<ObservacionesVitrinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservacionesVitrinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionesVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
