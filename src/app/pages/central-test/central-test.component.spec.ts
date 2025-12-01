import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralTestComponent } from './central-test.component';

describe('CentralTestComponent', () => {
  let component: CentralTestComponent;
  let fixture: ComponentFixture<CentralTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
