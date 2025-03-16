// 客製化的Stroke架構

export interface CYStroke {
    color: string;
    opacity: number;
    strokeWeight: number;
    cornerRadius: number;
    startPointCap: StrokeCap;
    endPointCap: StrokeCap;
}