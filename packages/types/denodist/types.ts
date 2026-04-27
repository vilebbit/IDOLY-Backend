import {
  Message,
  MessageDetail,
  PhotoAbility,
  PhotoAllInOne,
  PhotoRecipe,
} from './ProtoMaster.ts'

/**
 * Describes a music chart.
 * @member id Music chart id
 * @member desc Description
 * @member beats Beat count of the chart
 * @member chart an 5-element array describing A or SP skill points.
 */
export type MusicChart = {
  id: string
  desc: string
  beats: number
  /**
   * Positive value for A skill;
   * negative value for SP skill at its absolute value
   */
  chart: Record<1 | 2 | 3 | 4 | 5, number[]>
}

/**
 * Describes a commu message sentence.
 * @member name Speaker name
 * @member text Text
 * @member advAssetId adv_asset_id
 * @member title Commu title
 */
export type CommuX = {
  name: string
  text: string
  advAssetId: string
  title: string
}

export type MessageX = Pick<Message, 'name' | 'id'> &
  Pick<MessageDetail, 'messageDetailId' | 'text' | 'characterId'> & {
    characterGroupId: Message['characterId']
  }

export type PhotoAioMeta = Omit<PhotoAllInOne, 'abilities'>

export type PhotoAioDetail = Pick<
  PhotoAllInOne,
  'id' | 'name' | 'assetId' | 'level' | 'rarity'
> & {
  abilities: Pick<
    PhotoAbility,
    'name' | 'description' | 'abilityType' | 'photoAbilityLevels' | 'skillId'
  >[]
}
