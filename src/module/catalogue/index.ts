
import * as Wrapper from "./wrapper";
import * as Linker from "./linker";
import * as Localizer from "./localizer";
import * as CLUtil from "./catalogueUtil";
import * as ValueResolver from "./valueResolver";
import { ExplanationItemKit } from "./item";

export const CatalogueKit = {
    explanationItemKit: ExplanationItemKit,
    wrapper: Wrapper,
    linker: Linker,
    localizer: Localizer,
    util: CLUtil,
    valueResolver: ValueResolver,
}