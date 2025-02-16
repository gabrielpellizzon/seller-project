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
import { LoginResponse, UserPayload } from './interfaces/user-login.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    if (await this.isEmailTaken(createUserDto.email)) {
      throw new HttpException('Email already exists', 400);
    }

    const newUser = new this.userModel({
      email: createUserDto.email,
      password: await hash(createUserDto.password, 10),
      name: createUserDto.name,
    } as CreateUserDto);

    await newUser.save();

    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.findUserByEmail(loginUserDto.email);

    if (!(await compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  private async findUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !!user;
  }
}
