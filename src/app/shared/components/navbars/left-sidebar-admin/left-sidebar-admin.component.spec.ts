import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSidebarAdminComponent } from './left-sidebar-admin.component';

describe('LeftSidebarAdminComponent', () => {
  let component: LeftSidebarAdminComponent;
  let fixture: ComponentFixture<LeftSidebarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidebarAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
