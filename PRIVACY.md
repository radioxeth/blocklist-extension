### Data Privacy Policy for Google Developer Store

**Effective Date:** 2024-11-15

---

### 1. **Introduction**

This privacy policy explains how [Your Extension Name] ("we," "us," or "our") collects, uses, and protects your information when you use our Chrome extension available on the Google Chrome Web Store. Your privacy is important to us, and we are committed to ensuring the protection of your data.

---

### 2. **Data We Collect**

Our extension collects the following information locally:

1. **User Rules for Blocking Websites**:
   - The extension stores user-defined rules for blocking specific websites.
   - These rules include the URLs of websites and the conditions under which they are blocked.
   - Rules are stored locally using `chrome.storage.sync` to allow synchronization across your Chrome browsers logged into the same Google account.

2. **Dynamic Rules Management**:
   - Rules that define blocking or redirection are stored in Chrome’s internal `declarativeNetRequest` system.
   - These rules are only accessible and managed by the extension and are not transmitted to external servers.

---

### 3. **How We Use the Data**

The data collected by the extension is used solely to provide its core functionality. Specifically:

1. **Website Blocking**:
   - User-defined rules are applied dynamically to block or redirect websites as per your configuration.

2. **Rule Management**:
   - Rules are updated, stored, and synchronized across your devices using Chrome's `chrome.storage.sync`.

3. **User-Requested Actions**:
   - Rules are added, removed, or fetched based on user interaction with the extension.

---

### 4. **Data Storage**

1. **Local Storage**:
   - User-defined rules are stored in Chrome’s `storage.sync`, which is tied to your Google account for synchronization.

2. **Dynamic Rules**:
   - Dynamic rules are stored in Chrome's `declarativeNetRequest` system and are only accessible to the extension.

3. **No External Transmission**:
   - All data remains local to your browser or synchronized across your devices via Chrome’s native storage. No data is transmitted to or stored on external servers.

---

### 5. **Permissions**

The extension requires the following permissions to function:

1. **`storage`**:
   - To save and retrieve user-defined rules locally.

2. **`declarativeNetRequest`**:
   - To manage dynamic rules for blocking and redirecting websites.

3. **`tabs`**:
   - To interact with active browser tabs and apply rules dynamically.

4. **`host_permissions`**:
   - To access website URLs for applying the rules.

---

### 6. **User Control**

1. **Add or Remove Rules**:
   - You can add, view, or remove blocking rules through the extension’s interface.

2. **View Rules**:
   - The extension provides an option to view the current list of dynamic rules applied.

3. **Disable Extension**:
   - Disabling or uninstalling the extension removes all dynamic rules and user data stored in `chrome.storage.sync`.

---

### 7. **Data Security**

We implement the following measures to secure your data:
1. Data is only stored locally or synchronized using Chrome’s built-in systems.
2. Rules are sanitized to ensure safety and prevent malicious entries (e.g., preventing JavaScript URLs or invalid patterns).

---

### 8. **Third-Party Access**

The extension does not share your data with any third-party services, servers, or organizations. All data remains within your browser environment.

---

### 9. **Changes to this Privacy Policy**

We may update this privacy policy from time to time. Any changes will be posted on the Google Chrome Web Store listing page with the updated effective date.

---

### 10. **Contact Us**

If you have any questions about this privacy policy or the extension, please contact us at [Your Email Address].

---

This policy ensures transparency and aligns with Google's policies for extensions in the Chrome Web Store.