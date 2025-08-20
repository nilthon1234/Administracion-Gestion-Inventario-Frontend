import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSeparationComponent } from './register-separation.component';

describe('RegisterSeparationComponent', () => {
  let component: RegisterSeparationComponent;
  let fixture: ComponentFixture<RegisterSeparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSeparationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSeparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
