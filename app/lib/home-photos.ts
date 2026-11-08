/**
 * The home page's photographs, one slot per place a picture appears.
 *
 * Every slot starts empty, so the page shows a styled placeholder that names
 * the shot it is waiting for (the brief). To fill a slot, put the file in
 * public/images/home/ and set its `src` (for example '/images/home/hero.webp')
 * and an `alt` that describes the photo. Nothing else needs to change.
 *
 * The briefs follow the art direction for the redesign: real people at real
 * workplaces, natural light, no floating screens or neon server rooms. They
 * are representative scenes, never presented as Byteflow staff or as photos
 * of a named client's project.
 *
 * Plain data, no React, so it can be read from server and client components.
 */

export type PhotoSlot = {
  /** '' until a photo is chosen: the placeholder shows instead. */
  src: string
  /** Describes the photo once there is one. */
  alt: string
  /** The shot to take or commission, shown on the placeholder. */
  brief: string
}

const slot = (brief: string, src = '', alt = ''): PhotoSlot => ({ src, alt, brief })

export const homePhotos = {
  hero: slot(
    'IT consultants and engineers collaborating in a modern Dubai IT operations office, natural window light, real workstations',
    '/images/home/hero.png',
    'An IT team reviewing work together at a laptop in a Dubai office overlooking the city skyline',
  ),
  about: slot(
    'An IT specialist helping a colleague at a modern office workstation, approachable and natural',
    '/images/home/about.png',
    'An IT specialist pointing out something on screen to a smiling colleague at her desk',
  ),
  /** "Where does your IT need help?", in scenario order. */
  needs: [
    slot(
      'IT engineers setting up the network in a new office',
      '/images/home/needs-1.webp',
      'A new office IT setup with a network rack, Wi-Fi router, CCTV camera, desk phone and laptop',
    ),
    slot(
      'A security professional reviewing the company infrastructure',
      '/images/home/needs-2.png',
      'A laptop showing a system recovery in progress beside server racks in an office',
    ),
    slot(
      'Web professionals building a website at their computers',
      '/images/home/needs-3.png',
      'A business professional reviewing performance reports and charts at a desk',
    ),
  ],
  /** Selected work, in project order: representative scenes, not the client's site. */
  work: [
    slot(
      'Network infrastructure being installed in a business office',
      '/images/home/work-1.png',
      'A modern IT support desk with a laptop, desk phone, headset and server rack in a Dubai office',
    ),
    slot(
      'A ransomware recovery scene',
      '/images/home/work-2.webp',
      'A laptop showing a ransomware alert next to a data recovery in progress in a server room',
    ),
    slot(
      'A website and analytics workspace',
      '/images/home/work-3.png',
      'A laptop showing website analytics charts on a desk in a bright office',
    ),
    slot(
      'A team planning a cloud migration',
      '/images/home/work-4.png',
      'A meeting room table with a laptop and reports, and a cloud migration plan drawn on the glass board',
    ),
  ],
  /** Insights, featured article first. */
  insights: [
    slot('An editorial workplace scene matching the article topic'),
    slot('Workplace scene for the article topic'),
    slot('Workplace scene for the article topic'),
    slot('Workplace scene for the article topic'),
    slot('Workplace scene for the article topic'),
    slot('Workplace scene for the article topic'),
  ],
}

/** The slot at `index`, or the last one when the list is shorter. */
export function nthPhoto(list: PhotoSlot[], index: number): PhotoSlot {
  return list[Math.min(index, list.length - 1)]
}
