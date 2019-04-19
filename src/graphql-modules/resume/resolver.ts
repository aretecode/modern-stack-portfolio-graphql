/**
 * @file if we had a larger scale app, we'd split up a more abstract data access system
 */
import {
  readFileAsyncJson,
  writeFileAsyncJson,
  dbAbsolutePath,
} from '../../storage/fs'
import { logger } from '../../log'
import db from '../../storage/db.json'
import { FireBaseStore } from '../../storage/firebase'
import { isValidResponse } from './utils'

let inMemoryBecauseNowFileSystemIsReadOnly = db

async function getFromFireBase() {
  logger.info('[getResume] from firebase')
  const instance = new FireBaseStore()
  const value = await instance.read()
  if (isValidResponse(value)) {
    return value
  } else {
    logger.warn('[getResume] invalid response from fireBase')
    return inMemoryBecauseNowFileSystemIsReadOnly
  }
}

export default {
  Query: {
    resume: async (obj, args, context, info) => {
      if (process.env.NODE_ENV === 'development') {
        return getFromFireBase()
      } else if (process.env.IS_NOW !== undefined) {
        /**
         * this means we haven't set data in memory
         */
        if (inMemoryBecauseNowFileSystemIsReadOnly === db) {
          return getFromFireBase()
        } else {
          logger.debug('[getResume] from memory')
          return inMemoryBecauseNowFileSystemIsReadOnly
        }
      } else {
        try {
          const response = await readFileAsyncJson(dbAbsolutePath)
          logger.info('[getResume] read file', response)
          return response
        } catch (fileSystemError) {
          logger.error(fileSystemError)
          /**
           * @@security don't show the whole stack
           */
          throw fileSystemError
        }
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
        logger.debug('setResume => memory')
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
