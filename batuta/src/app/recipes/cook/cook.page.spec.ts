import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookPage } from './cook.page';

describe('CookPage', () => {
  let component: CookPage;
  let fixture: ComponentFixture<CookPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
