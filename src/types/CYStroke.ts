// 客製化的Stroke架構
export interface CYStroke {
    color: string;
    opacity: number;
    strokeWeight: number;
    cornerRadius: number;
    startPointCap: CYStrokeCap;
    endPointCap: CYStrokeCap;
    dashAndGap?: number[];
}

export type CYStrokeCap = StrokeCap | "TRIANGLE_FILLED" | "CIRCLE_FILLED" | "DIAMOND_FILLED"