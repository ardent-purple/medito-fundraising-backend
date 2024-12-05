import env from '@/helpers/env'
import { Controller, Get, Query } from 'amala'
import axios from 'axios'

@Controller('/payment-link')
export default class PaymentLinkController {
  @Get('/')
  async paymentLink(
    @Query('currency') currency: string,
    @Query('amount') amount: number
  ) {
    const productName = 'Donation'
    const presetDonationCurrency = currency || 'gbp'
    const presetDonationInCents = amount || 30000 // 300$

    try {
      const responsePrice = await axios.post(
        'https://api.stripe.com/v1/prices',
        {
          currency: presetDonationCurrency,
          custom_unit_amount: {
            enabled: true,
            maximum: 100000,
            minimum: 100,
            preset: presetDonationInCents,
          },
          product_data: {
            name: productName,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const priceId = responsePrice.data.id

      const responsePaymentLink = await axios.post(
        'https://api.stripe.com/v1/payment_links',
        {
          currency: presetDonationCurrency,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          submit_type: 'donate',
          restrictions: { completed_sessions: { limit: 1 } },
        },
        {
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return responsePaymentLink.data.url
    } catch (error) {
      console.log(error.response)
    }
  }
}
