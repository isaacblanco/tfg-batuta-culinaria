import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IaPage } from './ia.page';

describe('IaPage', () => {
  let component: IaPage;
  let fixture: ComponentFixture<IaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
