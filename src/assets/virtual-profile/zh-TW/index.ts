import { VirtualProfileGroupRaw } from './../../../types/VirtualProfile';
import { SupportedPresetVirtualProfileCategory } from "../../../types/VirtualProfile";

import { default as zhTW_vpdata_personal } from "./personal.json";
import { default as zhTW_vpdata_book } from "./book.json";
import { default as zhTW_vpdata_creditCard } from "./creditCard.json";
import { default as zhTW_vpdata_flight } from "./flight.json";
import { default as zhTW_vpdata_movie } from "./movie.json";
import { default as zhTW_vpdata_product } from "./product.json";
import { default as zhTW_vpdata_stock } from "./stock.json";

export const VPPreset_zhTW: Record<SupportedPresetVirtualProfileCategory, VirtualProfileGroupRaw> = {
    PERSONAL: zhTW_vpdata_personal,
    BOOK: zhTW_vpdata_book,
    CREDIT_CARD: zhTW_vpdata_creditCard,
    FLIGHT: zhTW_vpdata_flight,
    MOVIE: zhTW_vpdata_movie,
    PRODUCT: zhTW_vpdata_product,
    STOCK: zhTW_vpdata_stock
}