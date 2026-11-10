import { getSection, getSiteFigures } from './cms'
import { mergeHomeBlock, type HomeBlock, type HomeBlockKey } from './home-content'
import { fillDeep } from './site-figures'

/**
 * A home page block as saved in the admin panel, over the website's defaults.
 * The defaults quote the site-wide figures too ({founded} and so on), so they
 * are filled in after the merge. The About Us page's blocks (about_*) are
 * saved on that page.
 */
export async function getHomeBlock(key: HomeBlockKey): Promise<HomeBlock> {
  const page = key.startsWith('about_') ? 'about-us' : 'home'
  const [saved, figures] = await Promise.all([getSection(page, key), getSiteFigures()])
  return fillDeep(mergeHomeBlock(key, saved), figures)
}
