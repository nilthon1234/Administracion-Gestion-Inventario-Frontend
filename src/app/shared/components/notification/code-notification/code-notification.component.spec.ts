import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeNotificationComponent } from './code-notification.component';

describe('CodeNotificationComponent', () => {
  let component: CodeNotificationComponent;
  let fixture: ComponentFixture<CodeNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
