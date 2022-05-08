# Scripts Tampermonkey

## Add to Tampermonkey

Create new script on Tampermonkey's dashboard and copy the UserScript header to the new `.js` file. Be sure to change `<PATH>` for the cloned directory's path.

```javascript
// ==UserScript==
// @name         Script Name
// @namespace    http://tampermonkey.net/
// @version      Version
// @description  Description
// @author       Author
// @match        Site
// @icon         Icon
// @require      file://<PATH>/filename.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js // If it needs JQuery
// @grant        GM_* // If it needs a Greasemonkey GM_* function
// ==/UserScript==
```

## Notes

- **JQuery**: While editing on Tampermonkey, it would complain `$` didn't exist, so you had to add `/* globals $ */` after the UserScript header to remove the warning.


## About

Tampermonkey is a donationware userscript manager that is available as a browser extension. This software enables the user to add and use userscripts, which are JavaScript programs that can be used to modify web pages. Created by Jan Biniok (2010).
