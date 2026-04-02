import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingSpace } from './writing-space';

describe('WritingSpace', () => {
  let component: WritingSpace;
  let fixture: ComponentFixture<WritingSpace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingSpace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingSpace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
