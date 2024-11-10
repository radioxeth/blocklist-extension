const homeButton = document.getElementById('homeButton')
const backButton = document.getElementById('backButton')
const countSpan = document.getElementById('count')
const homeSpan = document.getElementById('home')

homeButton.addEventListener("click", () => {
    // go to home page
    chrome.storage.sync.get(["redirectUrl"], (result) => {
        const redirectUrl = result.redirectUrl || "https://search.brave.com/"
        window.location.href = redirectUrl
    })
})

backButton.addEventListener("click", () => {
    // go back
    window.history.back()
})


let count = 3
countSpan.innerHTML = count

chrome.storage.sync.get(["redirectUrl"], (result) => {
    const interval = window.setInterval(() => {
        count--
        if (count === 0) {
            clearInterval(interval)
            const redirectUrl = result.redirectUrl || "https://search.brave.com/"
            window.location.href = redirectUrl
        }
        countSpan.innerHTML = count

    }, 1000)
})

chrome.storage.sync.get(["redirectUrl"], (result) => {
    const redirectUrl = result.redirectUrl || "https://search.brave.com/"
    const a = document.createElement('a')
    a.href = redirectUrl
    a.innerHTML = redirectUrl
    homeSpan.appendChild(a)
})