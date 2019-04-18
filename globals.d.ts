declare namespace NodeJS {
  interface Global {
    process: Process
  }
  interface ProcessEnv {
    NODE_ENV: 'test' | 'development' | 'production'
    REDIS_PASSWORD: string
    REDIS_DB_NAME: string
    REDIS_URL: string
    FIREBASE_PROJECT_ID: string
    FIREBASE_KEY_ID: string
    FIREBASE_PRIVATE_KEY: string
    FIREBASE_CLIENT_EMAIL: string
    FIREBASE_CLIENT_ID: string
    FIREBASE_CERT_URL: string

    CACHE_TYPE?: string
  }

  interface Process {
    browser: boolean
    env: ProcessEnv
  }
}
