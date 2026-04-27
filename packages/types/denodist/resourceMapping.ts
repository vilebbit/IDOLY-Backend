import { NoticeInfo } from './ProtoApi.ts'
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
} from './ProtoMaster.ts'

import { OctoData } from './octoData.ts'
import { CommuX, MessageX } from './types.ts'

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
  Gacha: Gacha[]
  Hair: Hair[]
  LiveAbility: LiveAbility[]
  Message: Message[]
  MessageX: MessageX[]
  MessageGroup: MessageGroup[]
  Music: Music[]
  MusicChartPattern: MusicChartPattern[]
  Notice: {
    notices: NoticeInfo[]
    malfunctionNotices: NoticeInfo[]
    prNotices: NoticeInfo[]
  }
  Octo: OctoData
  PhotoAbility: PhotoAbility[]
  PhotoAbilitySet: PhotoAbilitySet[]
  PhotoAbilityTarget: PhotoAbilityTarget[]
  PhotoAllInOne: PhotoAllInOne[]
  PhotoRecipe: PhotoRecipe[]
  Skill: Skill[]
  Story: Story[]
  StoryPart: StoryPart[]
}
