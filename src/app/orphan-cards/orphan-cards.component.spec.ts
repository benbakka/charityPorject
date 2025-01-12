import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanCardsComponent } from './orphan-cards.component';

describe('OrphanCardsComponent', () => {
  let component: OrphanCardsComponent;
  let fixture: ComponentFixture<OrphanCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrphanCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrphanCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
