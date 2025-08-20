import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsSidebarVitrinaComponent } from './navbars-sidebar-vitrina.component';

describe('NavbarsSidebarVitrinaComponent', () => {
  let component: NavbarsSidebarVitrinaComponent;
  let fixture: ComponentFixture<NavbarsSidebarVitrinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsSidebarVitrinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarsSidebarVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
