import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'nuevo@demo.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ example: 'Nombre Apellido' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: '88888888' })
    @IsOptional()
    @IsString()
    telephone?: string;

    @ApiPropertyOptional({ enum: Role, example: Role.USER })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiProperty({ example: 1 })
    @IsInt()
    tenantId: number;
}