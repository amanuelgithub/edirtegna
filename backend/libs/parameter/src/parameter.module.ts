import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PARAMETER_ENTITIES } from '@app/db/parameters';
import { ManageStateController, ManageCountryController, CustomerCountryController, ManageCityController, CustomerCityController, CustomerStateController } from './controllers';
import { StateService, CountryService, CityService } from './services';

const controllers = [ManageStateController, ManageCountryController, ManageCityController, CustomerCityController, CustomerCountryController, CustomerStateController];

const providers = [StateService, CountryService, CityService];

@Module({
  imports: [TypeOrmModule.forFeature(PARAMETER_ENTITIES)],
  providers: [...providers],
  controllers: [...controllers],
  exports: [],
})
export class ParameterModule {}
