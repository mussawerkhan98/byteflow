import { getSection, getSiteFigures } from './cms'
import { mergeHomeBlock, type HomeBlock, type HomeBlockKey } from './home-content'
import { fillDeep } from './site-figures'

/**
 * A home page block as saved in the admin panel, over the website's defaults.
 * The defaults quote the site-wide figures too ({founded} and so on), so they
 * are filled in after the merge.
 */
export async function getHomeBlock(key: HomeBlockKey): Promise<HomeBlock> {
  const [saved, figures] = await Promise.all([getSection('home', key), getSiteFigures()])
  return fillDeep(mergeHomeBlock(key, saved), figures)
}
