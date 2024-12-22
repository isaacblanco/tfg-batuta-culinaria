import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RecipeCardComponent } from './recipe-card.component';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const mockRecipe = {
    id: 1,
    name: 'Spaghetti Carbonara',
    preparation_time: '00:30:00',
    difficulty: 2,
    category_id: 1,
    num_people: 4,
    image_url: 'https://example.com/image.jpg',
    intro: 'A classic Italian pasta dish',
    user_id: '123',
    steps: [],
    ingredients: [],
    labels: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RecipeCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null, // Simula que no hay parámetros en la ruta
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;

    // Asigna un mock válido a `recipe` antes de ejecutar `detectChanges`.
    component.recipe = mockRecipe;
    component.duration = '00:30:00'; // Simula la duración calculada.

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display recipe name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const recipeTitleElement = compiled.querySelector('ion-card-title');
    expect(recipeTitleElement?.textContent).toContain('Spaghetti Carbonara');
  });

  it('should display preparation time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const prepTimeElement = compiled.querySelector('ion-col:nth-child(2)');
    expect(prepTimeElement?.textContent).toContain(' Tiempo: 30m ');
  });

  it('should display number of portions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const portionsElement = compiled.querySelector('ion-col:nth-child(3)');
    expect(portionsElement?.textContent).toContain('4');
  });

  it('should display difficulty level as medium', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const difficultyElement = compiled.querySelector('ion-col:nth-child(1) span');
    expect(difficultyElement?.textContent).toContain('Medium');
  });
});
