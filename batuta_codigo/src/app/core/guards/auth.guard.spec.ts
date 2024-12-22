import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<Router>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getUserData']);
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['getUser', 'selectFromTable']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: SupabaseService, useValue: supabaseSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to login if no user found', async () => {
    localStorageService.getUserData.and.returnValue(null);
    supabaseService.getUser.and.returnValue(Promise.resolve({ data: null }));

    const result = await guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
