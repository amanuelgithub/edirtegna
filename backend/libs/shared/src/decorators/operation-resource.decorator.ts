import { OPERATION_RESOURCE } from '../constants';

export interface IOperationResource {
  operationModule: string;
  operationName?: string;
  resources?: string[];
}
export const OperationResources = (operationResource: IOperationResource) => {
  return (target: any, _?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      Reflect.defineMetadata(OPERATION_RESOURCE, operationResource, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(OPERATION_RESOURCE, operationResource, target);
    return target;
  };
};
