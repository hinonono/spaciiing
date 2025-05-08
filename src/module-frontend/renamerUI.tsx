import React from "react";
import { SvgImage, SvgSave } from "../assets/icons";
import { NodeRenamable } from "../types/NodeRenamable";
import SvgText from "../assets/icons/SvgText";
import SvgFrame from "../assets/icons/SvgFrame";
import SvgGroup from "../assets/icons/SvgGroup";
import SvgShape from "../assets/icons/SvgShape";
import SvgRect from "../assets/icons/SvgRect";
import SvgCircle from "../assets/icons/SvgCircle";
import SvgLine from "../assets/icons/SvgLine";
import SvgPolygon from "../assets/icons/SvgPolygon";
import SvgStar from "../assets/icons/SvgStar";
import SvgVector from "../assets/icons/SvgVector";

interface RenamerScopeItem {
    nameKey: string;
    scope: NodeRenamable;
    indented?: boolean;
    indentLevel?: number;
    svg?: React.ReactNode
}

export const RenamableScopesNew: RenamerScopeItem[] = [
    {
        nameKey: "term:allOptions",
        scope: "ALL_OPTIONS"
    },
    {
        nameKey: "term:image",
        scope: "IMAGE",
        svg: <SvgImage color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:text",
        scope: "TEXT",
        svg: <SvgText color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:frame",
        scope: "FRAME",
        svg: <SvgFrame color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:group",
        scope: "GROUP",
        svg: <SvgGroup color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:allShape",
        scope: "ALL_SHAPE",
        svg: <SvgShape color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:rectangle",
        scope: "RECTANGLE",
        indented: true,
        indentLevel: 1,
        svg: <SvgRect color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:ellipse",
        scope: "ELLIPSE",
        indented: true,
        indentLevel: 1,
        svg: <SvgCircle color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:line",
        scope: "LINE",
        indented: true,
        indentLevel: 1,
        svg: <SvgLine color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:polygon",
        scope: "POLYGON",
        indented: true,
        indentLevel: 1,
        svg: <SvgPolygon color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:star",
        scope: "STAR",
        indented: true,
        indentLevel: 1,
        svg: <SvgStar color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:vector",
        scope: "VECTOR",
        indented: true,
        indentLevel: 1,
        svg: <SvgVector color="var(--figma-color-text)" />
    },
];