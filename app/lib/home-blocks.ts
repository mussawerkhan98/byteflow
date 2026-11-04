import { getSection } from './cms'
import { mergeHomeBlock, type HomeBlock, type HomeBlockKey } from './home-content'

/** A home page block as saved in the admin panel, over the website's defaults. */
export async function getHomeBlock(key: HomeBlockKey): Promise<HomeBlock> {
  return mergeHomeBlock(key, await getSection('home', key))
}
