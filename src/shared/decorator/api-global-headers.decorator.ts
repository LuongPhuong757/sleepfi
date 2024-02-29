import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiGlobalHeaders = () => {
  return applyDecorators(
    ApiHeader({
      name: 'version',
      description: `version supported: 1.1`,
    }),
  );
};
