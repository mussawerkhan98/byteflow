import { serviceBlockKeys, serviceDefaults, type ServiceBlockKey } from '@/app/lib/service-page'
import { services } from '@/app/lib/services-data'

/**
 * A service page section's starting content, for the admin's "Service
 * pages" form to begin from before anything is saved (byteflow-admin reads
 * it rather than keeping its own copy). Public: it is the page's own
 * published wording. ?slug=cyber-security&section=features
 */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const page = services.find((service) => service.slug === params.get('slug'))
  const section = params.get('section') as ServiceBlockKey | null
  if (!page || !section || !(serviceBlockKeys as readonly string[]).includes(section))
    return Response.json({ error: 'Unknown service page or section.' }, { status: 404 })
  return Response.json(serviceDefaults(page)[section], { headers: { 'cache-control': 'public, max-age=300' } })
}
