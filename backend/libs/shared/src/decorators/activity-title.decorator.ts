import { SetMetadata } from '@nestjs/common';

export const ActivityTitle = (activityTitle: string) => {
  return SetMetadata('activityTitle', activityTitle);
};
