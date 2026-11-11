import '../home.css'
import LegalPage, { legalMetadata } from '../components/LegalPage'

export function generateMetadata() {
  return legalMetadata('legal_terms')
}

/** Edited on the admin's Legal pages screen (Terms & Conditions). */
export default function TermsPage() {
  return <LegalPage contentKey="legal_terms" />
}
