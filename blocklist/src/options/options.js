const blocklistInput = document.getElementById('blocklistInput')
const blockButton = document.getElementById('blockButton')
const redirectInput = document.getElementById('redirect')
const redirectButton = document.getElementById('redirectButton')
const blocklist_ul = document.getElementById('blocklist-ul')


blockButton.addEventListener("click", () => {
    //get blocklist from storage
    chrome.storage.sync.get(["blocklist"], (result) => {
        const blocklist = result.blocklist || []
        console.log('blocklist:', blocklist)
        // Add the new site to the blocklist if not already present
        const newSite = cleanedUrl(blocklistInput.value)
        if (newSite && !blocklist.includes(newSite)) {
            blocklist.push(newSite)
            chrome.storage.sync.set({ blocklist }, () => {
                console.log("blocklist updated:", blocklist)
                updateBlockedList()
            })

        }
    })
})

redirectButton.addEventListener("click", () => {
    // set redirect url in storage
    const redirectUrl = cleanedUrl(redirectInput.value)
    if (redirectUrl) {
        chrome.storage.sync.set({ redirectUrl }, () => {
            console.log("Redirect URL updated:", redirectUrl)
        })
    }
})

function cleanedUrl(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        console.error("Error cleaning URL:", url, error)
        return undefined
    }
}

function updateBlockedList() {
    // Get existing blocked sites from storage
    chrome.storage.sync.get(["blocklist"], (result) => {
        const blocklist = result.blocklist || []
        console.log("Blocked sites:", blocklist)
        for (const site of blocklist) {
            addSiteToList(site, blocklist)
        }
    })
}

function addSiteToList(site, blocklist) {
    const li = document.createElement("li")
    addRemoveButton(li, site, blocklist)
    li.appendChild(document.createTextNode(site))
    document.getElementById("blocklist-ul").appendChild(li)

}

function addRemoveButton(li, site, blocklist) {
    const button = document.createElement("button")
    button.textContent = "remove"
    button.addEventListener("click", () => {
        removeSiteFromBlocklist(site, blocklist, li, button)
    })
    li.appendChild(button)
}

function removeSiteFromBlocklist(site, blocklist, li, button) {
    const index = blocklist.indexOf(site)
    blocklist.splice(index, 1)
    chrome.storage.sync.set({ blocklist }, () => {
        console.log("Blocked sites updated:", blocklist)
        li.remove()
        button.remove()
    })
}

updateBlockedList()