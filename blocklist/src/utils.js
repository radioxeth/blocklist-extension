const EXTENSION_ID = chrome.runtime.id
const BLOCKED_PAGE = chrome.runtime.getURL("src/blocked/index.html")
const DEFAULT_REDIRECT = "https://search.brave.com/"

function cleanURL(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        console.error("Error cleaning URL:", url, error)
        return undefined
    }
}

function validateUrl(userInput, clean) {
    try {
        const allowedProtocols = ["http:", "https:"]

        const parsedUrl = new URL(userInput)

        // Validate protocol
        if (!allowedProtocols.includes(parsedUrl.protocol)) {
            throw new Error("Invalid protocol")
        }

        // Normalize and sanitize URL
        parsedUrl.hash = "" // Remove fragment
        parsedUrl.search = "" // Remove query
        const sanitizedUrl = parsedUrl.href
        console.log("Sanitized URL:", sanitizedUrl)

        return sanitizedUrl
    } catch (error) {
        console.error("Invalid or unsafe URL:", error)
        return undefined
    }
}

function validateAndClean(url) {
    return cleanURL(validateUrl(url))
}


function addRedirectRule(url, id) {
    return {
        type: "addRule",
        rule: {
            id: id,
            priority: 1,
            action: {
                type: "redirect",
                redirect: {
                    url: BLOCKED_PAGE // Redirect to the blocked page
                }
            },
            condition: {
                urlFilter: url,
                resourceTypes: ["main_frame"]
            }
        }
    }
}

export {
    cleanURL,
    addRedirectRule,
    validateUrl,
    validateAndClean,
    EXTENSION_ID,
    BLOCKED_PAGE,
    DEFAULT_REDIRECT
}