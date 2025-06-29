
import * as CLExplanationWrapper from "./catalogueExplanationWrapper";
import * as CLLink from "./linker";
import * as Localizer from "./localizer";
import * as CLUtil from "./catalogueUtil";
import * as ValueResolver from "./valueResolver";
import { ExplanationItemKit } from "./item";

export const CatalogueKit = {
    explanationItemKit: ExplanationItemKit,
    // explanationItem: CLExplanationItem,
    wrapper: CLExplanationWrapper,
    // info: CLExplanationInfo,
    // preview: CLExplanationPreview,
    linker: CLLink,
    localizer: Localizer,
    util: CLUtil,
    valueResolver: ValueResolver,
}