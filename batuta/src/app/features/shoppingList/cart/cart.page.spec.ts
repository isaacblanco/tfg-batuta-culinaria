import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { CartPage } from './cart.page';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;

  const shoppingCartServiceMock = jasmine.createSpyObj('ShoppingCartService', [
    'initializeCart',
    'getCart',
  ]);
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'getUserId',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CartPage], // CartPage en imports
      providers: [
        { provide: ShoppingCartService, useValue: shoppingCartServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
