import { mergeTypeDefs } from 'graphql-toolkit'
import { GraphQLModule } from '@graphql-modules/core'
import Schema from './schema'
import resolver from './resolver'
import { ResumeAPI } from './requests'

/**
 * @see https://medium.com/the-guild/graphql-modules-feature-based-graphql-modules-at-scale-2d7b2b0da6da
 * @see https://graphql-modules.com/docs/recipes/data-sources
 */
export const resumeModule = new GraphQLModule<{}, {}, {}>({
  name: 'Resume',
  typeDefs: mergeTypeDefs([Schema]),
  resolvers: resolver,
  providers: [ResumeAPI],
})
