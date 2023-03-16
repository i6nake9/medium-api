import { UserService } from '@app/user/user.service';
import { Controller, Get } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getProfiles() {
    return await this.profilesService.getProfile();
  }
}
