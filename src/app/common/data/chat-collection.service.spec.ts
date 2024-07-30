import { TestBed } from '@angular/core/testing';

import { ChatCollectionService } from './chat-collection.service';

describe('ChatCollectionService', () => {
  let service: ChatCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
