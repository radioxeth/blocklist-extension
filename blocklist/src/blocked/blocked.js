import { DEFAULT_REDIRECT } from '../utils.js'

const homeButton = document.getElementById('homeButton')
const backButton = document.getElementById('backButton')
const countSpan = document.getElementById('count')
const homeSpan = document.getElementById('home')

homeButton.addEventListener("click", () => {
    // go to home page
    chrome.storage.sync.get(["redirectUrl"], (result) => {
        const redirectUrl = result.redirectUrl || DEFAULT_REDIRECT
        window.location.href = redirectUrl
    })
})

backButton.addEventListener("click", () => {
    // go back
    window.history.back()
})


let count = 3


chrome.storage.sync.get(["redirectUrl"], (result) => {
    let appendCountSpan = document.createElement('span')
    appendCountSpan.innerText = count
    countSpan.appendChild(appendCountSpan)

    const interval = window.setInterval(() => {
        count--
        if (count === 0) {
            clearInterval(interval)
            const redirectUrl = result.redirectUrl || DEFAULT_REDIRECT
            window.location.href = redirectUrl
        }
        appendCountSpan.remove()
        appendCountSpan = document.createElement('span')
        appendCountSpan.innerText = count
        countSpan.appendChild(appendCountSpan)

    }, 1000)
})

chrome.storage.sync.get(["redirectUrl"], (result) => {
    const redirectUrl = result.redirectUrl || DEFAULT_REDIRECT
    const a = document.createElement('a')
    a.href = redirectUrl
    a.innerText = redirectUrl
    homeSpan.appendChild(a)
})