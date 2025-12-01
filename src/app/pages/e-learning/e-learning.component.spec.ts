import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELearningComponent } from './e-learning.component';

describe('ELearningComponent', () => {
  let component: ELearningComponent;
  let fixture: ComponentFixture<ELearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ELearningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ELearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
