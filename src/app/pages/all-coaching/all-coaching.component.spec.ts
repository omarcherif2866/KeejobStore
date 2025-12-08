import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoachingComponent } from './all-coaching.component';

describe('AllCoachingComponent', () => {
  let component: AllCoachingComponent;
  let fixture: ComponentFixture<AllCoachingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCoachingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCoachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
