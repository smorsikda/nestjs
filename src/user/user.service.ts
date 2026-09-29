import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Nunca devolvemos el password
const userSelect = {
  id: true,
  email: true,
  name: true,
  telephone: true,
  role: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.user.findMany({ select: userSelect });
  }
}