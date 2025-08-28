import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepo } from './auth.repo';
import { createUserDto } from '../users/dto/create-user-dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly AuthService: AuthService,
  ) {}

  @Post('')
  async createUser(@Body() createUserDto: createUserDto) {
    return this.AuthService.createUser(createUserDto, {
      email: 'example@email.cm',
      name: 'Alaa',
    });
  }
  @Post('signin')
  async signin(
    @Body() createUserDto: Partial<createUserDto>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(req.body);

    const { refreshToken, authToken } = await this.AuthService.signin(
      createUserDto,
      {
        email: createUserDto.email as string,
        name: createUserDto.email as string,
      },
    );
    res.cookie('refresh-token', refreshToken, {
      maxAge: 1254685235478,
      sameSite: 'none',
      secure: true,
    });

    return res.json({ data: authToken }).status(200);
  }

  @Get()
  signOut(@Res() res: Response) {
    return res
      .cookie('refresh-token', {})
      .json({ message: 'sign out succeful' });
  }
  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh-token'] as any;
    console.log(refreshToken);
    if (!refreshToken) throw new BadRequestException('Please sign in first');

    const authToken = await this.authService.refresh(refreshToken);

    return res
      .cookie('refresh-token', refreshToken, {
        httpOnly: true,
        maxAge: 1254685235478,
        sameSite: true,
        secure: true,
      })
      .json(authToken);
  }
}
