import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfigAppComponent } from './admin-config-app.component';

describe('AdminConfigAppComponent', () => {
  let component: AdminConfigAppComponent;
  let fixture: ComponentFixture<AdminConfigAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConfigAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfigAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
