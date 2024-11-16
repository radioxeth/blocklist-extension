import {
    EXTENSION_ID,
    DEFAULT_REDIRECT,
    validateUrl,
    addRedirectRule,
    validateAndClean
} from '../utils.js'

const blocklistInput = document.getElementById('blocklistInput')
const blockButton = document.getElementById('blockButton')
const redirectInput = document.getElementById('redirectInput')
const redirectButton = document.getElementById('redirectButton')
const redirectDisplay = document.getElementById('redirectDisplay')
const blocklistTableBody = document.getElementById('blocklist-table-body')

blockButton.addEventListener('click', () => {
    const site = blocklistInput.value
    const cleanedURL = validateAndClean(site)
    if (cleanedURL) {
        saveRule(cleanedURL)
        blocklistInput.value = ''
    } else {
        console.error('Invalid URL:', site)
    }
})

function updateBlocklist() {
    chrome.runtime.sendMessage(EXTENSION_ID, { type: 'getRules' }, (response) => {
        if (response.success) {
            blocklistTableBody.innerHTML = ''
            response.rules.forEach((rule) => {
                addSiteToTable(rule.condition.urlFilter, rule.id)
            })
        }
    })
}

function addSiteToTable(site, ruleId) {
    const row = document.createElement('tr')

    // Website column
    const siteCell = document.createElement('td')
    siteCell.colSpan = 2
    siteCell.textContent = site
    row.appendChild(siteCell)

    // Remove button column
    const buttonCell = document.createElement('td')
    buttonCell.colSpan = 1
    const button = document.createElement('button')
    button.textContent = 'Remove'
    button.title = `Remove ${site} from blocklist`
    button.addEventListener('click', () => {
        removeSiteFromBlocklist(ruleId, row)
    })
    buttonCell.appendChild(button)
    row.appendChild(buttonCell)

    blocklistTableBody.appendChild(row)
}

function removeSiteFromBlocklist(ruleId, row) {
    chrome.runtime.sendMessage(EXTENSION_ID, { type: 'removeRule', ruleId }, (response) => {
        if (response.success) {
            row.remove()
        }
    })
}

export function saveRule(url) {
    chrome.runtime.sendMessage(EXTENSION_ID, addRedirectRule(url), (response) => {
        if (response.success) {
            updateBlocklist()
        }
    })
}

function updateRedirectUrl() {
    chrome.storage.sync.get(['redirectUrl'], (result) => {
        const redirectUrl = result.redirectUrl ?? DEFAULT_REDIRECT

        const a = document.createElement('a')
        a.href = redirectUrl
        a.innerText = redirectUrl
        a.title = redirectUrl

        redirectDisplay.innerHTML = ''
        redirectDisplay.appendChild(a)
        redirectInput.value = redirectUrl
    })
}

redirectButton.addEventListener('click', () => {
    const redirectUrl = validateUrl(redirectInput.value) ?? DEFAULT_REDIRECT
    if (redirectUrl) {
        chrome.storage.sync.set({ redirectUrl }, () => {
            updateRedirectUrl()
        })
    }
})

// add listener for input enter key in the blocklist input
blocklistInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        blockButton.click()
    }
})

// add listener for input enter key in the redirect input
redirectInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        redirectButton.click()
    }
})

updateBlocklist()
updateRedirectUrl()
