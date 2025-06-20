import React from "react";
import { SvgImage } from "../assets/icons";
import { EditorType } from "../types/EditorType";
import { NodeFilterable } from "../types/NodeFilterable";

import {
    SvgText,
    SvgFrame,
    SvgGroup,
    SvgAutoLayout,
    SvgInstance,
    SvgComponent,
    SvgShape,
    SvgRect,
    SvgCircle,
    SvgLine,
    SvgPolygon,
    SvgStar,
    SvgVector,
    SvgDrawArrows,
} from "../assets/icons/index";

interface FilterScopeItem {
    nameKey: string;
    scope: NodeFilterable;
    supportedEditorTypes: EditorType[];
    indented?: boolean;
    indentLevel?: number;
    svg?: React.ReactNode
}

export const FilterableScopesNew: FilterScopeItem[] = [
    {
        nameKey: "term:allOptions",
        scope: "ALL_OPTIONS",
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        nameKey: "term:image",
        scope: "IMAGE",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgImage color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:text",
        scope: "TEXT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgText color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:frame",
        scope: "FRAME",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgFrame color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:group",
        scope: "GROUP",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgGroup color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:autoLayout",
        scope: "AUTO_LAYOUT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgAutoLayout color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:instance",
        scope: "INSTANCE",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgInstance color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:component",
        scope: "COMPONENT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgComponent color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:componentSet",
        scope: "COMPONENT_SET",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgComponent color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:allShape",
        scope: "ALL_SHAPE",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgShape color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:rectangle",
        scope: "RECTANGLE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgRect color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:ellipse",
        scope: "ELLIPSE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgCircle color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:line",
        scope: "LINE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgLine color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:polygon",
        scope: "POLYGON",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgPolygon color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:star",
        scope: "STAR",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgStar color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:vector",
        scope: "VECTOR",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgVector color="var(--figma-color-text)" />
    },
    {
        nameKey: "term:arrowSpaciiing",
        scope: "SPACIIING_ARROW",
        supportedEditorTypes: ["figma"],
        svg: <SvgDrawArrows color="var(--figma-color-text)" />
    },
];