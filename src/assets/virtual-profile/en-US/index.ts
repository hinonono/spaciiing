import { VirtualProfileGroupRaw } from './../../../types/VirtualProfile';
import { SupportedPresetVirtualProfileCategory } from "../../../types/VirtualProfile";

import { default as enUS_vpdata_personal } from "./personal.json";
import { default as enUS_vpdata_book } from "./book.json";
import { default as enUS_vpdata_creditCard } from "./creditCard.json";
import { default as enUS_vpdata_flight } from "./flight.json";
import { default as enUS_vpdata_movie } from "./movie.json";
import { default as enUS_vpdata_product } from "./product.json";
import { default as enUS_vpdata_stock } from "./stock.json";
import { default as enUS_vpdata_flow } from "./flow.json";

export const VPPreset_enUS: Record<SupportedPresetVirtualProfileCategory, VirtualProfileGroupRaw> = {
    PERSONAL: enUS_vpdata_personal,
    BOOK: enUS_vpdata_book,
    CREDIT_CARD: enUS_vpdata_creditCard,
    FLIGHT: enUS_vpdata_flight,
    MOVIE: enUS_vpdata_movie,
    PRODUCT: enUS_vpdata_product,
    STOCK: enUS_vpdata_stock,
    FLOW: enUS_vpdata_flow,
}