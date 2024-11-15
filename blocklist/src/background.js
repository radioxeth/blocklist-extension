// On startup, load saved user rules and apply them
chrome.runtime.onStartup.addListener(() => {
    console.log('service worker started')
    chrome.storage.sync.get("userRules", (data) => {
        const rules = data.userRules || []
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: rules,
            removeRuleIds: [] // Clear any other dynamic rules if needed
        })
    })
})


function updateStorageRules() {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        chrome.storage.sync.set({ userRules: rules }, () => {
            console.log("Rules saved to storage.")
        })
    })
}


// Example listener for messages from the options page (optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "addRule") {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            if (!message.rule.id) {
                message.rule.id = rules.length ? rules[rules.length - 1].id + 1 : 1 // Get the next available rule ID
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [message.rule],
                removeRuleIds: []
            }, () => {
                updateStorageRules()
                sendResponse({ success: true, message: `Rules successfully added rule.id=${message.rule.id}.` })
            })
        })
        return true
    }
})

// listener for message from the options page to remove a rule
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "removeRule") {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            const rule = rules.find((r) => r.id === message.ruleId)
            if (rule) {
                chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [],
                    removeRuleIds: [rule.id]
                }, () => {
                    updateStorageRules()
                    sendResponse({ success: true, message: `Rule successfully removed rule.id=${rule.id}.` })
                })

            } else {
                sendResponse({ success: false, message: `Rule not found rule.id=${message.ruleId}.` })
            }
        })
        return true
    }
})

// Listener to fetch the dynamic rules and send them to a page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getRules") {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            // Send the response back with the fetched rules
            sendResponse({ success: true, rules })
        })
        // Indicate that we will send the response asynchronously
        return true
    }
})
