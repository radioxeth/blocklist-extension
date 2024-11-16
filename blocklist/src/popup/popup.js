import {
    EXTENSION_ID,
    addRedirectRule,
    BLOCKED_PAGE,
    validateAndClean
} from '../utils.js'

const blockButton = document.getElementById('blockButton')
const optionsButton = document.getElementById('optionsButton')

blockButton.addEventListener("click", () => {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            console.error("No active tab found.")
            return
        }

        const tab = tabs[0]
        if (!tab.url) {
            console.error("Unable to retrieve the tab's URL. Ensure you have the 'tabs' permission.")
            return
        }
        const site = tab.url // Retrieve the URL of the active tab
        const cleanedURL = validateAndClean(site)
        console.log("cleanedURL", cleanedURL)
        if (cleanedURL) {
            chrome.runtime.sendMessage(EXTENSION_ID, addRedirectRule(cleanedURL), () => {
                // Redirect the user's tab to the blocked page
                chrome.tabs.update(tab.id, {
                    url: BLOCKED_PAGE
                })
                //close the popup
                window.close()
            })
        } else {
            console.error("Invalid URL:", site)
        }
    })
})

optionsButton.addEventListener("click", () => {
    chrome.runtime.openOptionsPage()
})