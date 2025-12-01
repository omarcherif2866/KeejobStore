import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFormationKeejobComponent } from './all-formation-keejob.component';

describe('AllFormationKeejobComponent', () => {
  let component: AllFormationKeejobComponent;
  let fixture: ComponentFixture<AllFormationKeejobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFormationKeejobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFormationKeejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
