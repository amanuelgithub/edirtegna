import { CUSTOMER_ROLE, CUSTOMER, UserEntity, ROLE, COMPANY_ADMIN } from '@app/db';
import { UserNotificationService } from '@app/notification';
import {
  ActivityTitle,
  API_TAGS,
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  DetailResponse,
  IRequestDetail,
  Paginate,
  Paginated,
  PaginateQuery,
  RequestInfo,
  Roles,
  UploadProfilePic,
} from '@app/shared';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { In } from 'typeorm';
import {
  AdministrativeCustomerUserBuilder,
  PhoneEmailValidationDto,
  PhoneEmailValidationPayload,
  RegisterCustomerStaffDto,
  UpdateUserDto,
  UpdateUserPayload,
  UpdateUserStatusDto,
  UpdateUserStatusPayload,
  UserPageConfig,
} from '../dtos';
import { CreateUserService, GetUserService, ListUsersService, PhoneAndEmailValidationService, UpdateUserService } from '../services';

@Roles(...ROLE)
@Controller('web/customer-users')
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class WebCustomerUserController {
  constructor(
    private readonly listUsersService: ListUsersService,
    private readonly getUserService: GetUserService,
    private readonly createUserService: CreateUserService,
    private readonly notify: UserNotificationService,
    private readonly updateUserService: UpdateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
  ) {}

  @Get('/')
  @Roles(COMPANY_ADMIN)
  @ApiOkPaginatedResponse(UserEntity, UserPageConfig)
  @ApiPaginationQuery(UserPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<UserEntity>> {
    const where = {
      roleId: In([CUSTOMER_ROLE]),
    };
    return this.listUsersService.getAll(query, where);
  }

  @Get('/validate-registration')
  @HttpCode(HttpStatus.OK)
  validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    return this.phoneAndEmailValidationService.validate(payload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    const partnerId = info?.user?.coid;
    return this.getUserService.getBy({ id, partnerId });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  // @Roles(CUSTOMER)
  @ActivityTitle('Register Partner User')
  @UploadProfilePic('profile-image', 'profilePic')
  async registerCompanyUser(@Body() dto: RegisterCustomerStaffDto, @UploadedFile() file: Express.Multer.File, @RequestInfo() info: IRequestDetail) {
    const partnerId = info?.user?.coid;
    const profilePic = file?.path;
    const builder = new AdministrativeCustomerUserBuilder({ ...dto, partnerId, profilePic, realm: 'CUSTOMER' }, info);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
    return new DetailResponse();
  }

  @Put('me')
  @Roles(...CUSTOMER_ROLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Own Profile')
  @UploadProfilePic('profile-image', 'profilePic')
  updateOwn(@Body() dto: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @RequestInfo() info: IRequestDetail) {
    const userId = Number(info.user.uid);
    const profilePic = file?.path;
    dto.partnerId = +info.user.coid;
    const payload = new UpdateUserPayload({ ...dto, profilePic }, userId, 'WEB', info.ip, userId, info.device);
    return this.updateUserService.updateUser(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  // @Roles(CUSTOMER)
  @ActivityTitle('Update Partner User')
  @UploadProfilePic('profile-image', 'profilePic')
  updateCompanyUser(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() dto: UpdateUserDto, @RequestInfo() info: IRequestDetail) {
    const profilePic = file?.path;
    const userId = Number(info.user.uid);
    const payload = new UpdateUserPayload({ ...dto, profilePic }, id, 'WEB', info.ip, userId, info.device);
    console.log(payload);
    return this.updateUserService.updateUser(payload);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  // @Roles(CUSTOMER)
  @ActivityTitle('Update Customer User Status')
  updateCompanyUserStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserStatusDto, @RequestInfo() info: IRequestDetail) {
    const userId = Number(info.user.uid);
    const payload = new UpdateUserStatusPayload(dto, id, 'WEB', info.ip, userId, info.device);
    return this.updateUserService.updateUserStatus(payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  // @Roles(CUSTOMER)
  @ActivityTitle('Delete Company User Status')
  deleteCompanyUser(@Param('id', ParseIntPipe) id: number) {
    return this.updateUserService.delete(id);
  }

  // @Put('me')
  // @HttpCode(HttpStatus.ACCEPTED)
  // @UsePipes(ValidationPipe)
  // @ActivityTitle('Update Own Profile')
  // async updateOwnProfile(@Body() dto: UpdateUserDto, @RequestInfo() info: IRequestDetail) {
  //   const id = +info.user?.uid;
  //   const _dto = { id };
  //   const { data } = await this.getUserService.getBy(_dto);
  //   if (!data) {
  //     throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
  //   }
  //   const userId = Number(info.user.uid);
  //   const payload = new UpdateUserPayload(dto, id, 'WEB', info.ip, userId, info.device);
  //   const result = await this.updateUserService.updateUser(payload);
  //   return result;
  // }
}
