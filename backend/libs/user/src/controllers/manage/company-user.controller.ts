import { COMPANY_ADMIN, ROLE, UserEntity } from '@app/db';
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
  Public,
  RequestInfo,
  Roles,
  UploadProfilePic,
} from '@app/shared';
import { CreateUserService, GetUserService, ListUsersService, PhoneAndEmailValidationService, UpdateUserService } from '@app/user/services';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AdministrativeUserBuilder,
  PhoneEmailValidationDto,
  PhoneEmailValidationPayload,
  RegisterAdminStaffDto,
  UpdateUserDto,
  UpdateUserPayload,
  UpdateUserStatusDto,
  UpdateUserStatusPayload,
  UserPageConfig,
} from '../../dtos';

@Controller('manage/company-users')
@Roles(COMPANY_ADMIN)
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class ManageCompanyUserController {
  constructor(
    private readonly listUsersService: ListUsersService,
    private readonly getUserService: GetUserService,
    private readonly createUserService: CreateUserService,
    private readonly notify: UserNotificationService,
    private readonly updateUserService: UpdateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
  ) {}

  @Get('/')
  @ApiOkPaginatedResponse(UserEntity, UserPageConfig)
  @ApiPaginationQuery(UserPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return this.listUsersService.getAll(query);
  }

  @Get('/validate-registration')
  @HttpCode(HttpStatus.OK)
  validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    return this.phoneAndEmailValidationService.validate(payload);
  }

  @Get(':id/stat')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  getUsersCount(@Param('id', ParseIntPipe) companyId: number) {
    return this.listUsersService.getUsersCount(companyId);
  }

  @Get('/all-stat')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  getAllUsersCount() {
    return this.listUsersService.getUsersCount();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.getUserService.getBy({ id });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  @Public()
  @ActivityTitle('Register Company User')
  @UploadProfilePic('profile-image', 'profilePic')
  async registerCompanyUser(@Body() dto: RegisterAdminStaffDto, @UploadedFile() file: Express.Multer.File, @RequestInfo() info: IRequestDetail) {
    console.log(dto);
    const profilePic = file?.path;
    const builder = new AdministrativeUserBuilder({ ...dto, profilePic }, info);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
    return new DetailResponse();
  }

  @Put('me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(...ROLE)
  @ActivityTitle('Update Own Profile')
  @UploadProfilePic('profile-image', 'profilePic')
  updateOwn(@Body() dto: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @RequestInfo() info: IRequestDetail) {
    const userId = Number(info.user.uid);
    const profilePic = file?.path;
    const payload = new UpdateUserPayload({ ...dto, profilePic }, userId, 'WEB', info.ip, userId, info.device);
    return this.updateUserService.updateUser(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  @ActivityTitle('Update Company User')
  @UploadProfilePic('profile-image', 'profilePic')
  updateCompanyUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @RequestInfo() info: IRequestDetail, @UploadedFile() file?: Express.Multer.File) {
    const profilePic = file?.path;
    console.log(info.user);
    const userId = Number(info.user.uid);
    console.log(dto);
    const payload = new UpdateUserPayload({ ...dto, profilePic }, id, 'WEB', info.ip, userId, info.device);
    console.log(payload);
    return this.updateUserService.updateUser(payload);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  @ActivityTitle('Update Company User Status')
  updateCompanyUserStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserStatusDto, @RequestInfo() info: IRequestDetail) {
    const userId = Number(info.user.uid);
    const payload = new UpdateUserStatusPayload(dto, id, 'WEB', info.ip, userId, info.device);
    return this.updateUserService.updateUserStatus(payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles(COMPANY_ADMIN)
  @ActivityTitle('Delete Company User Status')
  deleteCompanyUser(@Param('id', ParseIntPipe) id: number) {
    // const userId = Number(info.user.uid);
    return this.updateUserService.delete(id);
  }
}
