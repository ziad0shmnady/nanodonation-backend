import { Test, TestingModule } from '@nestjs/testing';
import { KioskController } from './kiosk.controller';

describe('KioskController', () => {
  let controller: KioskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KioskController],
    }).compile();

    controller = module.get<KioskController>(KioskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
