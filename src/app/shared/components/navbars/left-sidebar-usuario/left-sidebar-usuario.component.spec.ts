import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSidebarUsuarioComponent } from './left-sidebar-usuario.component';

describe('LeftSidebarUsuarioComponent', () => {
  let component: LeftSidebarUsuarioComponent;
  let fixture: ComponentFixture<LeftSidebarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidebarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
