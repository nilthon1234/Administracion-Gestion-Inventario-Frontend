import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSeparationModalComponent } from './update-separation-modal.component';

describe('UpdateSeparationModalComponent', () => {
  let component: UpdateSeparationModalComponent;
  let fixture: ComponentFixture<UpdateSeparationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSeparationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSeparationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
