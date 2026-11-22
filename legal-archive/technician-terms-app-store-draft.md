# DRAFT: Technician App Terms, app-store additions (for legal review)

**Not published.** Drafted 2026-11-22 for `pages/technician-terms.jsx`. It would be a
new last section, "14. Getting the app from the App Store or Google Play",
after "13. How these terms fit together", so no section numbers change. It's
written in the page's plain style. Publishing it changes what technicians agree
to, so `VERSION` on the page, and the phone app's `SIGNIN_AGREEMENT_VERSION`,
would move together and the app would ask everyone to agree again.

Held until this section is approved (owner, 2026-11-22): in the Terms of
Service, Section 19 "No third-party beneficiaries" changes from "These Terms do
not create any third-party beneficiary rights." to "These Terms do not create
any third-party beneficiary rights, except as the Technician App Terms provide
for the app store that supplied the technician app." Both go live together.

## Checked against Apple's minimum terms for a custom licence agreement

These are what Apple requires when an app uses its own licence agreement
instead of Apple's standard one. The list below is what the page has today.

| Apple requires | On the page today |
|---|---|
| The agreement is between the user and us, not Apple, and Apple isn't responsible for the app | Partly. §1 says "between you and Poolnautics LLC", but Apple isn't named. |
| The licence is limited to Apple-branded devices the user owns or controls, as the App Store Usage Rules allow | Missing. The page grants no licence at all. |
| Apple has no maintenance or support obligation | Missing |
| We, not Apple, are responsible for warranties; Apple's only duty is to refund the price (the app is free) | Missing. §9 disclaims warranties but doesn't mention Apple. |
| We, not Apple, handle product claims (product liability, legal or regulatory non-conformance, consumer protection and privacy claims) | Missing |
| We, not Apple, handle third-party intellectual property claims | Missing |
| The user's statement that they aren't in an embargoed country and aren't on a U.S. restricted-party list | Missing |
| Our name, address and contact details for questions, complaints and claims | Partly. The header says "Provider: Poolnautics LLC", and §12 links to the Contact page, but there's no address. |
| The user follows third-party terms (such as their wireless carrier's) when using the app | Missing. Apple lists this too, though it wasn't in your list. |
| Apple and its subsidiaries are third-party beneficiaries who may enforce the agreement | Missing |

Whether these are needed depends on what App Store Connect uses for the app.
If the listing uses Apple's standard licence agreement, Apple's own terms
apply and the Technician App Terms don't have to include these. If the
Technician App Terms are set as the app's custom licence agreement, they do.
Our lawyer should confirm which applies.

**Google Play.** The app ships there (`android/launch`, Poolnautics 2.3.0).
As far as I know, Google Play has no equivalent list of required terms. Its
developer agreement doesn't ask for a third-party beneficiary clause. The draft
below includes one optional line naming Google, for clarity only. Our lawyer
should confirm.

## Draft section

**14. Getting the app from the App Store or Google Play**

**Your licence.** Poolnautics gives you a personal licence to use the app on a phone you own or control, only for work for your company and only while your company's account allows it. You can't transfer this licence. Don't copy, change, resell, or take apart the app.

**These Terms are with Poolnautics, not the app store.** These Terms are between you and Poolnautics, not Apple or Google. Poolnautics, not Apple or Google, is responsible for the app and what's in it.

**If you got the app from Apple's App Store.** These additional terms apply:

- **Devices.** You may use the app only on Apple-branded devices you own or control, and only as the Usage Rules in Apple's App Store Terms of Service allow.
- **Support.** Poolnautics provides any support for the app. Apple has no obligation to provide maintenance or support for it.
- **Warranty.** If a warranty applies to the app by law and isn't excluded by Section 9, Poolnautics, not Apple, is responsible for it. If the app doesn't meet a warranty that applies, you can tell Apple, and Apple will refund the price you paid for it, if any. The app is free. Apple has no other warranty obligation for the app.
- **Claims about the app.** Poolnautics, not Apple, is responsible for any claim by you or anyone else about the app or your use of it. That includes product liability claims, claims that the app doesn't meet a legal or regulatory requirement, and claims under consumer protection, privacy, or similar laws.
- **Intellectual property.** If someone claims that the app, or your use of it, infringes their intellectual property rights, Poolnautics, not Apple, is responsible for investigating, defending, settling, and resolving that claim.
- **Apple can enforce these Terms.** Apple and its subsidiaries are third-party beneficiaries of these Terms. Once you accept them, Apple has the right to enforce them against you as a third-party beneficiary.

**Where you can use the app.** You confirm that you are not located in a country subject to a U.S. government embargo, or that the U.S. government has designated as a "terrorist supporting" country, and that you are not on any U.S. government list of prohibited or restricted parties.

**Other services' terms.** When you use the app, you must also follow the terms of other services you use with it, such as your mobile carrier's.

**Contact for the app.** Questions, complaints, or claims about the app: Poolnautics LLC, 212 48th St N, St. Petersburg, FL 33713, legal@getpoolnautics.com.
