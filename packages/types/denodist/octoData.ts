export type OctoData = {
  revision: number
  assetBundleList: AssetBundle[]
  resourceList: Resource[]
}

type AssetBundle = {
  crc: number
  generation: string
  id: number
  md5: string
  name: string
  objectName: string
  size: number
  state: string
  type: string
  uploadVersionId: number
}

type Resource = {
  id: number
  name: string
  size: number
  md5: string
  objectName: string
  generation: string
  uploadVersionId: number
}
