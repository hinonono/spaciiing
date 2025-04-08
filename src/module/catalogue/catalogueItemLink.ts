import * as util from "../util";

// 檢查是否啟用cataloge item link功能
// 啟用的話，當產生型錄物件時，可以透過alias物件來連結回參照的物件那裡
export function checkCatalogueItemLinkFeatureAvailability(): { availability: boolean, url: string | null } {
    //是否啟用cataloge item link功能
    const editorPreference = util.readEditorPreference();

    if (editorPreference.exampleFileUrl) {
        return { availability: true, url: editorPreference.exampleFileUrl };
    } else {
        return { availability: false, url: null };
    }
}