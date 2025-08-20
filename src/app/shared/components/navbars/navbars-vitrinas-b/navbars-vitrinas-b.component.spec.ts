import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsVitrinasBComponent } from './navbars-vitrinas-b.component';

describe('NavbarsVitrinasBComponent', () => {
  let component: NavbarsVitrinasBComponent;
  let fixture: ComponentFixture<NavbarsVitrinasBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsVitrinasBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarsVitrinasBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
