import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserPayload } from './interfaces/user-login.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel({
      email: createUserDto.email,
      password: await hash(createUserDto.password, 10),
      name: createUserDto.name,
    } as CreateUserDto);

    return newUser.save();
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);

    if (!(await compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  private async findUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
