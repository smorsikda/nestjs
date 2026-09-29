import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mocked_jwt_token') },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('debe retornar un access_token cuando las credenciales son válidas', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'admin@techsolutions.com',
        password: hashedPassword,
        role: 'ADMIN',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        email: 'admin@techsolutions.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@techsolutions.com' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateUser({
          email: 'noexiste@techsolutions.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'admin@techsolutions.com',
        password: hashedPassword,
        role: 'ADMIN',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.validateUser({
          email: 'admin@techsolutions.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});