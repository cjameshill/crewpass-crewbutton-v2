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

const formDataKeys = ref([])
const formDataKeyBindings = {
    "crewpass-crew-name": "cpInputidCrewname",
    "crewpass-crew-crewUniqueId": "cpInputidCrewid",
    "crewpass-crew-email": "cpInputidCrewemail",
    "crewpass-crew-status": "cpInputidCrewstatus"
}
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
    crewUserData.value.updatedAt = new Date().toISOString();
    buttonText.value = content.statuses[status || "not-checked"]?.buttonText;
};

let inputData = reactive({
    data: {},
});

const loading = ref(false);

const sanitizedParams = computed(() => {
    const keys = {
        cpPartner: "partnername",
        cpAction: "action"
    };
    let remappedData = remapData(keys, inputData.data);
    remappedData.version = "v2";
    remappedData.partner = "agency";
    return remappedData;
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

const resetStatus = () => {
    crewUserData.value = {};
    crewUserData.value.status = "not-checked";
    loading.value = false;
}

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
        attachResponseToForm(newValue);
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

const createHiddenFormInput = (form, name = "", value = "") => {
    let input = document.getElementById(name);
    if (input) {
        console.log("Attribute already set - updating")
        input.setAttribute("value", value);
        return { name, value }
    }
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("id", name);
    input.setAttribute("name", name);
    input.setAttribute("value", value);
    form.appendChild(input);
    return { name, value }
}
const removeHiddenFormInput = (name = "") => {
    let input = document.getElementById(name);
    if (input) {
        input.remove();
        return { name }
    }
    console.log("Attribute already removed")
    return { name }
}

//*  Get form input id if using custom form input id
//- if not return default key * /

const getInputId = (key) => {
    if (!inputData.data) {
        return key;
    }
    return inputData.data[formDataKeyBindings[key]] || key;
}

const attachResponseToForm = (data = {}) => {
    if (!data || !data.formData) return null;
    const forms = document.querySelectorAll("form");
    for (let form of forms) {
        const formData = data.formData;
        for (const key in formData) {
            const inputId = getInputId(key);
            console.log("input id: ", inputId);
            formDataKeys.value.push(inputId);
            createHiddenFormInput(form, inputId, formData[key]);
        }
    }
};
const removeResponsesInForm = () => {
    const forms = document.querySelectorAll("form");
    for (let form of forms) {
        for (let name of formDataKeys.value) {
            removeHiddenFormInput(name);
        }
    }
};

const logout = () => {
    removeResponsesInForm();
    resetStatus();
}

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
        resetStatus,
        logout,
        attachResponseToForm,
        formDataKeys,
        popupFullUrlObject,
        popupFullUrl
    };
}
