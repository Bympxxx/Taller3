import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGames } from './catalogo-games';

describe('CatalogoGames', () => {
  let component: CatalogoGames;
  let fixture: ComponentFixture<CatalogoGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoGames],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
