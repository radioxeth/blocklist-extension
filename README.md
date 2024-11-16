# Blocklist Extension

## Introduction
This is a simple extension to add websites to a list of domains that will redirect to a specified website.

You can easily block the website you are currently on with the click of a button. In the options you add or remove other websites. Additionally, you can set a custom redirect page in the blocklist options.

Our extension collects the following information locally:

1. User Rules for Blocking Websites:
   - The extension stores user-defined rules for blocking specific websites.
   - These rules include the URLs of websites and the conditions under which they are blocked.
   - Rules are stored locally using `chrome.storage.sync` to allow synchronization across your Chrome browsers logged into the same Google account.

2. Dynamic Rules Management:
   - Rules that define blocking or redirection are stored in Chrome’s internal `declarativeNetRequest` system.
   - These rules are only accessible and managed by the extension and are not transmitted to external servers.

## Loading into Chrome Extensions in Developer Mode
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable Developer mode by toggling the switch in the top right corner.
3. Click on the "Load unpacked" button.
4. Select the directory where you cloned the repository (`blocklist-extension`).
5. The extension should now be loaded into Chrome and visible in the list of extensions.

## Privacy
[Privacy Policy](./PRIVACY.md)

## License
[MIT License](./LICENSE.md)
