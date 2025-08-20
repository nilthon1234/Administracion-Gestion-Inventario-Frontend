import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayTypeNavbarComponent } from './pay-type-navbar.component';

describe('PayTypeNavbarComponent', () => {
  let component: PayTypeNavbarComponent;
  let fixture: ComponentFixture<PayTypeNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayTypeNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayTypeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
