import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { CountryEntity } from '@app/db/parameters';
import { CreateCountryDto, CountryPageConfigDto, UpdateCountryDto } from '@app/parameter/dtos';
import { CountryService } from '@app/parameter/services/country.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('/manage/countries')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageCountryController {
  constructor(private readonly service: CountryService) {}

  @Get('/')
  @ApiOkPaginatedResponse(CountryEntity, CountryPageConfigDto)
  @ApiPaginationQuery(CountryPageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Country')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: join('images', 'Countries', 'flags'),
        filename: (_, file, cb) => {
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateCountryDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|jpeg|png|gif)',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    icon: Express.Multer.File,
  ) {
    console.log('icon', icon);
    return this.service.create(dto, icon ? join('images', 'Countries', 'flags', icon.filename) : '');
    // return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Country')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: join('images', 'Countries', 'flags'),
        filename: (_, file, cb) => {
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCountryDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|jpeg|png|gif)',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    icon?: Express.Multer.File,
  ) {
    const country = await this.service.findOne(id);
    // TODO: I'me not removing the old image
    return this.service.update(id, body, icon ? join('images', 'Countries', 'flags', icon.filename) : country.data.icon);
  }
}
