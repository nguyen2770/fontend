import ShowError from "../components/modal/result/errorNotification";
import ShowSuccess from "../components/modal/result/successNotification"

export const notiAction = (t, res, successLabel, errorLabel) => {
    console.log(res.code);
    if (res && res.code === 1) {
        ShowSuccess(
            "topRight",
            t("common.notifications"),
            successLabel || t("common.messages.success.successfully")
        );
    } else {
        ShowError(
            "topRight",
            t("common.notifications"),
            errorLabel || res.message || t("common.messages.error.failed")
        );
    }
}