import { Injectable } from '@nestjs/common';
import * as PayNow from 'paynow';
@Injectable()
export class PaymentService {
  initializeSdk(mid: string, gatewayPublicKey: string): void {
    const PayNowSdk = PayNow.default;

    function initializeSdk(mid: string, gatewayPublicKey: string) {
      const options = {
        cardFieldId: 'card-number',
        cvvFieldId: 'card-cvv',
        // Add other field IDs as needed
      };

      PayNowSdk().on('ready', () => {
        // Set styling for the iframe fields
        // Add your styling here
      });

      PayNowSdk().on('validation', (inputProperties) => {
        // Handle validation
      });

      PayNowSdk().on('errors', (errors) => {
        // Handle errors
      });

      PayNowSdk().init(gatewayPublicKey, mid, options);
    }

    function getToken(): Promise<string | null> {
      // Implement the getToken function as per your needs
      return Promise.resolve(null);
    }
  }
}
