export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  },
  mail: {
    host: process.env.SES_MAIL_HOST,
    username: process.env.SES_MAIL_USERNAME,
    password: process.env.SES_MAIL_PASSWORD,
    port: process.env.SES_MAIL_PORT,
    sendFrom: process.env.SES_MAIL_SEND_FROM,
    otp_expired: process.env.OTP_EXPIRED || 300
  },
  jwt: {
    publicKey: Buffer.from(
      process.env.JWT_PUBLIC_KEY_BASE64,
      'base64'
    ).toString('utf8'),
    privateKey: Buffer.from(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64'
    ).toString('utf8'),
    accessTokenExpiresInSec: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
      10
    ),
    refreshTokenExpiresInSec: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      10
    )
  },
  admin: {
    wallet: process.env.ADMIN_MAIN_WALLET
  },
  defaultAdminUserPassword: process.env.DEFAULT_ADMIN_USER_PASSWORD,
  isEnableAutoGenUserCode: parseInt(process.env.ENABLE_AUTO_GEN_USER_CODE) || 0,
  delayMinutesForSleepTracking:
    parseInt(process.env.DELAY_MINUTES_SLEEP_TRACKING) || 1200,
  payment: {
    url: process.env.WYRE_BASEURL,
    secret_key: process.env.WYRE_SECRET_KEY,
    account: process.env.WYRE_ACCOUNT,
    api_key: process.env.WYRE_API_KEY,
    paymentMethod: process.env.PAY_METHOD
  }, 
  mobile_config: {
    version: process.env.MOBILE_VERSION
  }
})
