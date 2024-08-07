import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCalenderComponent } from './add-calender.component';

describe('AddCalenderComponent', () => {
  let component: AddCalenderComponent;
  let fixture: ComponentFixture<AddCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
