import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { Dummy } from '../../@generated/dummy/dummy.model';
import { DummyCreateInput } from '../../@generated/dummy/dummy-create.input';
import { FindManyDummyArgs } from '../../@generated/dummy/find-many-dummy.args';

/**
 * Resolves user object type.
 */
@Resolver(() => Dummy)
export class DummyResolver {
  /**
   * Query for single user.
   */
  @Query(() => [Dummy])
  dummies() {
    const dummy = new Dummy();
    dummy.json = {
      a: 1,
    };
    dummy.decimal = new Prisma.Decimal(1.002);
    return [dummy];
  }

  @Query(() => [Dummy])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findDummies(@Args() args: FindManyDummyArgs) {
    console.log('args', args);
    console.log(
      'args.where?.decimal?.equals.constructor',
      args.where?.decimal?.equals?.constructor.name,
    );
    console.log(
      'args.where?.decimals.equals',
      args.where?.decimals?.equals?.map(d => d.constructor.name),
    );
    // console.log('args.where.bigInt?.equals', args.where.bigInt?.equals);
    const dummy = new Dummy();
    // @ts-ignore
    dummy.id = ~~(Math.random() * 1000);
    // @ts-ignore
    dummy.bigInt = args.where.bigInt?.equals;
    return [dummy];
  }

  @Mutation(() => Dummy)
  createDummy(@Args('data') data: DummyCreateInput) {
    const dummy = new Dummy();

    Object.assign(dummy, { id: '1', date: new Date() }, data);
    if (data.decimals) {
      // @ts-ignore
      dummy.decimals = data.decimals.set;
    }

    dummy.id = `decimal_ctor_${
      (dummy.decimal as any)?.['constructor']?.name
      // @ts-ignore
    }, decimals: ${data.decimals?.set?.map(d => d.constructor.name)}`;

    return dummy;
  }
}
