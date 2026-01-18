import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientArticleHttpService } from './client-article-http.service';
import { environment } from '../../../../environments/environment';

describe('ClientArticleHttpService', () => {
  let service: ClientArticleHttpService;
  let httpMock: HttpTestingController;

  const mockArticle = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    text: 'Test Text',
    category: 'MARVEL',
    usuario_id: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientArticleHttpService]
    });
    service = TestBed.inject(ClientArticleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all articles for user', () => {
    const userId = 1;
    const mockResponse = {
      status: 200,
      message: 'Success',
      data: [mockArticle]
    };

    service.getAll(userId).subscribe(response => {
      expect(response.data).toEqual([mockArticle]);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/client/articles?usuario_id=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get article by id', () => {
    const articleId = 1;
    const mockResponse = {
      status: 200,
      message: 'Success',
      dataUnit: mockArticle
    };

    service.getById(articleId).subscribe(response => {
      expect(response.dataUnit).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/client/articles/${articleId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create article', () => {
    const articleData = { ...mockArticle, id: undefined };
    const mockResponse = {
      status: 201,
      message: 'Created',
      dataUnit: { ...mockArticle, id: 1 }
    };

    service.create(articleData).subscribe(response => {
      expect(response.status).toBe(201);
      expect(response.dataUnit).toBeDefined();
    });

    const req = httpMock.expectOne(`${environment.apiURL}/client/articles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(articleData);
    req.flush(mockResponse);
  });

  it('should update article', () => {
    const articleId = 1;
    const updatedData = { ...mockArticle, title: 'Updated Title' };
    const mockResponse = {
      status: 200,
      message: 'Updated',
      dataUnit: updatedData
    };

    service.update(articleId, updatedData).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/client/articles/${articleId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush(mockResponse);
  });

  it('should delete article', () => {
    const articleId = 1;
    const mockResponse = { status: 200, message: 'Deleted' };

    service.delete(articleId).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/client/articles/${articleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
