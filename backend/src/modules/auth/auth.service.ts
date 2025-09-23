import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
 import { createUserDto } from '../users/dto/create-user-dto';
import * as argon2 from 'argon2';
import { User } from '../users/schmas/users.schema';
import { JWTAuthService } from '../utils/jwt.service';
import { EmpoyeeRepo, UsersRepo } from './auth.repo';
import { IsArray } from 'class-validator';
 
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: UsersRepo,
    private readonly EmpoyeeRepo: EmpoyeeRepo,
    private readonly logger: Logger,
    private readonly JwtService: JWTAuthService,
  ) {}

  async createUser(
    createUserDto: any,
    admin: { name: string; email: string },
  ) {
    this.logger.verbose(`${admin.name} is creating a new user `);
    if(Array.isArray(createUserDto)){

      const empOps = createUserDto.map(b => ({
        insertOne: {
          document: {
          ...b
          }
        }
      }));
      return await this.EmpoyeeRepo.bulkWrite(empOps)
    }
    try {
      //TODO we dont create it directly wwe sned a email witha alink and token and then finaly create ot or activate user
      this.logger.verbose(
        `Checking if document already exists: ${JSON.stringify(createUserDto)}`,
      );

      const exists = await this.authRepo.exists( {email:createUserDto.email.toLocaleLowerCase()});
      this.logger.warn(exists)
      if (exists) {
        this.logger.error(
          `Document already exists: ${JSON.stringify(createUserDto)}`,
        );
        throw new BadRequestException();
      }
      createUserDto.password = await argon2.hash(createUserDto.password);
      return this.authRepo.create(createUserDto);
    } catch (error) {
      this.logger.error(
        `falid to create newUser with data ${JSON.stringify(createUserDto)}, stack : ${error.stack}`,
      );
      throw new InternalServerErrorException();
    }
  }
  async signin(
    createUserDto: Partial<createUserDto>,
    admin: { name: string; email: string },
  ) {
    this.logger.verbose(`${createUserDto.email} is signing in    `);
    const exsistingUse = (await this.authRepo.findOne(
      {
        email: createUserDto.email,
      },
      '+password',
    )) as User;
    if (
      !exsistingUse ||
      !(await argon2.verify(
        exsistingUse.password as string,
        createUserDto.password as string,
      ))
    ) {
      await Promise.reject('email or password are invalid');
    }
    
  delete exsistingUse.password
 
 
    const [authToken, refreshToken] = this.JwtService.generateTokens([
      {
        secret: process.env.AUTH_SECRET as string,
        expiresIn: '15m',
        payload: { user:exsistingUse},
      },
      {
        secret: process.env.REFRESH_SECRET as string,
        expiresIn: '30d',
        payload: { user:  exsistingUse },
      },
    ]);
    return { authToken, refreshToken };
  }
  async refresh(token: string) {
    this.logger.verbose('new refrsh tokn is neing attmped to issued');
    const userData = this.JwtService.VerifyToken({
      token,
      secret: process.env.REFRESH_SECRET as string,
    });

    if (!userData) {
      this.logger.error(
        `invalid tokne data as token is : ${JSON.stringify(userData)}`,
      );
      throw new UnauthorizedException();
    }
    this.logger.verbose(
      `request payload${JSON.stringify(userData)} at refresh funion at service: ${AuthService.name}`,
    );

    const exsisitngUser = (await this.authRepo.findOneById(
      userData.payload.user._id,
    )) as User;
    const [authToken] = this.JwtService.generateTokens([
      {
        secret: process.env.AUTH_SECRET as string,
        expiresIn: '15m',
        payload: { user: exsisitngUser },
      },
    ]);

    return authToken;
  }
}
