import '../home.css'
import LegalPage, { legalMetadata } from '../components/LegalPage'

export function generateMetadata() {
  return legalMetadata('legal_privacy')
}

/** Edited on the admin's Legal pages screen (Privacy Policy). */
export default function PrivacyPolicyPage() {
  return <LegalPage contentKey="legal_privacy" />
}
