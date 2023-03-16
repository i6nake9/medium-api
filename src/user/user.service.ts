import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExist = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (userExist) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user: any = await this.userRepository.findOne({
      where: [
        { email: loginUserDto.email },
        { password: loginUserDto.password },
      ],
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  async generateJwt(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      'test',
    );
  }

  findById(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: [{ id: userId }] });
  }

  async buildUserResponse(user: UserEntity): Promise<IUserResponse> {
    return {
      user: {
        ...user,
        token: await this.generateJwt(user),
      },
    };
  }

  async updateUser(
    userId: number,
    updatedUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    const updatedUser = {
      ...user,
      ...updatedUserDto,
    };
    return await this.userRepository.save(updatedUser);
  }
}
