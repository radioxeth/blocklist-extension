import { cleanURL, EXTENSION_ID } from "../utils.js"

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
        const cleanedUrl = cleanURL(site)
        if (cleanedUrl) {
            // Add a new rule to block the site and redirect
            chrome.declarativeNetRequest.getDynamicRules((rules) => {
                // Check if the site is already blocked by a rule
                const existingRule = rules.find((rule) => rule.condition.urlFilter === cleanedUrl)
                if (existingRule) {
                    console.log(`The site ${cleanedUrl} is already blocked.`)
                    return
                }

                // Add a new rule
                const ruleId = rules.length ? rules[rules.length - 1].id + 1 : 1 // Get the next available rule ID
                chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [
                        {
                            id: ruleId,
                            priority: 1,
                            action: {
                                type: "redirect",
                                redirect: {
                                    url: `chrome-extension://${EXTENSION_ID}/src/blocked/index.html` // Redirect to the blocked page
                                }
                            },
                            condition: {
                                urlFilter: cleanedUrl,
                                resourceTypes: ["main_frame"]
                            }
                        }
                    ],
                    removeRuleIds: [] // No rules to remove
                }, () => {
                    console.log(`The site ${cleanedUrl} has been blocked.`)

                    // Redirect the user's tab to the blocked page
                    chrome.tabs.update(tab.id, {
                        url: chrome.runtime.getURL("src/blocked/index.html")
                    })
                })
            })
        } else {
            console.error("Invalid URL:", site)
        }
    })
})


optionsButton.addEventListener("click", () => {
    chrome.runtime.openOptionsPage()
})

