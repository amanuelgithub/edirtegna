import { ApiProperty } from '@nestjs/swagger';
import { BasePageOptionsDto } from './page-options.dto';

export class PageMetaDtoParameters<T = void> {
  pageOptionsDto: T & BasePageOptionsDto;
  itemCount: number;
}

export class PageMetaDto<T = void> {
  readonly page: number;

  readonly take: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters<T>) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDto<T> {
  success?: boolean = true;
  message?: string;
  statusCode?: number = 200;

  data: T[];

  meta: PageMetaDto<T>;

  constructor(data: T[], meta?: PageMetaDto<T>, message = 'Successful', success = true, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data ? data : [];
    this.meta = meta
      ? meta
      : {
          hasNextPage: false,
          hasPreviousPage: false,
          itemCount: 0,
          page: 1,
          pageCount: 0,
          take: 10,
        };
  }
}
type Constructor<T = object> = new (...args: any[]) => T;
type Wrapper<T = object> = { new (): T & any; prototype: T };
type DecoratorOptions = { name: string };
type ApiSchemaDecorator = <T extends Constructor>(options: DecoratorOptions) => (constructor: T) => Wrapper<T>;

export const ApiSchema: ApiSchemaDecorator = ({ name }) => {
  return (constructor) => {
    const wrapper = class extends constructor {};
    Object.defineProperty(wrapper, 'name', {
      value: name,
      writable: false,
    });
    return wrapper;
  };
};
@ApiSchema({ name: 'Data' }) // <- here
export class DetailResponse<T> {
  @ApiProperty({ type: Boolean })
  public success: boolean;
  @ApiProperty({ type: String })
  public message: string;
  @ApiProperty({ type: Number })
  public statusCode: number;
  @ApiProperty({ type: Object })
  public data?: T;
  constructor(data?: T, message = 'Successful', success = true, statusCode = 200) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
