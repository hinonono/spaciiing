import {
  CollectionExplanationable,
  ColorCollection,
  NumberCollection,
} from "../types/ColorCollection";
import { EditorPreference } from "../types/EditorPreference";
import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";
import { Module } from "../types/Module";
import { ResizableNode } from "../types/NodeResizable";
import { semanticTokens } from "./tokens";
import loremText from "../assets/loremText.json";
import { CornerRadiusNode } from "../types/NodeCornerRadius";
import { SingleCornerRadiusNode } from "../types/NodeSingleCornerRadius";
import { EditorType } from "../types/EditorType";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Coordinates, Direction } from "../types/General";
import { CYStrokeCap } from "../types/CYStroke";

import { utils } from "./utils";

const isDevelopment = process.env.REACT_APP_ENV === "development";