import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ReqUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

// export const GqlRes = createParamDecorator(
//   (data, context: ExecutionContext) => {
//     const ctx = GqlExecutionContext.create(context);
//     console.log('=============================');
//     console.log(ctx.getContext().req.res);
//     console.log('=============================');

//     return ctx.getContext().req.res;
//   },
// );
