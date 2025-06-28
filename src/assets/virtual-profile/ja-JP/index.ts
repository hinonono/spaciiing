import { VirtualProfileGroupRaw } from './../../../types/VirtualProfile';
import { SupportedPresetVirtualProfileCategory } from "../../../types/VirtualProfile";

import { default as jaJP_vpdata_personal } from "./personal.json";
import { default as jaJP_vpdata_book } from "./book.json";
import { default as jaJP_vpdata_creditCard } from "./creditCard.json";
import { default as jaJP_vpdata_flight } from "./flight.json";
import { default as jaJP_vpdata_movie } from "./movie.json";
import { default as jaJP_vpdata_product } from "./product.json";
import { default as jaJP_vpdata_stock } from "./stock.json";

export const VPPreset_jaJP: Record<SupportedPresetVirtualProfileCategory, VirtualProfileGroupRaw> = {
    PERSONAL: jaJP_vpdata_personal,
    BOOK: jaJP_vpdata_book,
    CREDIT_CARD: jaJP_vpdata_creditCard,
    FLIGHT: jaJP_vpdata_flight,
    MOVIE: jaJP_vpdata_movie,
    PRODUCT: jaJP_vpdata_product,
    STOCK: jaJP_vpdata_stock,
};