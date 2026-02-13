import { AppContextType } from "../AppProvider";
import { checkProFeatureAccessibleForUser, applyAspectRatio } from "./utilFrontEnd";
import * as pluginConfig from "../pluginConfig.json";
import { Dimension } from "../types/General";
import { AspectRatioOptions } from "../types/AspectRatio";
import {
    SvgAR16to9,
    SvgAR9to16,
    SvgAR4to3,
    SvgAR3to4,
    SvgAR3to2,
    SvgAR2to3,
    SvgAR1to1,
} from "../assets/icons";
import React from "react";

interface AspectRatioOptionsUI {
    name: AspectRatioOptions;
    svg: React.ReactNode;
    width: number;
    height: number;
    nameKey: string;
}

export function applyAspectRatioHandler(
    appContext: AppContextType,
    widthRatio: number,
    heightRatio: number,
    isCustom: boolean,
    lockedDimension: Dimension,
    isRealCall = false
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
                onProceed: () => {
                    applyAspectRatioHandler(
                        appContext,
                        widthRatio,
                        heightRatio,
                        isCustom,
                        lockedDimension,
                        true
                    )
                },
            });
            return;
        }
    }

    applyAspectRatio(widthRatio, heightRatio, isCustom, lockedDimension);
};

export const aspectRatioOptionsUI: AspectRatioOptionsUI[] = [
    {
        name: "16:9",
        svg: <SvgAR16to9 color="var(--figma-color-text)" />,
        width: 16,
        height: 9,
        nameKey: "module:aspectRatio_16_9",
    },
    {
        name: "9:16",
        svg: <SvgAR9to16 color="var(--figma-color-text)" />,
        width: 9,
        height: 16,
        nameKey: "module:aspectRatio_9_16",
    },
    {
        name: "4:3",
        svg: <SvgAR4to3 color="var(--figma-color-text)" />,
        width: 4,
        height: 3,
        nameKey: "module:aspectRatio_4_3",
    },
    {
        name: "3:4",
        svg: <SvgAR3to4 color="var(--figma-color-text)" />,
        width: 3,
        height: 4,
        nameKey: "module:aspectRatio_3_4",
    },
    {
        name: "3:2",
        svg: <SvgAR3to2 color="var(--figma-color-text)" />,
        width: 3,
        height: 2,
        nameKey: "module:aspectRatio_3_2",
    },
    {
        name: "2:3",
        svg: <SvgAR2to3 color="var(--figma-color-text)" />,
        width: 2,
        height: 3,
        nameKey: "module:aspectRatio_2_3",
    },
    {
        name: "1:1",
        svg: <SvgAR1to1 color="var(--figma-color-text)" />,
        width: 1,
        height: 1,
        nameKey: "module:aspectRatio_1_1",
    },
];