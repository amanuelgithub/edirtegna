import { ROLE } from '@app/db';
import { ActivityTitle, API_TAGS, IRequestDetail, RequestInfo, Roles, UploadProfilePic } from '@app/shared';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Put, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UpdateUserPayload } from '../dtos';
import { GetUserService, UpdateUserService } from '../services';
@Controller('web/user')
@Roles(...ROLE)
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class WebUserCommonController {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Put('update-profile-pic/me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Own Profile Pic')
  @UploadProfilePic('customer-own')
  async updateProfilePic(@UploadedFile() file: Express.Multer.File, @RequestInfo() info: IRequestDetail) {
    const id = +info.user?.uid;
    const _dto = { id };
    const { data } = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
    }
    const userId = Number(info.user.uid);
    const profilePic = file?.path;
    const payload = new UpdateUserPayload({ profilePic }, id, 'WEB', info.ip, userId, info.device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }
  @Put('me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Own Profile')
  async updateOwnProfile(@Body() dto: UpdateUserDto, @RequestInfo() info: IRequestDetail) {
    const id = +info.user?.uid;
    const _dto = { id };
    const { data } = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
    }
    const userId = Number(info.user.uid);
    const payload = new UpdateUserPayload(dto, id, 'WEB', info.ip, userId, info.device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }
}
