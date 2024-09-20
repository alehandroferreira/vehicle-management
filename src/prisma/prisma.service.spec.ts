import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client'; // Certifique-se de que esta importação esteja correta
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaClient = prismaService as unknown as PrismaClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
    expect(prismaClient).toBeDefined();
  });
});
