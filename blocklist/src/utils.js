function cleanURL(url) {
    try {
        const curl = new URL(url)
        return `${curl.protocol}//${curl.hostname}`
    } catch (error) {
        console.error("Error cleaning URL:", url, error)
        return undefined
    }
}

const EXTENSION_ID = chrome.runtime.id

export { cleanURL, EXTENSION_ID }