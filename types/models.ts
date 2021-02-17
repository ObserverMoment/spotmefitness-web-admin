export interface Equipment {
  id: string
  name: string
  altNames: string
  loadAdjustable: boolean
}

export interface Move {
  id: string
  name: string
  description: string
  searchTerms: string
  type: MoveType
  validRepTypes: Array<string>
  demoVideoUrl: string
  requiredEquipments: Array<Equipment>
  bodyAreaMoveScores: Array<BodyAreaMoveScore>
}

export interface MoveType {
  id: string
  name: string
  description: string
  imageUrl: string
}

export interface BodyAreaMoveScore {
  id: string
  bodyArea: BodyArea
  score: number
}

export interface BodyArea {
  id: string
  name: string
}