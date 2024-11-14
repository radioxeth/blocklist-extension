// On startup, load saved user rules and apply them
chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup')
    chrome.storage.local.get("userRules", (data) => {
        const rules = data.userRules || []
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: rules,
            removeRuleIds: [] // Clear any other dynamic rules if needed
        })
    })
})

// Function to save a new rule to storage and apply it
const saveAndApplyRule = (rule) => {
    chrome.storage.local.get("userRules", (data) => {
        const rules = data.userRules || []
        rules.push(rule)

        chrome.storage.local.set({ userRules: rules }, () => {
            // Update dynamic rules with the new rule
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [rule],
                removeRuleIds: []
            })
        })
    })
}

// Example listener for messages from the options page (optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "addRule") {
        saveAndApplyRule(message.rule)
        sendResponse({ status: "success", message: "Rule added!" })
    }
})
