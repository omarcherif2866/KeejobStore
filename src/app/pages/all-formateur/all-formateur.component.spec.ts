import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFormateurComponent } from './all-formateur.component';

describe('AllFormateurComponent', () => {
  let component: AllFormateurComponent;
  let fixture: ComponentFixture<AllFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
