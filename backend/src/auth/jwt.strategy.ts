import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_SECRETO_SUPER_SEGURO', // Debe ser el mismo secreto
    });
  }

  async validate(payload: { sub: string; role: string; }) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    console.log("🚀 ~ JwtStrategy ~ validate ~ user:", user)
    if (!user) {
      throw new UnauthorizedException();
    }
    // Devolvemos un objeto plano con los datos esenciales, asegurando que el rol del token es el que se usa.
    // Esto previene problemas si el objeto 'user' de la BD no incluyera el rol por alguna razón.
    return { id: payload.sub, name: user.name, email: user.email, role: user.role };
  }
}