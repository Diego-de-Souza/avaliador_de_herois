import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArticlePageComponent } from './article-page.component';

// Mock $localize
(global as any).$localize = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
};

describe('ArticlePageComponent', () => {
  let component: ArticlePageComponent;
  let fixture: ComponentFixture<ArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlePageComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
