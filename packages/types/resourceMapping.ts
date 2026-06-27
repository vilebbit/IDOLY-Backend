import { NoticeInfo } from './ProtoApi'
import type {
  ActivityAbility,
  Card,
  CardLevel,
  CardParameter,
  CardRarity,
  Character,
  Condition,
  Costume,
  CostumeType,
  Emblem,
  EventStory,
  ExtraStory,
  Gacha,
  Hair,
  LiveAbility,
  Message,
  MessageGroup,
  Music,
  MusicChartPattern,
  PhotoAbility,
  PhotoAbilitySet,
  PhotoAbilityTarget,
  PhotoAllInOne,
  PhotoRecipe,
  Skill,
  Story,
  StoryPart,
} from './ProtoMaster'

import { CommuX, MessageX } from './types'

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

export type ResourceMapping = {
  ActivityAbility: ActivityAbility[]
  Card: Card[]
  CardLevel: CardLevel[]
  CardParameter: CardParameter[]
  CardRarity: CardRarity[]
  Character: Character[]
  CommuX: CommuX[]
  Condition: Condition[]
  Costume: Costume[]
  CostumeType: CostumeType[]
  Emblem: Emblem[]
  EventStory: EventStory[]
  ExtraStory: ExtraStory[]
  Gacha: Gacha[]
  Hair: Hair[]
  LiveAbility: LiveAbility[]
  Message: Message[]
  MessageX: MessageX[]
  MessageGroup: MessageGroup[]
  Music: Music[]
  MusicChartPattern: MusicChartPattern[]
  Notice_notices: NoticeInfo[]
  Notice_malfunctionNotices: NoticeInfo[]
  Notice_prNotices: NoticeInfo[]
  Octo_assetBundleList: AssetBundle[]
  Octo_resourceList: Resource[]
  PhotoAbility: PhotoAbility[]
  PhotoAbilitySet: PhotoAbilitySet[]
  PhotoAbilityTarget: PhotoAbilityTarget[]
  PhotoAllInOne: PhotoAllInOne[]
  PhotoRecipe: PhotoRecipe[]
  Skill: Skill[]
  Story: Story[]
  StoryPart: StoryPart[]
}
