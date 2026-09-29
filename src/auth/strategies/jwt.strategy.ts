import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key', // Debe ser idéntico al secret configurado en AuthModule
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.id,
            email: payload.email,
            role: payload.role,
        };
    }
}