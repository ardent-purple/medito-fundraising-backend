import { Controller, Get } from 'amala'

@Controller('/payment-link')
export default class LoginController {
  @Get('/')
  async paymentLink() {
    return 'it works!'
  }
}
