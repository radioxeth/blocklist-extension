const blockButton = document.getElementById('blockButton')
const optionsButton = document.getElementById('optionsButton')

function isValidURL(url) {
    try {
        new URL(url) // Will throw an error if the URL is invalid
        return true
    } catch (e) {
        return false
    }
}

function cleanURL(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        return undefined
    }
}

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
        if (isValidURL(site)) {
            const cleanedUrl = cleanURL(site)
            // Get existing blocked sites from storage
            chrome.storage.sync.get(["blocklist"], (result) => {
                const blocklist = result.blocklist ?? []
                // Add the new site to the blocked list if not already present
                if (!blocklist.includes(cleanedUrl)) {
                    blocklist.push(cleanedUrl)
                    chrome.storage.sync.set({ blocklist }, () => {
                        // go to blocked page
                        const blockedPageUrl = chrome.runtime.getURL("src/blocked/index.html")
                        // Redirect the users tab to the blocked page
                        chrome.tabs.update(tab.id, {
                            url: blockedPageUrl
                        })
                    })
                }
            })
        } else {
            console.error("Invalid URL:", site)
        }
    })
})


optionsButton.addEventListener("click", () => {
    chrome.runtime.openOptionsPage()
})

