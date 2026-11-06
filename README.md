# Harbor Lights Studio website

Public website for Anchor: https://harborlightsstudio.ch

## Publishing

Upload the contents of this website package to the repository root and commit to `main`. GitHub Pages publishes the changes. Preserve the `CNAME` file containing `harborlightsstudio.ch` and the existing Pages/HTTPS settings. This package does not publish itself.

## Files

- `index.html` — homepage
- `privacy.html` — privacy notice and footer-linked Impressum
- `delete-account.html` — deletion instructions
- `impressum.html` — legacy redirect to the Impressum
- `help.html` — country-specific emergency actions and support resources
- `site-language.js` — English, German and French translations and language preference
- `help-resources.js` — generated, bundled support catalog
- `help.js` — help-country selection and resource display
- `CNAME` — GitHub Pages custom domain

## Languages and country

The first visit uses a supported browser language, otherwise English. A manual choice is remembered in local storage. Help country is a separate explicit choice, also stored locally; changing language never changes it. No GPS, IP lookup or network-country detection is used. URL parameters `lang` and `country` can preserve choices when browser storage is blocked.

Update translated text in all three language dictionaries and the English fallback in HTML when wording changes. Provider-page language does not promise counselling in that language.

## Help resources

Ten countries: CH, DE, AT, FR, LI, BE, LU, GB, US, CA. Emergency buttons come before the two visible support categories. Country-specific numbers must not be used as global defaults. Unsupported countries show local emergency-feature guidance without guessing a number.

The editable master `help-resources.json` and the generator `build-web-catalog.py` are in the separate Anchor Help Resources package. Update that master, verify official sources, then regenerate `help-resources.js` and update the app's bundled copy together. Keep stable IDs. Do not hand-edit only one app or website copy. Commands are documented in that package.

The list contains care directories, scheduled counselling and peer/community support. It is not a complete crisis-line directory. Exact hours, eligibility and charges may vary; the cards say so. The recorded review checked provider information and links, not service responsiveness. No test calls were made.

Review every three months and whenever a broken link or service change is reported. Review dates are content-review dates, not guarantees that a service is available at the moment of use. Update dates only after completing the relevant review.

## Privacy

No visitor analytics, advertising scripts or external fonts/media are added. GitHub may process technical logs as described in the privacy notice. External provider sites have their own policies. The site's language and help-country preferences are functional local storage, described in the notice.

## Checks and device review

JavaScript syntax, catalog consistency, translation coverage and simulated language/country selection are checked during preparation. Browser rendering and actual telephone/browser-app handoff still need a device check. Check phone and desktop layouts, all three languages, both support categories, saved selection, unsupported countries, blocked storage and the no-JavaScript fallback. Do not place test calls to emergency numbers.
