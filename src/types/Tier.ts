export interface SavedClicksTierObj {
    tier: SavedClicksTier,
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