import React from "react";
import { SvgImage } from "../assets/icons";
import { EditorType } from "../types/EditorType";
import { NodeFilterable } from "../types/NodeFilterable";
import SvgText from "../assets/icons/SvgText";
import SvgFrame from "../assets/icons/SvgFrame";
import SvgGroup from "../assets/icons/SvgGroup";
import SvgAutoLayout from "../assets/icons/SvgAutoLayout";
import SvgInstance from "../assets/icons/SvgInstance";
import SvgComponent from "../assets/icons/SvgComponent";
import SvgShape from "../assets/icons/SvgShape";
import SvgRect from "../assets/icons/SvgRect";
import SvgCircle from "../assets/icons/SvgCircle";
import SvgLine from "../assets/icons/SvgLine";
import SvgPolygon from "../assets/icons/SvgPolygon";
import SvgStar from "../assets/icons/SvgStar";
import SvgVector from "../assets/icons/SvgVector";

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
        svg: <SvgImage />
    },
    {
        nameKey: "term:text",
        scope: "TEXT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgText />
    },
    {
        nameKey: "term:frame",
        scope: "FRAME",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgFrame />
    },
    {
        nameKey: "term:group",
        scope: "GROUP",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgGroup />
    },
    {
        nameKey: "term:autoLayout",
        scope: "AUTO_LAYOUT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgAutoLayout />
    },
    {
        nameKey: "term:instance",
        scope: "INSTANCE",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgInstance />
    },
    {
        nameKey: "term:component",
        scope: "COMPONENT",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgComponent />
    },
    {
        nameKey: "term:componentSet",
        scope: "COMPONENT_SET",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgComponent />
    },
    {
        nameKey: "term:allShape",
        scope: "ALL_SHAPE",
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgShape />
    },
    {
        nameKey: "term:rectangle",
        scope: "RECTANGLE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgRect />
    },
    {
        nameKey: "term:ellipse",
        scope: "ELLIPSE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgCircle />
    },
    {
        nameKey: "term:line",
        scope: "LINE",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgLine />
    },
    {
        nameKey: "term:polygon",
        scope: "POLYGON",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgPolygon />
    },
    {
        nameKey: "term:star",
        scope: "STAR",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgStar />
    },
    {
        nameKey: "term:vector",
        scope: "VECTOR",
        indented: true,
        indentLevel: 1,
        supportedEditorTypes: ["figma", "slides"],
        svg: <SvgVector />
    },
];