import { VirtualProfileGroupRaw } from './../../../types/VirtualProfile';
import { SupportedPresetVirtualProfileCategory } from "../../../types/VirtualProfile";

import { default as zhCN_vpdata_personal } from "./personal.json";
import { default as zhCN_vpdata_book } from "./book.json";
import { default as zhCN_vpdata_creditCard } from "./creditCard.json";
import { default as zhCN_vpdata_flight } from "./flight.json";
import { default as zhCN_vpdata_movie } from "./movie.json";
import { default as zhCN_vpdata_product } from "./product.json";
import { default as zhCN_vpdata_stock } from "./stock.json";

export const VPPreset_zhCN: Record<SupportedPresetVirtualProfileCategory, VirtualProfileGroupRaw> = {
    PERSONAL: zhCN_vpdata_personal,
    BOOK: zhCN_vpdata_book,
    CREDIT_CARD: zhCN_vpdata_creditCard,
    FLIGHT: zhCN_vpdata_flight,
    MOVIE: zhCN_vpdata_movie,
    PRODUCT: zhCN_vpdata_product,
    STOCK: zhCN_vpdata_stock
}