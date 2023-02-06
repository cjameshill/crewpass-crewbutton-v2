import { ref, computed, reactive, watch, onMounted } from "vue";
import { useGeneralComposable } from "./generalComposable";
import { useStorage } from "@vueuse/core";

const { remapData } = useGeneralComposable();
const logo =
    "https://storage.googleapis.com/crewpass-production-loginbutton/cp-icon.png";
const buttonText = ref("Approve With CrewPass");
const popupBaseUrl = ref(
    import.meta.env.VITE_POPUP_BASE_URL || "https://verify-dev.crewpass.co.uk"
);
const commitId = import.meta.env.VITE_COMMIT_ID || null;
const environment = import.meta.env.VITE_ENVIRONMENT || null;
const content = {
    buttonText: "Approve with CrewPass",
    pleaseWait: "Please wait...",
    statuses: {
        "not-checked": {
            buttonText: "Approve With CrewPass",
        },
        loading: {
            buttonText: "Please Wait..",
        },
        pending: {
            buttonText: "Pending",
        },
        approved: {
            buttonText: "Approved",
        },
        verified: {
            buttonText: "Approved",
        },
        declined: {
            buttonText: "Declined",
        },
        unchecked: {
            buttonText: "Unchecked",
        },
    },
};

const crewUserData = useStorage(`cp-crew-button-user`, {
    status: "not-checked",
});

const setContent = (status) => {
    console.log("setting content");
    crewUserData.value.status = status;
    buttonText.value = content.statuses[status || "not-checked"]?.buttonText;
};

let inputData = reactive({
    data: {},
});

const loading = ref(false);

const sanitizedParams = computed(() => {
    const keys = {
        cpPartner: "partner",
    };
    return remapData(keys, inputData.data);
});
const queryParams = computed(() => {
    const params = new URLSearchParams(sanitizedParams.value);
    return params.toString();
});
const popupUrl = computed(() => {
    return `${popupBaseUrl.value}?${queryParams.value}`;
});
const origin = window.location.origin;
const popupFullUrlObject = computed(() => {
    if (!popupUrl.value) return "";
    const url = new URL(popupUrl.value);
    url.searchParams.append("origin", origin);
    return url;
});
const popupFullUrl = computed(() => {
    if (!popupFullUrlObject.value) return "";
    return popupFullUrlObject.value?.toString();
});
const popupOrigin = computed(() => {
    if (!popupFullUrlObject.value || !popupFullUrlObject.value) return "";
    return popupFullUrlObject.value?.origin;
});
const buttonClick = () => {
    // loading.value = true;
    // setContent("loading");
    window.open(
        popupFullUrl.value,
        "cpAgencyCrewV2LoginPopup",
        "status=1, height=800, width=500, toolbar=0,resizable=0"
    );
};

// ** DEV DEBUGGING ONLY //** */

watch(popupFullUrl, (newValue) => {
    const message = {
        url: popupFullUrl.value,
    };
    window.postMessage(message);
});

// ** -------------------- //** */

watch(crewUserData, (newValue) => {
    console.log("crew user data updated: ", newValue);
    if (newValue.status) {
        setContent(newValue.status?.toLowerCase());
    }
});

const setButtonData = (dataset) => {
    for (let i in dataset) {
        inputData.data[i] = dataset[i];
    }
    if (dataset["cpPopupUrl"]) {
        popupBaseUrl.value = dataset["cpPopupUrl"];
    }
};

const setMessageResponse = (data) => {
    if (!data || !data.status) return null;
    crewUserData.value = {};
    for (const item in data) {
        crewUserData.value[item] = data[item];
    }
};

export function useButtonsComposable() {
    return {
        buttonText,
        logo,
        popupUrl,
        buttonClick,
        setContent,
        queryParams,
        sanitizedParams,
        inputData,
        loading,
        popupOrigin,
        setMessageResponse,
        setButtonData,
        crewUserData,
        commitId,
        environment,
    };
}
