export interface NewsletterSubscribeRequest {
  email: string;
  name?: string;
  consentAccepted: boolean;
  consentVersion: string;
  privacyPolicyVersion: string;
  source?: string;
}

export interface NewsletterSubscribeResult {
  status: 'accepted' | 'not_configured';
  provider: string;
  message: string;
}
