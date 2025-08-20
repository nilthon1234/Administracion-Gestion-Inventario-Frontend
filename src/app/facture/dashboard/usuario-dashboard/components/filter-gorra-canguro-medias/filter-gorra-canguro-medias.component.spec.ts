import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGorraCanguroMediasComponent } from './filter-gorra-canguro-medias.component';

describe('FilterGorraCanguroMediasComponent', () => {
  let component: FilterGorraCanguroMediasComponent;
  let fixture: ComponentFixture<FilterGorraCanguroMediasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterGorraCanguroMediasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterGorraCanguroMediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
