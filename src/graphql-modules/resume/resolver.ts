import { readFileAsyncJson, writeFileAsyncJson, dbAbsolutePath } from '../../fs'
import { logger } from '../../log'
import db from '../../db.json'

let inMemoryBecauseNowFileSystemIsReadOnly = { ...db }

export default {
  Query: {
    resume: async (obj, args, context, info) => {
      if (process.env.IS_NOW !== undefined) {
        console.debug('getResume from memory')
        return inMemoryBecauseNowFileSystemIsReadOnly
      }

      try {
        const response = await readFileAsyncJson(dbAbsolutePath)
        logger.info('[resume] read file', response)
        return response
      } catch (fileSystemError) {
        logger.error(fileSystemError)
        /**
         * @@security don't show the whole stack
         */
        throw fileSystemError
      }
    },
  },
  /**
   * can have `deleteResume` & `updateResume`, but this is an example so KISS
   */
  Mutation: {
    setResume: async (obj, args, context, info) => {
      if (process.env.IS_NOW !== undefined) {
        inMemoryBecauseNowFileSystemIsReadOnly = args
        console.debug('setResume => memory')
        return
      }

      try {
        logger.info('[resume] writing file from args:', args)
        await writeFileAsyncJson(dbAbsolutePath, args)
        logger.info('[resume] wrote file')
      } catch (fileSystemError) {
        logger.error(fileSystemError)
        /**
         * @@security don't show the whole stack
         */
        throw fileSystemError
      }
    },
  },
}
