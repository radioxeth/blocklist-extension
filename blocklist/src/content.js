// Load the blocked sites from storage
console.log('running content.js')

chrome.storage.sync.get(["blocklist"], (result) => {
    const blocklist = result.blocklist || []

    // Check if the current domain matches any in the blocked sites
    if (blocklist.map((url) => cleanUrl(url)).includes(cleanUrl(window.location.href))) {
        // Get the URL of the blocked.html file in the extension
        const blockedPageUrl = chrome.runtime.getURL("src/blocked/index.html")
        // Redirect the user
        window.location.href = blockedPageUrl
    }
})

// Function to clean a URL to its base domain
function cleanUrl(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        console.error("Error cleaning URL:", url, error)
        return undefined
    }
}
