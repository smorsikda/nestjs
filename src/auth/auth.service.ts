import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async validateUser(user: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);

    if (isPasswordValid) {
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
