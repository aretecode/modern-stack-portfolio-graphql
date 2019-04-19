/**
 * @tutorial https://firebase.google.com/docs/admin/setup
 * @see https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk
 * @api https://firebase.google.com/docs/database/admin/retrieve-data
 * @api https://firebase.google.com/docs/database/admin/save-data
 * @see https://firebase.google.com/docs/reference/js/firebase
 * @see https://firebase.google.com/docs/reference/admin/node/admin.credential
 * @see https://firebase.google.com/docs/auth/admin/errors
 * @example https://github.com/firebase/functions-samples/tree/master/typescript-getting-started
 * @example https://github.com/Inpassor/ts-firebase-app/blob/master/src/helpers/firestore-store.ts
 * @see https://spectrum.chat/zeit/now/now-firebase~4f03b7cc-c99c-460a-9881-5dfd5c07e81b
 *
 * @todo cleanup this file, split, test all of it
 */
import * as admin from 'firebase-admin'
import { get, set, has } from './redis'
import { logger } from '../log'

const RESUME_KEY = '__resume__'
const HAS_REQUIRED_ENV = typeof process.env.FIREBASE_PRIVATE_KEY === 'string'
let didConnectSuccessfully = HAS_REQUIRED_ENV

if (HAS_REQUIRED_ENV) {
  logger.info('[firebase] connecting')

  /**
   * @see https://zeit.co/docs/v2/deployments/environment-variables-and-secrets
   * @see https://zeit.co/docs/v2/deployments/environment-variables-and-secrets#securing-environment-variables-using-secrets
   */
  const serviceAccount = {
    type: 'service_account',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',

    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_KEY_ID,
    private_key: Buffer.from(
      process.env.FIREBASE_PRIVATE_KEY,
      'base64'
    ).toString(),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    client_x509_cert_url: process.env.FIREBASE_CERT_URL,
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  } catch (connectionError) {
    logger.error(connectionError)
    didConnectSuccessfully = false
  }
} else {
  logger.error('[firebase] did not have required env information')
}

export class FireBaseStore {
  async read() {
    const hasResumeInRedis = await has(RESUME_KEY)
    if (hasResumeInRedis) {
      logger.info('[firebase] has resume in redis')
      const gotFromRedis = await get(RESUME_KEY)
      return gotFromRedis
    }

    if (didConnectSuccessfully === false) {
      logger.error('[firebase] could not connect successfully')
      return
    }

    return new Promise((resolve, reject) => {
      logger.debug('[firebase] loading from firebase')
      const db = admin.database()
      const ref = db.ref()

      ref.on(
        'value',
        async function(snapshot) {
          const value = snapshot.val()
          logger.info('[firebase] loaded from firebase')
          set(RESUME_KEY, value)
          logger.info('[firebase] set into redis')
          resolve(value)
        },
        function(errorObject) {
          logger.error('The read failed: ' + errorObject.code)
          reject(errorObject)
        }
      )
    })
  }

  write() {
    /**
     * currently not needed
     */
  }
}
