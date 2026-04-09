import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingSpaceComponent } from './writing-space.component';

describe('WritingSpaceComponent', () => {
  let component: WritingSpaceComponent;
  let fixture: ComponentFixture<WritingSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
