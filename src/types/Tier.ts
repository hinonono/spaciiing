export interface SavedClicksTierObj {
    tier: SavedClicksTier,
    requiredExp: number,
    max: number,
    translateKey: string
}

export type SavedClicksTier =
    "UNKNOWN" |
    "BRONZE" |
    "SLIVER" |
    "GOLD" |
    "PLATINUM" |
    "DIAMOND"