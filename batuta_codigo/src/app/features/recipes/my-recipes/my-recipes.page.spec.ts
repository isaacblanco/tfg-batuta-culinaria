import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyRecipesPage } from './my-recipes.page';

describe('MyRecipesPage', () => {
  let component: MyRecipesPage;
  let fixture: ComponentFixture<MyRecipesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), MyRecipesPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }, // Mock ActivatedRoute
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
