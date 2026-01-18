import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationHttpService } from './notification-http.service';
import { environment } from '../../../../environments/environment';

describe('NotificationHttpService', () => {
  let service: NotificationHttpService;
  let httpMock: HttpTestingController;

  const mockNotifications = [
    { id: 1, title: 'Test', message: 'Test message', read: false },
    { id: 2, title: 'Test 2', message: 'Test message 2', read: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationHttpService]
    });
    service = TestBed.inject(NotificationHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all notifications for user', () => {
    const userId = 1;
    const mockResponse = {
      status: 200,
      message: 'Success',
      data: mockNotifications
    };

    service.getAll(userId).subscribe(response => {
      expect(response.data).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/notifications?usuario_id=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get notification by id', () => {
    const notificationId = 1;
    const mockResponse = {
      status: 200,
      message: 'Success',
      dataUnit: mockNotifications[0]
    };

    service.getById(notificationId).subscribe(response => {
      expect(response.dataUnit).toEqual(mockNotifications[0]);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/notifications/${notificationId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should mark notification as read', () => {
    const notificationId = 1;
    const mockResponse = { status: 200, message: 'Success' };

    service.markAsRead(notificationId).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/notifications/${notificationId}/read`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should delete notification', () => {
    const notificationId = 1;
    const mockResponse = { status: 200, message: 'Success' };

    service.delete(notificationId).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/notifications/${notificationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should create notification', () => {
    const notificationData = {
      usuario_id: 1,
      title: 'New Notification',
      message: 'Test message'
    };
    const mockResponse = {
      status: 201,
      message: 'Created',
      dataUnit: { id: 3, ...notificationData }
    };

    service.create(notificationData).subscribe(response => {
      expect(response.status).toBe(201);
      expect(response.dataUnit).toBeDefined();
    });

    const req = httpMock.expectOne(`${environment.apiURL}/notifications`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(notificationData);
    req.flush(mockResponse);
  });
});
