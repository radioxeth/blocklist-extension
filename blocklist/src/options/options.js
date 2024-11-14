import { cleanURL, EXTENSION_ID } from '../utils.js'

const blocklistInput = document.getElementById('blocklistInput')
const blockButton = document.getElementById('blockButton')
const redirectInput = document.getElementById('redirectInput')
const redirectButton = document.getElementById('redirectButton')
const redirectDisplay = document.getElementById('redirectDisplay')

blockButton.addEventListener("click", () => {
    const cleanedUrl = cleanURL(blocklistInput.value)
    if (cleanedUrl) {
        saveRule(cleanedUrl)
    }
})

function updateBlocklist() {
    // Clear the existing list
    document.getElementById("blocklist-ul").innerHTML = ""

    // Fetch dynamic rules from declarativeNetRequest
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        // Populate the blocklist from dynamic rules
        for (const rule of rules) {
            if (rule.action.type === "redirect") {
                const site = rule.condition.urlFilter
                addSiteToList(site, rule.id) // Pass the site and rule ID
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

export function saveRule(url, callback) {
    // Add a new rule for the given URL
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleId = rules.length ? rules[rules.length - 1].id + 1 : 1
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    id: ruleId,
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: {
                            url: `chrome-extension://${EXTENSION_ID}/src/blocked/index.html`
                        }
                    },
                    condition: {
                        urlFilter: url,
                        resourceTypes: ["main_frame"]
                    }
                }
            ],
            removeRuleIds: [] // Don't remove any existing rules
        }, () => {
            // Update the UI with the new rule
            addSiteToList(url, ruleId)
        })
    })
}

function updateRedirectUrl() {
    chrome.storage.sync.get(["redirectUrl"], (result) => {
        const redirectUrl = result.redirectUrl ?? "https://search.brave.com/"

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
    const redirectUrl = redirectInput.value ?? "https://search.brave.com/"
    if (redirectUrl) {
        chrome.storage.sync.set({ redirectUrl }, () => {
            updateRedirectUrl()
        })
    }
})

updateBlocklist()
updateRedirectUrl()