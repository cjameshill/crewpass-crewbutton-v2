import { createApp } from 'vue'
import App from "./App.vue";

let app = null;
const buttonId = "cp-agency-crew-profile-button";
console.log("vue loaded")
const setApp = () => {
    if (!app) {
        console.log('setting app')
        app = createApp(App);
        app.mount(`#${buttonId}`);
    } else {
        console.log("app already set")
    }
}

if (document.getElementById(buttonId)) {
    setApp();
} else {
    console.log("app not mounted: ", document.getElementById(buttonId));
    const targetNode = document;
    const config = { attributes: true, childList: true, subtree: true };

    const observerCallbackV2 = () => {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.log("cannot find button - still looking..")
        } else {
            console.log("button found")
            setApp();
        }
    }
    const observer = new MutationObserver(observerCallbackV2);
    observer.observe(targetNode, config);

}
