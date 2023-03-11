export class UpdateUserDto {
  readonly id: number;
  readonly email?: string;
  readonly username?: string;
  readonly password?: string;
  readonly image?: string;
  readonly bio?: string;
}
