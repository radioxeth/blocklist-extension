import {
    EXTENSION_ID,
    DEFAULT_REDIRECT,
    cleanURL,
    addRedirectRule
} from '../utils.js'

const blocklistInput = document.getElementById('blocklistInput')
const blockButton = document.getElementById('blockButton')
const redirectInput = document.getElementById('redirectInput')
const redirectButton = document.getElementById('redirectButton')
const redirectDisplay = document.getElementById('redirectDisplay')

blockButton.addEventListener("click", () => {
    const site = blocklistInput.value
    const cleanedURL = cleanURL(site)
    if (cleanedURL) {
        saveRule(cleanedURL)
    } else {
        console.error("Invalid URL:", site)
    }
})

function updateBlocklist() {
    chrome.runtime.sendMessage(EXTENSION_ID, { type: "getRules" }, (response) => {
        // Redirect the user's tab to the blocked page
        if (response.success) {
            // Clear the existing list
            document.getElementById("blocklist-ul").innerHTML = ""
            for (const rule of response.rules) {
                if (rule.action.type === "redirect") {
                    const site = rule.condition.urlFilter
                    addSiteToList(site, rule.id) // Pass the site and rule ID
                }
            }
        }
    })
}

function addSiteToList(site, ruleId) {
    const li = document.createElement("li")
    addRemoveButton(li, ruleId)
    li.appendChild(document.createTextNode(site))
    document.getElementById("blocklist-ul").appendChild(li)
}

function addRemoveButton(li, ruleId) {
    const button = document.createElement("button")
    button.textContent = "remove"
    button.addEventListener("click", () => {
        removeSiteFromBlocklist(ruleId, li, button) // Remove using rule ID
    })
    li.appendChild(button)
}

function removeSiteFromBlocklist(ruleId, li, button) {
    // Remove the dynamic rule by ID
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [], // No new rules to add
        removeRuleIds: [ruleId] // Remove the specific rule
    }, () => {
        li.remove()
        button.remove()
    })
}

export function saveRule(url) {
    // Add a new rule for the given URL
    chrome.runtime.sendMessage(EXTENSION_ID, addRedirectRule(url), (response) => {
        // Redirect the user's tab to the blocked page
        updateBlocklist()
    })
}

function updateRedirectUrl() {
    chrome.storage.sync.get(["redirectUrl"], (result) => {
        const redirectUrl = result.redirectUrl ?? DEFAULT_REDIRECT

        const a = document.createElement('a')
        a.href = redirectUrl
        a.innerText = redirectUrl

        redirectDisplay.innerHTML = ""
        redirectDisplay.appendChild(a)
        redirectInput.value = redirectUrl
    })
}

redirectButton.addEventListener("click", () => {
    // set redirect url in storage
    const redirectUrl = redirectInput.value ?? DEFAULT_REDIRECT
    if (redirectUrl) {
        chrome.storage.sync.set({ redirectUrl }, () => {
            updateRedirectUrl()
        })
    }
})

updateBlocklist()
updateRedirectUrl()