import { ExpressRequestInterface } from '@app/types/expressRequestInterface';
import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, 'test');
      const user = await this.userService.findById(decode.id);
      req.user = user;
      console.log('decode', decode);
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
