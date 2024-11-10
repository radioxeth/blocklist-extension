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
    console.log("addCurrentButton clicked")
    console.log("chrome:", chrome)

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
        console.log("tabs:", tabs)
        console.log("site:", site)

        if (isValidURL(site)) {
            const cleanedUrl = cleanURL(site)
            console.log("cleanedUrl:", cleanedUrl)

            // Get existing blocked sites from storage
            chrome.storage.sync.get(["blocklist"], (result) => {
                const blocklist = result.blocklist || []
                console.log("blocklist:", blocklist)

                // Add the new site to the blocked list if not already present
                if (!blocklist.includes(cleanedUrl)) {
                    blocklist.push(cleanedUrl)
                    chrome.storage.sync.set({ blocklist }, () => {
                        console.log("blocklist updated:", blocklist)
                        // go to blocked page
                        const blockedPageUrl = chrome.runtime.getURL("src/blocked/index.html")
                        console.log("Blocked Page URL:", blockedPageUrl)
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
    console.log("optionsButton clicked")
    chrome.runtime.openOptionsPage()
})

