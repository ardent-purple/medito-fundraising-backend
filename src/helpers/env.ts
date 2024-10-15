import { cleanEnv, num, str } from 'envalid'

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  PORT: num({ default: 6969 }),
  STRIPE_SECRET_API_KEY: str(),
})
