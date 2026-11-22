import React, { useEffect, useState } from 'react';

// Privacy Policy — starter content. Review with counsel before publishing.
// Find-and-replace placeholders if needed:
//   Poolnautics LLC               the business behind Poolnautics (a Florida LLC): launch only once
//                                 it's active on sunbiz.org, spelled exactly as filed
//   Florida                       governing state
//   November 22, 2026             updated date
//   privacy@getpoolnautics.com    contact email
//
// Subprocessors listed below reflect the current stack — confirm before going live
// and update if hosting/database/email providers change.

// HOLD (owner, 2026-11-17): the two "within about 30 hours" lines about fleet files in Section 10
// (Vehicle and fleet records) show only when this is true. Switch it on when the owner says so,
// together with FLEET_FILE_PURGE_LIVE in pages/terms.jsx.
const FLEET_FILE_PURGE_LIVE = false;

const SECTIONS = [
  { id: 'scope', title: 'Who This Applies To' },
  { id: 'data-collected', title: 'What Data We Collect' },
  { id: 'how-collected', title: 'How We Collect Data' },
  { id: 'use', title: 'How We Use Data' },
  { id: 'legal-basis', title: 'Legal Basis for Processing' },
  { id: 'sharing', title: 'How We Share Data — Subprocessors' },
  { id: 'security', title: 'Data Security' },
  { id: 'incident', title: 'Security Incident Notification' },
  { id: 'cookies', title: 'Cookies & Tracking' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'end-customer-rights', title: 'End Customer Rights' },
  { id: 'subscriber-rights', title: 'Subscriber Rights' },
  { id: 'state-rights', title: 'Your State-Specific Privacy Rights' },
  { id: 'children', title: 'Children' },
  { id: 'international', title: 'International Transfers' },
  { id: 'business-transfers', title: 'Business Transfers' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact' },
];

const PrivacyPage = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  // A link to a section (the Terms' /privacy#leaving, #retention) opens at it:
  // the page is drawn after the browser's own jump to the hash, so it never landed.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const headings = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
        {/* Title block */}
        <header style={{ maxWidth: 880, marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
            Privacy Policy
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            How Poolnautics collects, uses, and protects information from the pool service businesses that use our software and the customers they serve.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> May 15, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Updated:</strong> November 22, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Provider:</strong> Poolnautics LLC</span>
          </div>
        </header>

        {/* Two-column layout — sticky TOC on the left, body on the right */}
        <div className="terms-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 220px) minmax(0, 720px)',
          gap: 80,
          alignItems: 'start',
        }}>
          {/* Sticky TOC */}
          <nav className="terms-toc" style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13.5 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 12 }}>
              On this page
            </div>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} style={{
                padding: '6px 0',
                color: activeId === s.id ? 'var(--accent)' : 'var(--ink-4)',
                fontWeight: activeId === s.id ? 600 : 400,
                borderLeft: activeId === s.id ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: 10,
                marginLeft: -12,
                transition: 'color .15s ease, border-color .15s ease',
                lineHeight: 1.4,
              }}>{s.title}</a>
            ))}
          </nav>

          {/* Body */}
          <article style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-3)' }}>
            <Section id="scope" title="1. Who This Applies To">
              <p>This Privacy Policy describes how Poolnautics LLC ("Poolnautics," "we," "our," or "us") handles personal information in two distinct roles:</p>
              <ul>
                <li><strong>For Subscribers</strong> — the pool service businesses who hold accounts with us — Poolnautics acts as a <em>data controller</em>. We decide how and why your account information is collected and used.</li>
                <li><strong>For End Customers</strong> — the homeowners and property managers whose information is entered into Poolnautics by a Subscriber — Poolnautics acts as a <em>data processor</em>. The Subscriber is the data controller and decides how that information is used. We process End Customer data only on the Subscriber's behalf and according to their instructions.</li>
                <li><strong>For Subscriber personnel</strong> — the technicians, employees, independent contractors, and subcontractors who use the Poolnautics technician app for a Subscriber — Poolnautics acts as a <em>data processor</em>. The Subscriber decides whether the app's location features (described in Section 2) are used for each of its personnel, controls its personnel's data, and is responsible for giving them any notice, and getting any consent, the law requires. We process this data only on the Subscriber's behalf.</li>
              </ul>
              <p>If you are a technician or other Subscriber personnel with a question or request about your location or other data, please contact the pool service company you work for first. You can also contact us at <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a>; because the company controls this data, we will work with it to respond.</p>
              <p>If you are an End Customer with a privacy question or request, please contact the pool service company that holds your account. We forward any direct requests we receive to the relevant Subscriber. Text messages a Subscriber sends through Poolnautics go out through the Subscriber's own text-messaging provider. To stop receiving them, reply <strong>STOP</strong> to any such message: the Subscriber's provider stops the messages, and when it reports the opt-out, Poolnautics adds your number to that Subscriber's do-not-text list. For help with a Subscriber's messages, contact that Subscriber.</p>

              <h3 style={subHeadStyle}>Our Role Under U.S. State Privacy Laws (CCPA / CPRA and Similar)</h3>
              <p>For purposes of the California Consumer Privacy Act, as amended ("CCPA"), and analogous comprehensive privacy laws in other U.S. states, each Subscriber is the "business" with respect to the personal information of its End Customers, and Poolnautics is a "service provider" (or, where the applicable state uses different terminology, a "processor" or "contractor"). We process End Customer personal information only on the Subscriber's documented instructions and only for the limited and specified purposes set out in our agreement with the Subscriber and this Privacy Policy.</p>
              <p>As a service provider, we will not: (a) sell or share End Customer personal information; (b) retain, use, or disclose it for any purpose other than the business purposes specified in our agreement or as otherwise permitted by the CCPA; (c) retain, use, or disclose it outside of the direct business relationship between Poolnautics and the Subscriber; or (d) combine it with personal information we receive from or on behalf of any other source, except as permitted by Cal. Civ. Code § 1798.140(ag)(1) (for example, to detect security incidents or fraud). We assist Subscribers in responding to verified consumer rights requests through (i) a self-serve export, for the Subscriber's admins, of its customers, service history, invoices, payments, routes, and requests (see Section 12); (ii) self-serve in-app deletion of End Customer records that have no service, quote, or billing history; (iii) self-serve deletion of the Subscriber's whole account and its data (see Section 10); and (iv) a privacy support channel at <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a> for requests the in-app tools do not cover, including deleting records that have history. We will respond to a Subscriber's privacy support request within the timeframe reasonably needed to meet the Subscriber's own statutory response deadline.</p>
            </Section>

            <Section id="data-collected" title="2. What Data We Collect">
              <h3 style={subHeadStyle}>From Subscribers</h3>
              <ul>
                <li><strong>Account information:</strong> name, email address, phone number, organization name, business address.</li>
                <li><strong>Signing in with Google or Apple:</strong> office users can create an account or sign in with Google or Apple, through our authentication provider, Supabase. We then receive their name, email address, and an ID for that Google or Apple account. We never receive their Google or Apple password, and we don't get access to anything else in that account. If they use Apple's Hide My Email, we receive a relay address that Apple forwards to them, in place of their real email address.</li>
                <li><strong>Billing information:</strong> billing contact and payment method details. Card data is handled by Stripe — <strong>we never see, receive, or store full card numbers, CVV codes, or other sensitive payment details</strong>.</li>
                <li><strong>Usage data:</strong> features used, pages visited, IP address, browser and device characteristics, sign-in timestamps, and other operational metadata.</li>
                <li><strong>QuickBooks Online connection:</strong> if a Subscriber connects QuickBooks Online, the QuickBooks company's ID and name; the access tokens Intuit issues, stored encrypted, never shown, and renewed automatically while the Subscriber stays connected; the Subscriber's QuickBooks choices (start date, accounts, product or service, tax rate); and the QuickBooks IDs of the records Poolnautics has sent. We don't copy a Subscriber's books into Poolnautics.</li>
              </ul>

              <h3 style={subHeadStyle}>From End Customers (entered by Subscribers, stored by Poolnautics)</h3>
              <ul>
                <li>Name, email address, phone number, service address, billing address.</li>
                <li>Saved payment method metadata only — card brand, last four digits, expiry date. <strong>The full card lives on Stripe</strong>; we receive only the non-sensitive metadata Stripe returns after a save-card flow.</li>
                <li>Service history, water-chemistry readings, technician notes, and photos uploaded during service visits.</li>
                <li>Invoice, estimate, and payment history.</li>
              </ul>

              <h3 style={subHeadStyle}>From Subscriber Personnel Using the Technician App</h3>
              <p>Technicians use the Poolnautics mobile app on their phones. The Subscriber they work for decides which of the app's features are used for each technician, and we process the data on the Subscriber's behalf (see Section 1).</p>
              <p><strong>Location</strong>, used only for the three purposes below, and only with the technician's permission on their phone:</p>
              <ul>
                <li><strong>Service visits.</strong> When a technician sends a service report or a "can't service" report, the app records the phone's location at that moment (using the phone's standard accuracy setting, not high-accuracy GPS) to confirm the visit. This applies to every Subscriber. The location is saved with the report, and the service report the Subscriber emails its customer includes a link showing it on a map.</li>
                <li><strong>Mileage logging</strong>, only when the Subscriber turns it on for that technician. While the technician's route is under way, from the first service report of the day until the route is finished (or 9 PM at the latest), the app records the phone's precise location in the background to work out the miles driven between stops. The raw location points stay on the phone and are deleted from it once the day's miles are worked out. What the Subscriber receives is each trip between stops: where it started and ended (a customer stop or one of the Subscriber's business locations), when it left and arrived, and its miles. It also receives the time and customer of each service report, how long the vehicle stopped anywhere else for 10 minutes or more, and how many location points the phone reported as simulated. The Subscriber can have weekly mileage summaries emailed to addresses it chooses.</li>
                <li><strong>Drive history ("Show full drive")</strong>, only when a Subscriber admin turns it on for a specific technician, for up to 7 days at a time. It ends automatically, and an admin can turn it on again. During company work hours (currently 7 AM to 7 PM in the Subscriber's time zone), on any day in that period, the app records the phone's precise location, including while the app is closed if the technician has set location access to "Always." The Subscriber can see the route driven, where the vehicle stopped for 10 minutes or more, any times the phone stopped reporting its location, and how many location points the phone reported as simulated. Location points recorded outside work hours are not kept, although each day's drive includes the locations of the service reports sent that day. While drive history is on, the phone may check its approximate location at low power outside work hours, only to know when the work day starts; those checks are not recorded or sent.</li>
              </ul>
              <p>We do not collect location from the technician app for any other purpose, and we never sell location data or use it for advertising.</p>
              <p><strong>Technicians' choices.</strong> The app asks for the phone's permission before using location. Technicians can change or turn off the app's location access at any time in their phone's Settings; some features, such as visit confirmation and mileage logging, do not work without it. On Android phones, a notification shows while the app is recording location in the background. On iPhones, a blue location indicator shows when the app uses location in the background with location access set to "While Using"; with "Always," the app does not show it.</p>
              <p><strong>Simulated locations.</strong> When the phone reports that a location point recorded for mileage logging or drive history is simulated (for example, by an app that fakes the phone's location), the app does not use that point and records only how many such points there were. Android phones report this; iPhones do not. The count is shown to the Subscriber's admins with the technician's drive history.</p>
              <p>On iPhones, if the Subscriber requires a technician's location access to be set to "Always," the app first shows the technician an agreement screen describing how their location is used, and records their agreement: the date, the wording shown, the app version, the phone's platform, and a random ID for the app's installation on that phone. Technicians can still change the setting on their phone at any time. On Android phones, the app doesn't use or ask for "Always" location: it records location only while a notification is showing.</p>
              <p><strong>No location:</strong></p>
              <ul>
                <li><strong>App status ("phone health").</strong> A random ID for the app's installation on that phone (not a hardware or advertising ID); the platform; the app's version, build, and update; the phone's model and operating system version; whether location services and location, background location, precise location, and notification permissions are on; whether app notifications are on and the phone is registered for them; whether battery saver is on; free and total storage; how many service reports and photos are waiting to send, and since when; and how far the phone's clock is off. Kept until 60 days after the phone last reports.</li>
                <li><strong>A push notification token</strong>, so the Subscriber can send alerts to the technician's phone, such as new or updated work orders, route changes, truck check-in and oil-change reminders, and, if the Subscriber uses fleet features, reminders before the license plate of the company vehicle the technician drives expires.</li>
                <li><strong>Photos and readings the technician adds</strong>, such as photos on service reports and work orders, and odometer readings and photos on truck check-ins.</li>
              </ul>
              <p><strong>Vehicle and fleet documents.</strong> If the Subscriber uses fleet features, the technician or the Subscriber may add information about the vehicle the technician drives for work: its make, model, and license plate; the plate's expiry date; its current mileage, next oil change, and oil change history; notes; photos of the vehicle, its odometer, and its oil-change sticker; a photo of its registration; and its insurance card (a photo, or a PDF added by the Subscriber's office) with the insurance expiry date. We also record who added the insurance card and when. These documents can include names, addresses, vehicle identification numbers, and insurance policy numbers. The Subscriber can choose to require its technicians to add the vehicle's make, model, plate, and plate expiry before they start their route in the app; this is off unless the Subscriber turns it on.</p>
              <p><strong>Who can see it.</strong> This data is available to the technician's company in the Poolnautics web app: drive history to its admins, and mileage records, app status, and the dates of location agreements to its admins and managers. Each technician can see their own mileage in the app. Vehicle records and documents are available to the company's owners, admins, and managers, who can view, add, and replace them, and each technician can see and update their own in the app. The company's web app users are notified in the web app before a plate or insurance expires and when a technician adds a new insurance card; these notices give the technician's name and the dates, not the documents. We don't sell vehicle records or documents or share them with advertisers. A service visit's location also appears in the service report the company emails its customer, as described above. Poolnautics accesses this data only as needed to operate and support the service. It is stored with our hosting and database providers, and to show a drive on a map, the locations where the vehicle stopped are sent to our mapping provider (see Section 6).</p>
              <p><strong>Information stored on the technician's phone.</strong> So the technician can work without a signal, the app keeps a copy of their route on the phone, from the day before through the next six days. That copy includes each customer's name, address, phone number, email address, gate code or access notes, and service notes, along with their work orders. Service reports, photos, and other items saved without a signal stay on the phone until they are sent. The app also keeps the technician's own mileage for the last 14 days, and the current day's location points until that day's miles are worked out.</p>
              <p>If the Subscriber uses fleet features, the app also keeps the technician's vehicle record (make, model, plate, expiry dates, and mileage) and one copy each of the vehicle's insurance card and registration photo on the phone, so the technician can show them without a signal. The copies are updated when the technician opens the app's Fleet Management screen with a connection. If the Subscriber removes a document, its copy stays on the phone until the technician signs out or a new one is added. Like the app's other data, the copies may be included in the phone's backups, and anyone with access to the unlocked phone may be able to see them.</p>
              <p>If the technician adds the app's home-screen widgets, they show: in the Next Stop widgets, the next stop (the customer's name and address) and the stops after it (customer names and street addresses); in the Work Orders widget, open work orders (the type of work, the customer's name, the customer's full service address, and how many days each has been open) and a count of the work orders waiting on the office, which aren't listed; and in the Shopping widgets, the technician's shopping list (item names and quantities). On iPhones, while a route is under way, the Lock Screen and Dynamic Island can show the next stop's number, the customer's name and address, the work orders at that stop, and route progress. None of these show prices or gate codes. Because customers' information appears on the phone, including on its Lock Screen, technicians should protect their phone with a passcode and keep that information private.</p>
              <p>When a technician signs out of the app, it erases the saved route, the work orders, the widgets' information, and the vehicle record and the insurance card and registration copies from the phone, and the Lock Screen display ends. Anything not yet sent stays on the phone so the same technician can send it the next time they sign in, and the technician's recent mileage stays too; both are erased if the technician deletes their account.</p>
              <p id="deleting-technician-account" style={{ scrollMarginTop: 96 }}><strong>Deleting a technician account.</strong> Technicians can delete their account from the app's Settings. Their login is deleted. Their name is replaced with "Former technician" (or "Former team member" for other staff), and their email address, phone number, username, PIN, home address, personal notes, and shopping list are removed. Their push notification tokens are deleted, and anything on that phone not yet sent, along with their mileage stored there, is erased. The Subscriber's admins and managers are notified by email. The Subscriber keeps its business records of the technician's work under "Former technician": service reports, with their locations, and their photos until those are deleted (see Section 10); work orders; mileage records; vehicle records and documents; location agreements; drive history, until it is deleted 30 days after it was recorded; and app status, until it is deleted 60 days after the phone last reported. Deleting the account of the Subscriber itself is described in Sections 10 and 12. To ask for an account to be deleted without the app, see <a href="/delete-account" style={{ color: 'var(--accent)' }}>Delete your account</a>.</p>
              <p><strong>Deactivating a team member.</strong> An admin of the Subscriber can deactivate a technician or other team member from that person's page in Team. Their login is blocked, so they can no longer sign in to the Poolnautics web app or the technician app. Their open stops and open requests are unassigned, push notifications to their phone stop, and any unused invite or password-reset link is cancelled. Their name, email address, and phone number stay on the Subscriber's account, and their name stays on the work they already did, such as service reports and finished requests. These are kept while the person is deactivated, so the Subscriber can bring them back with Reactivate. They are deleted if the Subscriber removes the person from its team (Remove member), or when the Subscriber's account is deleted.</p>
              <p><strong>When the technician app stops working.</strong> If the Subscriber's plan ends, or its account is being deleted, or it deactivates a technician or removes them from its team, the technician app stops working for that technician the next time their phone contacts our server: they can't sign in, load their route, or start a stop. If the plan has ended, the app first tries to send a report for a visit already under way; otherwise, anything on the phone not yet sent is discarded. The app then signs the technician out and erases what it keeps on the phone for offline use: customers and their addresses, gate codes, photos, the saved route and work orders, unsent reports and report drafts, truck documents, mileage, and widgets. A phone that never contacts our server again can't be erased this way.</p>

              <h3 id="app-error-reports" style={subHeadStyle}>Error Reports and App Feedback (Poolnautics Technician App)</h3>
              <p><strong>Error reports.</strong> The Poolnautics app sends a report to Poolnautics so we can find and fix the problem when:</p>
              <ul>
                <li>the app crashes;</li>
                <li>a screen in the app shows an error;</li>
                <li>an upload fails and the app stops retrying it (for example, a service report that can't be sent);</li>
                <li>your route fails to download several times in a row while our server is answering; or</li>
                <li>signing in fails because of a problem on our side.</li>
              </ul>
              <p>Everyday connection trouble, such as having no signal, never sends a report on its own. A report includes:</p>
              <ul>
                <li>what went wrong (the error message and technical details, such as where in the app it happened, when, and, for an upload, what kind of upload it was and how many times it was tried);</li>
                <li>the app version and update, your phone's model and operating system version;</li>
                <li>the names of up to 8 app screens you opened recently (not what was on them);</li>
                <li>your account and company IDs, so we can tell which account had the problem.</li>
              </ul>
              <p><strong>What reports never contain.</strong> The app never attaches customer records, chemical readings, photos or the contents of service reports to a report or to feedback. Separately, email addresses, phone numbers, labeled gate and access codes (such as "gate code 1234"), links, photo file names and sign-in tokens are removed from error messages and from what you type before anything leaves our servers. Error messages are also cleaned on your phone before they're sent.</p>
              <p><strong>Feedback.</strong> In Settings › Help &amp; Feedback, you can report a problem with the app or suggest a feature. What you write goes to the Poolnautics team, along with your name and company so we can follow up with you, and the app version and update and your phone's model and operating system version. It doesn't go to your company's office. A problem report also includes the names of the app screens you opened recently, whether anything on your phone is waiting to upload, when your route last downloaded, and whether your phone was offline. Our error-monitoring provider receives only a reference number for a problem report, the app and phone details, the recent screen names, and how many uploads are waiting or couldn't be sent, with your account and company IDs; what you write goes only to our team's Slack. Please don't include customer details in what you write: names you type can't be removed automatically.</p>
              <p>Without a signal, error reports wait on your phone for up to 7 days, and feedback for up to 14 days, until they can be sent.</p>
              <p><strong>How we use it.</strong> We use error reports and feedback only to find and fix problems and to improve the app. We don't use them for advertising, we don't use them to track you across other apps or websites, and we don't sell them.</p>
              <p><strong>Where it goes.</strong> Error reports and feedback pass through our own server first. Error reports and problem reports then go to Better Stack, our error-monitoring provider. Feedback, and alerts about the most serious errors (the app crashing, a service report that won't send, or signing in failing on our side), are posted to our team's Slack; those alerts include the error, the screen it happened on, the company ID and the app version. Both providers act on our behalf and only as needed to provide these services (see Section 6).</p>
              <p><strong>How long we keep it.</strong> We keep error reports and feedback only as long as we need them to investigate and fix problems, and then delete them.</p>

              <h3 style={subHeadStyle}>From Website Visitors</h3>
              <ul>
                <li>IP address, browser type and version, pages visited, referring URL, and other standard server-log information used for security and basic analytics.</li>
                <li>What you enter in our website's forms when you contact us, request a demo, apply to be a partner, or reserve a spot: your name, business name, email address, phone number, and your answers, such as how many customers you have and your message, along with your country and the page you sent it from. We use it to reply to you, and when you reserve a spot, we add you to our waiting list so we can send you updates.</li>
              </ul>
            </Section>

            <Section id="how-collected" title="3. How We Collect Data">
              <ul>
                <li><strong>Directly from Subscribers</strong> — at account signup, when configuring billing or organization settings, and when entering customer records.</li>
                <li><strong>Automatically</strong> — through browser local storage for sign-in and UI preferences, and through server logs that record requests to the service.</li>
                <li><strong>From the technician app</strong> — on technicians' phones, as described in Section 2, depending on the features the Subscriber turns on and the permissions the technician allows on their phone.</li>
                <li><strong>From third parties</strong> — Stripe returns card metadata (brand, last four, expiry) after an End Customer saves a payment method. Identity-verification or anti-fraud signals may also be returned by Stripe.</li>
                <li><strong>From a connected QuickBooks Online</strong> — if a Subscriber connects QuickBooks Online, Poolnautics reads from it the company's name and settings, its products and services, accounts, and tax rates, and the customers and transactions it needs to match and update what it sends. It doesn't copy the Subscriber's books into Poolnautics.</li>
              </ul>
            </Section>

            <Section id="use" title="4. How We Use Data">
              <p>We use the information described above to:</p>
              <ul>
                <li>Operate the service — sending invoices, processing payments, dispatching routes, generating service reports.</li>
                <li>Provide the technician app features a Subscriber turns on — confirming visits, keeping mileage records, showing drive history, keeping vehicle records and documents in one place and showing them in the app, reminding technicians and the Subscriber before a license plate or insurance expires, and showing the Subscriber whether each phone's app is up to date and able to send — and sending alerts to technicians' phones.</li>
                <li>Communicate with Subscribers about account activity, billing, product updates, and support requests.</li>
                <li>Communicate with End Customers <strong>on a Subscriber's behalf</strong> — for example, sending invoice notifications, payment receipts, autopay decline notices, or service pause notices that the Subscriber has configured or chosen to send.</li>
                <li>Maintain and improve the service, including diagnosing errors, measuring performance, and developing new features.</li>
                <li>Detect, prevent, and respond to fraud, security incidents, and abuse.</li>
                <li>Comply with legal obligations, including tax and accounting rules.</li>
              </ul>
              <p>We do not sell personal information. We do not use End Customer data to advertise to End Customers.</p>
              <p>Data Poolnautics reads from or sends to a Subscriber's QuickBooks Online is used only to keep that Subscriber's QuickBooks matching what is recorded in Poolnautics. We do not sell it, use it for advertising, or use it to train AI models.</p>
            </Section>

            <Section id="legal-basis" title="5. Legal Basis for Processing">
              <p>Where the GDPR or similar laws apply, we rely on the following legal bases:</p>
              <ul>
                <li><strong>Contract performance</strong> — processing necessary to provide the service to Subscribers.</li>
                <li><strong>Legitimate interest</strong> — security, fraud prevention, service improvement, and operating our business.</li>
                <li><strong>Consent</strong> — for any marketing communications or non-essential cookies. You may withdraw consent at any time.</li>
                <li><strong>Legal obligation</strong> — for tax, accounting, and compliance record-keeping.</li>
              </ul>
            </Section>

            <Section id="sharing" title="6. How We Share Data — Subprocessors">
              <p>We share data with the following vendors ("subprocessors") who help us operate the service. We require each to maintain appropriate security and privacy practices.</p>
              <div style={{ marginTop: 18, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <SubprocessorRow
                  name="Stripe"
                  purpose="Payment processing, customer card storage, payouts, and Subscriber identity verification (KYC/KYB) for Subscribers' Stripe connected accounts. Stripe acts as an independent controller for personal information it collects to comply with its own anti-money-laundering, sanctions, fraud-prevention, and regulatory obligations; that processing is governed by Stripe's own privacy policy and the Stripe Services Agreement and Stripe Connected Account Agreement, not by this Privacy Policy."
                  shared="Full payment method data, customer name, billing/service address, charge amounts, invoice metadata; for Subscribers, the identity-verification information Stripe requires for Stripe Connect onboarding."
                  link="https://stripe.com/privacy"
                />
                <SubprocessorRow
                  name="Supabase"
                  purpose="Application database, authentication, and file storage."
                  shared="Account data, Subscriber-entered customer records, service history, and technician app data, including location records, the photos technicians add to service reports, work orders, and truck check-ins, and vehicle records and documents such as registration photos and insurance cards; and the data exports Subscribers make, until they are deleted after 7 days. Data is encrypted at rest."
                  link="https://supabase.com/privacy"
                />
                <SubprocessorRow
                  name="Resend"
                  purpose="Transactional email delivery (invoice notifications, receipts, account emails), and delivery of what people send through our website's forms, including our waiting list."
                  shared="Recipient email addresses and the content of transactional emails we send; what people enter in our website's forms; and the names and email addresses of people on our waiting list."
                  link="https://resend.com/legal/privacy-policy"
                />
                <SubprocessorRow
                  name="PostGrid"
                  purpose="Printing and mailing invoices and letters for Subscribers who use the Mail Service."
                  shared="Recipient names and mailing addresses, and the content of each document mailed."
                  link="https://www.postgrid.com/privacy-policy/"
                />
                <SubprocessorRow
                  name="Expo"
                  purpose="Push notifications to the technician app, and delivery of the app's updates. Expo delivers push notifications to iPhones through Apple's push notification service and to Android phones through Google's Firebase Cloud Messaging."
                  shared="Each technician phone's push notification token and the content of the alerts sent to it. Apple's and Google's push services also receive the phone's push token and the content of each alert, to deliver it."
                  link="https://expo.dev/privacy"
                />
                <SubprocessorRow
                  name="Railway"
                  purpose="Hosting for the Poolnautics web app, customer portal, and API, and for the server the technician app connects to."
                  shared="Data sent to and from the web app, customer portal, and API, and data the technician app sends and receives, including service reports, mileage records, drive history, app status, location agreements, and vehicle records and documents."
                  link="https://railway.com/legal/privacy"
                />
                <SubprocessorRow
                  name="Render"
                  purpose="Backup hosting for the server the technician app connects to, used if the main host is unavailable."
                  shared="Data the technician app sends and receives while it is in use, including service reports, mileage records, drive history, app status, location agreements, and vehicle records and documents."
                  link="https://render.com/privacy"
                />
                <SubprocessorRow
                  name="Inngest"
                  purpose="Running scheduled and background jobs, such as recurring billing and reminders."
                  shared="The record IDs each job needs, such as invoice, customer, and company IDs."
                  link="https://www.inngest.com/privacy"
                />
                <SubprocessorRow
                  name="Mapbox"
                  purpose="Maps, address lookup, and route planning in the Poolnautics web app, including showing a technician's drive history on a map."
                  shared="The map area being viewed; customer and business addresses being looked up, and the approximate location used to suggest nearby addresses; the locations of route stops being planned; and, for drive history, the locations where the vehicle stopped."
                  link="https://www.mapbox.com/legal/privacy"
                />
                <SubprocessorRow
                  name="Anthropic"
                  purpose="AI features in the Poolnautics web app: reading the customer lists and documents a Subscriber uploads so they can be imported, and drafting emails a Subscriber asks for. This is separate from any AI assistant a Subscriber connects to its own account, which is the Subscriber's own choice and provider."
                  shared="For customer import: the uploaded customer list or document and the names of the Subscriber's technicians. For email drafts: the points the Subscriber enters and its company name."
                  link="https://www.anthropic.com/legal/privacy"
                />
                <SubprocessorRow
                  name="GeoJS"
                  purpose="Finding an office user's approximate (city-level) location in the web app, so address suggestions start near them."
                  shared="The office user's IP address."
                  link="https://www.geojs.io/"
                />
                <SubprocessorRow
                  name="Better Stack"
                  purpose="Error monitoring for our web app, our app server, and the Poolnautics technician app."
                  shared="Details of errors: what went wrong, which part of the service, the app version, account and company IDs, and identifiers from connected services like Intuit (such as its error code and request ID). For errors in the web app, also the page or request address and recent activity on the page (such as pages visited and requests made) at the time of the error, with access links and sign-in details removed. No request contents, photos or readings, and from our app server, no customer details. From the technician app, error reports and problem reports, as described in Section 2: what went wrong, the app version and update, the phone's model and operating system version, the names of up to 8 recently opened app screens, and the account and company IDs; for problem reports, also a reference number and how many uploads are waiting or couldn't be sent, but not what the technician wrote. Customer records, readings, photos and service report contents are never included."
                  link="https://betterstack.com/privacy"
                />
                <SubprocessorRow
                  name="Slack"
                  purpose="Alerting our team to the most serious server and technician app errors, and delivering feedback sent from the technician app to the Poolnautics team."
                  shared="For server error alerts: the error, which part of the service, and the company ID. For technician app error alerts: the error, the screen it happened on, the company ID and the app version. For feedback: what the technician wrote, their name and company, and the app and phone details described in Section 2 (for problem reports, also recent screen names and whether anything on the phone is waiting to upload)."
                  link="https://slack.com/trust/privacy/privacy-policy"
                />
                <SubprocessorRow
                  name="Cloudflare"
                  purpose="DNS, CDN, web application hosting, DDoS protection, and bot protection for sign-up and our website's forms (Turnstile), including for the server the technician app connects to and for delivering photos added in the technician app."
                  shared="IP address, request metadata, and any data transmitted over the public site or between the technician app and its server, including photos."
                  link="https://www.cloudflare.com/privacypolicy/"
                />
              </div>
              <p style={{ marginTop: 18 }}>If we add or change a subprocessor, we'll update this list. We do not sell personal information to third parties.</p>

              <h3 id="connected-services" style={{ ...subHeadStyle, scrollMarginTop: 96 }}>Services a Subscriber Connects</h3>
              <p>When a Subscriber connects QuickBooks Online, Poolnautics sends to Intuit Inc., at the Subscriber's direction: End Customer names, email addresses, phone numbers, and billing and service addresses; invoices and their lines, discounts, fees, and sales tax; payments (the method, date, and reference, such as a check number or Stripe payment ID, but never card or bank account numbers); refunds and lost disputes; and the amounts and fees of the Subscriber's Stripe payouts, which Poolnautics reads from the Subscriber's Stripe account. Intuit is not a Poolnautics subprocessor: QuickBooks Online is a service the Subscriber chose, and Intuit handles this data under the Subscriber's agreement with Intuit and Intuit's <a href="https://www.intuit.com/privacy/statement/" target="_blank" rel="noreferrer noopener" style={{ color: 'var(--accent)' }}>Global Privacy Statement</a>.</p>
            </Section>

            <Section id="security" title="7. Data Security">
              <p>We take reasonable technical and organizational measures to protect personal information, including:</p>
              <ul>
                <li>HTTPS / TLS 1.2+ encryption for all traffic between users and Poolnautics.</li>
                <li>Stripe handles all sensitive cardholder data in a PCI-DSS Level 1 compliant environment. <strong>Poolnautics never sees or stores full card numbers.</strong></li>
                <li>Database encryption at rest, provided by our database host.</li>
                <li>QuickBooks access tokens are encrypted at rest (AES-256-GCM) and bound to the Subscriber's account.</li>
                <li>Row-level access controls so that staff at one Subscriber's organization cannot access another Subscriber's customer data.</li>
                <li>Internal access restrictions — only authorized Poolnautics personnel can access systems containing personal information, and only for legitimate operational reasons.</li>
              </ul>
              <p>No security measure is absolute. We cannot guarantee that personal information will never be compromised, but we work continuously to reduce risk.</p>
            </Section>

            <Section id="incident" title="8. Security Incident Notification">
              <p>If we become aware of an unauthorized access, use, or disclosure of personal information that materially affects you, we will notify affected Subscribers without undue delay, and in any event within the timeframes required by applicable law.</p>
              <p>Our notification will describe, to the extent then known: the nature of the incident, the categories of data involved, the likely consequences, and the steps we are taking in response. Where Subscriber action is required to mitigate risk to End Customers, we will provide the information Subscribers need to fulfill their own notification obligations as data controllers.</p>
            </Section>

            <Section id="cookies" title="9. Cookies & Tracking">
              <p>Poolnautics itself doesn't set cookies. We use your browser's storage and a few technologies from our providers:</p>
              <ul>
                <li><strong>Local storage for sign-in</strong> — the Poolnautics web app keeps you signed in by storing your session in your browser's local storage. It's required for the service to work.</li>
                <li><strong>Local storage for preferences</strong> — such as collapsed sidebar state or theme selection, on the web app and our website.</li>
                <li><strong>Our providers' cookies</strong> — Stripe may set cookies on payment pages to process payments and prevent fraud, and Cloudflare may set cookies to protect our sites and forms from bots and abuse.</li>
                <li><strong>Analytics</strong> — we may use basic, privacy-respecting analytics that don't use cookies to understand traffic patterns. We don't use advertising or cross-site tracking cookies.</li>
              </ul>
              <p>You can clear or block site data in your browser settings, but the web app needs local storage to keep you signed in, and payment pages may not work if Stripe's cookies are blocked.</p>
            </Section>

            <Section id="retention" title="10. Data Retention">
              <ul>
                <li><strong>Subscriber account data</strong> — the Subscriber's account, users, and settings, and everything it keeps in Poolnautics. Kept while the Subscriber has a plan, and deleted 60 days after its plan ends, or sooner if it asks, as described in "When a Subscriber leaves" below.</li>
                <li><strong>End Customer data</strong> — retained while the Subscriber's account exists. Deleted on the Subscriber's request, on the End Customer's request once forwarded to the Subscriber, or when the Subscriber's account is deleted. That includes the End Customer's invoices and payment records with the Subscriber: they are the Subscriber's records, and keeping any it needs, for taxes or otherwise, is the Subscriber's responsibility.</li>
                <li><strong>Service report photos</strong> — photos added to service reports are deleted about two months after the visit. Photos added to requests and quotes are kept with them.</li>
                <li><strong>Technician app data</strong> — drive history is deleted 30 days after it is recorded. App status is deleted once a phone has not reported for 60 days. Mileage records are kept as part of the Subscriber's business records for as long as its account exists, and are deleted on the Subscriber's request or when its account is deleted. A technician's location agreements are kept as a record with the Subscriber's account data, including after the technician deletes their account. A phone's push notification token is deleted when the technician signs out of the app, 90 days after it stops working, or after 180 days without use. Service report locations and the record of when drive history was turned on are kept with the Subscriber's other account data, as described above. Vehicle records are covered below.</li>
                <li><strong>Vehicle and fleet records</strong> — the vehicle records, truck check-ins (with their odometer and oil-change-sticker photos), oil change history, and documents described in Section 2. Files are kept in private storage that only the Subscriber's account can reach.
                  <ul style={{ marginTop: 8 }}>
                    <li>While the technician is on the Subscriber's account, their vehicle record, check-ins, oil change history, and documents are kept, so the Subscriber has its vehicle history. Check-in readings have no time limit; deleting them is the Subscriber's choice. Check-in photos are kept with their check-in.</li>
                    <li>A document that's replaced or removed is deleted from storage at once, unless another of the Subscriber's vehicles still uses it (one insurance card can cover the whole fleet).</li>
                    <li>When the Subscriber removes a technician from its team, their vehicle record, check-ins, and oil change history are deleted at once.{FLEET_FILE_PURGE_LIVE && ' Their documents and photos are deleted from storage within about 30 hours.'}</li>
                    <li>When a technician deletes their own account in the phone app, their sign-in and personal details are removed (see Section 2). The vehicle records they kept for the Subscriber stay with the Subscriber: the vehicle record, check-ins, oil change history, and its documents, including the registration and insurance card. They're deleted when the Subscriber removes the technician from its team, or when the Subscriber's account is deleted.</li>
                    <li>When a Subscriber's account is deleted, all of its vehicle records and files are deleted with it (see "When a Subscriber leaves" below).</li>
                    <li>Reminders about plate and insurance expiry are deleted 90 days after the date they were about. Oil change reminders are deleted 180 days after they were dealt with.</li>
                    <li>Notices to the Subscriber's office in the Poolnautics web app keep the latest 50; older ones drop off as new ones arrive.</li>
                    <li>On the technician's phone, the app keeps one copy each of the current insurance card and registration photo, so they open without a signal (see Section 2). They're deleted when the technician signs out.</li>
                    <li>Deleted vehicle and fleet records remain in our database backups until those expire, which is within 7 days.</li>
                  </ul>
                </li>
                <li><strong>Stripe records</strong> — payments are made to each Subscriber's own Stripe account, and the records Stripe holds are governed by Stripe's own retention policies. Except as described here, we cannot delete records from Stripe on your behalf; contact the Subscriber or Stripe directly for those requests. When a Subscriber's account is deleted, we delete its End Customers' customer records, including their saved cards and bank accounts, from its Stripe account so they can't be charged again, but we don't delete the Stripe account itself, which belongs to the Subscriber.</li>
              </ul>

              <h3 id="leaving" style={{ ...subHeadStyle, scrollMarginTop: 96 }}>When a Subscriber Leaves</h3>
              <p>A Subscriber's account becomes <strong>read-only</strong> when its plan ends: at the end of the period it paid for, if it cancels; 14 days after a subscription payment fails, if it's still unpaid (or sooner, if the subscription is ended or paused for non-payment); 7 days after its free trial ends, if it hasn't chosen a plan; or when Poolnautics ends its subscription under the <a href="/terms#termination" style={{ color: 'var(--accent)' }}>Terms of Service</a>.</p>
              <ul>
                <li><strong>Read-only for 60 days.</strong> The Subscriber's office users can view everything, and its admins can export it, but no one can change anything. No new invoices are created and automations stop, but invoices already sent keep working, including payment pages, autopay, and reminders. Its technicians can't use the technician app, which erases the Subscriber's information from their phones (see Section 2). Choosing a plan during the 60 days restores everything.</li>
                <li><strong>Reminders.</strong> 30 days and 7 days before the deletion date, we email the date to every admin and to the Subscriber's company email address.</li>
                <li><strong>Deleted after 60 days.</strong> 60 days after the account became read-only, or later if deletion waits (see below), we permanently delete the Subscriber's account and its data: its End Customers' data, service history, invoices and payment records, routes, requests, files (including photos, logos, mileage records, vehicle documents, and exports), and its users' logins. Its End Customers' customer records in its Stripe account are deleted too, including their saved cards and bank accounts. We then email its admins and its company email address that it's done.</li>
                <li><strong>Deleting sooner.</strong> Any admin of the Subscriber can delete its account and data at any time in the Poolnautics web app (Settings › Plan). To confirm, the admin types the company's name and enters a code we email to the Subscriber's company email address, not to the admin. Once confirmed, deletion is final and can't be undone: the Subscriber's plan ends at once, no one can sign in to the web app or the technician app, the technician app erases the Subscriber's information from technicians' phones and discards anything on them not yet sent (see Section 2), its admins are emailed, and the data is deleted, normally within a day. A Subscriber can also ask by emailing <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a>; we confirm the request with the same kind of code, sent to the company email address, and delete the data within 30 days.</li>
                <li><strong>When deletion waits.</strong> We delay deletion while a card dispute is open, a payment is still processing, or the Subscriber owes money on its Stripe account or we can't confirm that it doesn't, and while we need to keep the data for a legal reason, such as a legal request, or at the Subscriber's request while it arranges to come back. We delete it once the reason ends.</li>
                <li><strong>What we keep after deletion.</strong> Our own business records about the Subscriber: a record that its account existed and was closed (its name, email address, Stripe account and customer IDs, the dates, and why); each payment it took through Poolnautics, without the payer's name or any End Customer details (the amount, date, Stripe IDs, and Poolnautics' fee); our bills to it, including Mail Service bills and letters, without recipients' names or addresses; and sales commission records. We keep these for as long as we need them for tax and accounting, card disputes, legal claims, and our legal obligations, which is generally at least seven years. We also keep the list of email addresses that bounced or reported our emails as spam, without the Subscriber's name, to protect email delivery for every Subscriber.</li>
                <li><strong>Backups and our providers.</strong> Deleted data remains in our database backups until they expire, within 7 days, and copies of photos held in Cloudflare's network expire within 7 days. Our email, error-monitoring, background-job, and printing-and-mailing providers keep their own logs (such as the address an email went to) for their own retention periods; we don't delete those when a Subscriber's account is deleted.</li>
              </ul>
              <p><strong>QuickBooks Online.</strong> Disconnecting QuickBooks, in Poolnautics or in QuickBooks, revokes Poolnautics' access at Intuit and deletes the access tokens at once. Poolnautics keeps the list of records it sent (their QuickBooks IDs) so that reconnecting the same QuickBooks company doesn't send them twice; that list is deleted when the Subscriber's account is deleted or when the Subscriber connects a different QuickBooks company. Deleting a Subscriber's account also revokes Poolnautics' access to its QuickBooks.</p>
            </Section>

            <Section id="end-customer-rights" title="11. End Customer Rights">
              <p>If you are an End Customer (a homeowner or property manager receiving services from a Subscriber who uses Poolnautics):</p>
              <ul>
                <li>The Subscriber — the pool service company — is the controller of your personal information. To request access, correction, deletion, or export of your data, please contact them directly.</li>
                <li>If you contact Poolnautics with such a request, we will forward it to the relevant Subscriber within a reasonable time and assist them in fulfilling it.</li>
                <li>Where required by law (including under the GDPR, CCPA, or similar regimes), you have rights to access, correct, delete, restrict, or port your personal data, and to object to certain processing.</li>
              </ul>
            </Section>

            <Section id="subscriber-rights" title="12. Subscriber Rights">
              <p>Subscribers may at any time:</p>
              <ul>
                <li>Access and review the personal information we hold about their account.</li>
                <li><strong>Export their data.</strong> An admin can export the Subscriber's customers, service history, invoices and invoice lines, payments, routes, requests, catalog, and team as one file of spreadsheets (CSV), at any time, including while the account is read-only (Settings › Plan). The export doesn't include card or bank details, passwords, or photos. Because it holds the whole customer list, the admin confirms it with a code we email them; the Subscriber's other admins and its company email address are told who exported it and when; only the admin who asked can download it; the file is deleted after 7 days; and up to 5 exports can be made a day.</li>
                <li>Correct or update inaccurate account information.</li>
                <li>Delete their account and its data, in the web app or by asking us, as described in Section 10.</li>
                <li><strong>Unsubscribe from marketing communications</strong> at any time by using the unsubscribe link in any marketing email or by contacting <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a>. Transactional and account-security messages reasonably required to operate the Service cannot be opted out of as long as your account is active.</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a> or use the relevant in-app controls.</p>
            </Section>

            <Section id="state-rights" title="13. Your State-Specific Privacy Rights">
              <p>Depending on where you live, you may have additional rights under your state's privacy law. These rights typically include the right to access, correct, delete, and port the personal information we hold about you, and the right to opt out of certain processing.</p>

              <h3 style={subHeadStyle}>Categories of Personal Information We Collect (CCPA / CPRA Notice at Collection)</h3>
              <p>In the past twelve months, we have collected the following categories of personal information as defined under Cal. Civ. Code § 1798.140(v). The categories below apply to Subscribers and, where data is entered by a Subscriber, to End Customers. We have not "sold" or "shared" personal information in those terms' CCPA sense.</p>
              <ul>
                <li><strong>Identifiers</strong> — name, email address, postal address, phone number, IP address, account identifiers. <em>Sources:</em> directly from Subscribers; from Subscribers on behalf of End Customers; automatically from server logs. <em>Purposes:</em> account creation, service delivery, billing, communications, security. <em>Disclosed to:</em> the subprocessors listed in Section 6, or services a Subscriber connects, described in that Section.</li>
                <li><strong>Customer records / contact and account information</strong> (Cal. Civ. Code § 1798.80(e)) — billing contact, business name, service addresses, and, for vehicles used by Subscriber personnel, the insurance policy numbers and other details shown on insurance cards and registrations. <em>Sources, purposes, and disclosures:</em> same as Identifiers.</li>
                <li><strong>Commercial information</strong> — invoices, estimates, payment history, services purchased or provided. <em>Sources:</em> Subscribers; Stripe (payment status). <em>Purposes:</em> service delivery, billing, record-keeping. <em>Disclosed to:</em> Stripe; database and email subprocessors; or services a Subscriber connects (see Section 6).</li>
                <li><strong>Internet or other electronic network activity</strong> — browser type, device, pages visited, request metadata, sign-in timestamps. <em>Sources:</em> automatically from your interactions with the service. <em>Purposes:</em> security, fraud prevention, operations, basic analytics. <em>Disclosed to:</em> hosting and CDN subprocessors.</li>
                <li><strong>Geolocation information</strong> — approximate location derived from IP address, used for security, fraud prevention, and analytics; and, for Subscriber personnel using the technician app, precise location as described in Section 2, collected only with the technician's permission on their phone and processed on the Subscriber's behalf. <em>Disclosed to:</em> the database and hosting subprocessors listed in Section 6.</li>
                <li><strong>Professional or employment-related information</strong> — the business identity of the Subscriber and its staff (organization name, role), and the work records the technician app creates for a Subscriber (service visit locations, mileage records, drive history, location agreements, and app status), and vehicle and fleet documents (vehicle records, registration photos, and insurance cards).</li>
                <li><strong>Inferences</strong> — limited operational inferences (for example, payment-failure patterns used to trigger autopay suspension). We do not build advertising or behavioral profiles.</li>
              </ul>
              <p>We do not knowingly collect "sensitive personal information" as defined under the CCPA, other than (a) financial-account identifiers required to process payment, which Stripe handles directly, and (b) the precise location of Subscriber personnel collected through the technician app on a Subscriber's behalf, as described in Section 2. We use that location only to provide the features the Subscriber turns on, and not to infer characteristics about anyone. We do not use personal information for cross-context behavioral advertising.</p>
              <p><strong>Retention.</strong> We retain each category of personal information for the periods described in Section 10 (Data Retention), or for the criteria described in that Section where a fixed period cannot be stated in advance (for example, "for as long as the Subscriber's account exists"). These periods are based on the operational need to provide the service, applicable legal and tax record-keeping obligations, and the criteria set out in Cal. Civ. Code § 1798.100(a)(3).</p>

              <p>If you are a resident of <strong>California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia</strong>, you have rights under your state's comprehensive privacy law. To exercise these rights, contact <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a>. We will verify your identity before fulfilling a request and respond within the timeframe required by applicable law.</p>
              <p>For End Customer data entered by a Subscriber, the Subscriber is the controller. Direct your requests to them; we will assist where required by law.</p>
              <p><strong>We do not sell personal information.</strong> We do not engage in cross-context behavioral advertising or in "sharing" of personal information as those terms are defined under California law (Cal. Civ. Code § 1798.140).</p>
              <p><strong>California "Shine the Light" (Cal. Civ. Code § 1798.83).</strong> California residents may request information about disclosures of personal information to third parties for direct-marketing purposes. We do not currently make such disclosures.</p>
              <p><strong>Do Not Track.</strong> Our service does not respond to "Do Not Track" browser signals at this time, because no industry standard has been finalized for how those signals should be interpreted.</p>
              <p><strong>Appeals.</strong> If we deny your request, you may appeal by replying to our response. Where required by your state's law (for example, Virginia, Colorado, and Connecticut), we will inform you of the outcome within the timeframe set by that law.</p>
            </Section>

            <Section id="children" title="14. Children">
              <p>Poolnautics is not directed to, and we do not knowingly collect personal information from, anyone under 18 years of age. If you believe a minor has provided personal information to Poolnautics, please contact us and we will take steps to delete it.</p>
            </Section>

            <Section id="international" title="15. International Transfers">
              <p>Poolnautics is operated from the United States and our service is offered only to U.S.-based pool service businesses. If you access the service from outside the United States, personal information you provide will be transferred to and processed in the U.S., where data-protection laws may differ from those of your country.</p>
            </Section>

            <Section id="business-transfers" title="16. Business Transfers">
              <p>If Poolnautics is involved in a merger, acquisition, reorganization, bankruptcy, financing, or sale of all or a portion of its assets, personal information may be transferred to or accessed by the acquirer or successor entity as part of the transaction. We will notify affected Subscribers and post a notice on this page if such a transfer would materially change how personal information is handled. Any successor entity will be bound by this Privacy Policy with respect to personal information collected before the transfer, unless and until a new policy is published and notice is given.</p>
            </Section>

            <Section id="changes" title="17. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. If we make material changes, we'll notify Subscribers by email and post the updated policy on this page with a new effective date. For non-material changes (such as typo corrections or clarifications), we may update the policy without individual notice.</p>
            </Section>

            <Section id="contact" title="18. Contact">
              <p>For privacy questions, complaints, or requests, contact us at:</p>
              <p style={{ marginTop: 12 }}>
                <strong style={{ color: 'var(--ink-2)' }}>Poolnautics</strong><br/>
                <a href="mailto:privacy@getpoolnautics.com" style={{ color: 'var(--accent)' }}>privacy@getpoolnautics.com</a>
              </p>
            </Section>
          </article>
        </div>
      </div>
    </main>
  );
};

const subHeadStyle = {
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: '-0.005em',
  color: 'var(--ink-2)',
  marginTop: 24,
  marginBottom: 8,
};

const Section = ({ id, title, children }) => (
  <section id={id} style={{ scrollMarginTop: 96, marginBottom: 36 }}>
    <h2 style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--ink)',
      marginBottom: 12,
      lineHeight: 1.3,
    }}>{title}</h2>
    <div className="terms-body">{children}</div>
  </section>
);

const SubprocessorRow = ({ name, purpose, shared, link }) => (
  <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-2)' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>{name}</span>
      <a href={link} target="_blank" rel="noreferrer noopener" style={{ fontSize: 13, color: 'var(--accent)' }}>Privacy policy →</a>
    </div>
    <div style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-4)', lineHeight: 1.55 }}>{purpose}</div>
    <div style={{ marginTop: 4, fontSize: 13.5, color: 'var(--ink-5)', lineHeight: 1.55 }}>
      <strong style={{ color: 'var(--ink-4)' }}>Data shared:</strong> {shared}
    </div>
  </div>
);

export default PrivacyPage;
