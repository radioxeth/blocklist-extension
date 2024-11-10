const blocklistInput = document.getElementById('blocklistInput')
const blockButton = document.getElementById('blockButton')
const redirectInput = document.getElementById('redirectInput')
const redirectButton = document.getElementById('redirectButton')
const redirectDisplay = document.getElementById('redirectDisplay')


blockButton.addEventListener("click", () => {
    //get blocklist from storage
    chrome.storage.sync.get(["blocklist"], (result) => {
        const blocklist = result.blocklist || []
        // Add the new site to the blocklist if not already present
        const newSite = cleanedUrl(blocklistInput.value)
        if (newSite && !blocklist.map((url) => cleanedUrl(url)).includes(newSite)) {
            blocklist.push(newSite)
            chrome.storage.sync.set({ blocklist }, () => {
                updateBlocklist()
            })

        }
    })
})

function updateRedirectUrl() {
    chrome.storage.sync.get(["redirectUrl"], (result) => {
        const redirectUrl = result.redirectUrl ?? "https://search.brave.com/"

        const a = document.createElement('a')
        a.href = redirectUrl
        a.innerHTML = redirectUrl
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

function cleanedUrl(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        console.error("Error cleaning URL:", url, error)
        return undefined
    }
}

function updateBlocklist() {
    // Get existing blocked sites from storage
    document.getElementById("blocklist-ul").innerHTML = ""
    chrome.storage.sync.get(["blocklist"], (result) => {
        const blocklist = result.blocklist || []
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
        li.remove()
        button.remove()
    })
}

updateBlocklist()
updateRedirectUrl()