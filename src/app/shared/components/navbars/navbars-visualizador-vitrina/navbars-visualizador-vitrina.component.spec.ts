import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsVisualizadorVitrinaComponent } from './navbars-visualizador-vitrina.component';

describe('NavbarsVisualizadorVitrinaComponent', () => {
  let component: NavbarsVisualizadorVitrinaComponent;
  let fixture: ComponentFixture<NavbarsVisualizadorVitrinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsVisualizadorVitrinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarsVisualizadorVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
