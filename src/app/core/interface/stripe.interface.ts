export interface StripeConfig {
  theme: 'stripe' | 'night' | 'flat';
  appearance: {
    variables: {
      colorPrimary: string;
      colorBackground: string;
      colorText: string;
      colorDanger: string;
      fontFamily: string;
      spacingUnit: string;
      borderRadius: string;
    };
  };
}

