import { TestBed } from '@angular/core/testing';

import { TransferRoomDataService } from './transfer-room-data.service';

describe('TransferRoomDataService', () => {
  let service: TransferRoomDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferRoomDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
