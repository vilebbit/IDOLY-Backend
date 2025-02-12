import type {
  ActivityAbility,
  Card,
  CardLevel,
  CardParameter,
  CardRarity,
  Character,
  Costume,
  Emblem,
  EventStory,
  EventStoryEpisode,
  Gacha,
  Hair,
  LiveAbility,
  Message,
  MessageGroup,
  Music,
  Skill,
  Story,
} from './ProtoMaster'
import type {
  CommuX,
  MessageX,
  MusicChart,
  PhotoAioDetail,
  PhotoAioMeta,
} from './types'
import type { OnlyOutput, InputAndOutput, MultiString } from './helpers'
import type { NoticeInfo } from './ProtoApi'

export type APIMapping = {
  ActivityAbility: InputAndOutput<{ id: string }, ActivityAbility>
  'Appearance/Costume': InputAndOutput<
    { characterId: string },
    Pick<Costume, 'id' | 'order' | 'name' | 'sdAssetId' | 'defaultHairId'>[]
  >
  'Appearance/Hair': InputAndOutput<
    { characterId: string },
    Pick<
      Hair,
      | 'id'
      | 'order'
      | 'name'
      | 'sdHairAssetId'
      | 'fittingCostumeId'
      | 'wearableCostumeIds'
      | 'notWearableCostumeIds'
    >[]
  >
  Card: InputAndOutput<
    { id?: string },
    Pick<
      Card,
      | 'id'
      | 'assetId'
      | 'name'
      | 'description'
      | 'characterId'
      | 'type'
      | 'initialRarity'
      | 'cardParameterId'
      | 'vocalRatioPermil'
      | 'danceRatioPermil'
      | 'visualRatioPermil'
      | 'staminaRatioPermil'
      | 'skillId1'
      | 'skillId2'
      | 'skillId3'
      | 'skillId4'
      | 'releaseDate'
      | 'stories'
      | 'liveAbilityId'
      | 'activityAbilityId'
    >[]
  >
  /**
   * CCID (Character-Card ID) is a unique ID for a card in the scope of a character.
   * It shall be as short as possible.
   */
  'Card/Id': OnlyOutput<
    Record<
      string,
      {
        ccid: number
        cardId: string
        nameJa: string
      }[]
    >
  >
  'Card/List': InputAndOutput<
    {
      rarity: string
      level: string
    },
    (Pick<
      Card,
      | 'id'
      | 'assetId'
      | 'name'
      | 'characterId'
      | 'type'
      | 'initialRarity'
      | 'releaseDate'
    > & {
      vocalPt: number
      dancePt: number
      visualPt: number
      staminaPt: number
    })[]
  >
  CardLevel: OnlyOutput<CardLevel[]>
  CardParameter: InputAndOutput<
    {
      level?: string
      id?: string
    },
    CardParameter[]
  >
  CardRarity: OnlyOutput<CardRarity[]>
  Character: InputAndOutput<
    {
      ids: MultiString
    },
    Pick<
      Character,
      | 'id'
      | 'characterGroupId'
      | 'order'
      | 'name'
      | 'enName'
      | 'cv'
      | 'age'
      | 'birthday'
      | 'height'
      | 'weight'
      | 'zodiacSign'
      | 'hometown'
      | 'favorite'
      | 'unfavorite'
      | 'profile'
      | 'altCharacters'
      | 'color'
      | 'isLeftHanded'
      | 'shortProfile'
      | 'threeSize'
      | 'catchphrase'
      | 'idiom'
    >[]
  >
  'Character/List': OnlyOutput<
    Pick<
      Character,
      'id' | 'order' | 'characterGroupId' | 'name' | 'enName' | 'color'
    >[]
  >
  'Costume/Chibi': InputAndOutput<
    { characterId: string },
    Pick<
      Costume,
      'id' | 'characterId' | 'order' | 'name' | 'sdAssetId' | 'defaultHairId'
    >[]
  >
  Emblems: InputAndOutput<
    { prefix: string },
    Pick<Emblem, 'name' | 'assetId' | 'isViewableInInactive' | 'description'>[]
  >
  EventStory: InputAndOutput<
    { id: string },
    | (Pick<EventStory, 'id' | 'name' | 'description' | 'order' | 'assetId'> & {
        episodes: Pick<EventStoryEpisode, 'episode' | 'storyId'>[]
      })
    | null
  >
  'EventStory/List': OnlyOutput<
    Pick<EventStory, 'id' | 'name' | 'description' | 'order'>[]
  >
  Gacha: OnlyOutput<
    (Pick<Gacha, 'name' | 'description' | 'gachaType' | 'bannerAssetId'> & {
      nowAfter: number
      nowBefore: number
      pickupCards: Pick<
        Card,
        'id' | 'name' | 'assetId' | 'characterId' | 'type'
      >[]
    })[]
  >
  LiveAbility: InputAndOutput<{ id: string }, LiveAbility>
  Message: InputAndOutput<
    { id: string },
    Omit<Message, 'unlockConditionId' | 'instantType' | 'rarityType'> | null
  >
  'Message/Group': InputAndOutput<
    { messageGroupId: string },
    { id: string; name: string }[]
  >
  MessageGroup: OnlyOutput<MessageGroup[]>
  Music: InputAndOutput<
    {
      id: string
    },
    Omit<Music, 'volumePermyriads' | 'vocalVolumePermyriads'>
  >
  MusicChart: InputAndOutput<
    {
      chartId: string
    },
    MusicChart
  >
  MusicChartList: OnlyOutput<
    {
      musicId: string
      title: string
      assetId: string
      charts: {
        id: string
        desc: string
      }[]
    }[]
  >
  Notice: InputAndOutput<
    {
      limit?: string
      offset?: string
      type: 'notices' | 'malfunctionNotices' | 'prNotices'
    },
    Pick<
      NoticeInfo,
      'id' | 'title' | 'linkDetail' | 'startTime' | 'listTitle'
    >[]
  >
  'Photo/AIO': InputAndOutput<{ id: string }, PhotoAioDetail>
  'Photo/AIO/List': InputAndOutput<
    {
      name: string
    },
    PhotoAioMeta[]
  >
  'Photo/AIO/Names': OnlyOutput<string[]>
  'Search/Commu': InputAndOutput<
    {
      q: string
    },
    CommuX[]
  >
  'Search/Message': InputAndOutput<{ q: string }, MessageX[]>
  Skill: InputAndOutput<
    {
      ids: MultiString
    },
    Skill[]
  >
  'Skill/All': OnlyOutput<Skill[]>
  'Skill/EffectTypes': OnlyOutput<string[]>
  Stamps: OnlyOutput<string[]>
  Story: InputAndOutput<
    { id: string },
    Pick<Story, 'name' | 'id' | 'sectionName' | 'description' | 'advAssetIds'>
  >
  'Story/Reverse': InputAndOutput<{ advAssetId: string }, { id: string }>
  Version: OnlyOutput<{
    version: string
  }>
}
