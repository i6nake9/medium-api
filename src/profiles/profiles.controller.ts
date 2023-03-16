import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async getProfiles(@Param('username') username: string): Promise<any> {
    return this.profilesService.getProfile(username);
  }
}
