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

  async validate(payload: { sub: string; role: string }): Promise<User> {
    console.log("🚀 ~ JwtStrategy ~ validate ~ payload:", payload)
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    console.log("🚀 ~ JwtStrategy ~ validate ~ user:", user)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}