# RDMP Resident App UI/UX PRD

**Document status:** Design and implementation handoff**Product:** Resilient Disaster-Management Platform — Resident Mobile App

**Derived from:** [1]

## 1. UX vision

The RDMP Resident App is a calm, decisive interface for moments when people are frightened, disconnected, or operating with limited time and battery. The experience must answer three questions immediately: **What is happening? What should I do now? Has my request or message reached anyone?**

The interface should feel trustworthy rather than alarmist during normal use, and transform into a high-contrast emergency mode when a verified life-safety alert is active. Critical paths must remain understandable and usable offline. The UI must always communicate whether information is current, cached, stale, locally saved, relaying, uploaded, or acknowledged.

> **Core UX rule:** Every screen has one primary action, one visible safety state, and one clear explanation of connectivity or freshness.

## 2. Design principles

| Principle | UI/UX implication |
| --- | --- |
| Life safety first | Put active alerts and SOS above secondary content; never bury the next action in navigation. |
| Offline confidence | Keep critical actions enabled offline and label local persistence clearly. |
| Trust and provenance | Show issuing authority, severity, issue time, expiry, verification, and freshness for alerts. |
| Calm hierarchy | Use restrained color and whitespace in normal mode; reserve red/orange treatment for verified danger. |
| Stress-friendly interaction | Large targets, short copy, one-handed layouts, limited choices, haptics, audio, and confirmation for destructive actions. |
| Privacy by design | Explain location scope at the point of action, not only in settings. |
| Inclusive by default | Support screen readers, dynamic type, high contrast, reduced motion, language selection, and icon-plus-text communication. |
| No silent failure | Delivery and sync states are visible, specific, and actionable. |

## 3. Visual direction

### 3.1 Brand personality

The visual language should be **reassuring, prepared, direct, and civic**. Avoid military styling, excessive dark interfaces, flashing animations, frightening imagery, or decorative complexity. The app should look credible enough for official emergency communication while remaining approachable for residents of different ages and literacy levels.

### 3.2 Color tokens

Colors are semantic tokens, not hard-coded screen colors. Every semantic state must also have an icon, label, or pattern so that color is never the only signal.

| Token | Suggested value | Use |
| --- | --- | --- |
| `color.brand.700` | Deep blue `#1455A0` | Primary navigation, trusted actions, links |
| `color.brand.900` | Navy `#0B2D4D` | Text on light surfaces, headers |
| `color.surface` | White `#FFFFFF` | Main background |
| `color.surfaceSubtle` | Cool gray `#F3F6F8` | Cards, grouped settings, map controls |
| `color.text` | Near black `#14212B` | Primary text |
| `color.textMuted` | Slate `#52616B` | Supporting text and metadata |
| `color.success` | Green `#167A4A` | Safe, sent, acknowledged |
| `color.warning` | Amber `#A15C00` | Stale, limited, attention needed |
| `color.danger` | Red `#B42318` | Critical alert, SOS, active danger |
| `color.info` | Teal `#006D77` | Offline, informational, map status |
| `color.emergencyBg` | Dark red `#5E1515` | Verified full-screen critical alert background |
| `color.focus` | Bright blue `#005FCC` | Keyboard/switch focus ring |

Emergency mode must pass contrast checks in both light and dark contexts. Do not use animated flashing as the only emergency cue.

### 3.3 Typography

Use a highly legible system sans-serif font with platform fallback. Recommended tokens are `Display 32/38`, `Title 24/30`, `Heading 20/26`, `Body Large 18/26`, `Body 16/24`, `Label 14/20`, and `Caption 12/18`. Body text must support dynamic scaling without clipping. Critical instructions should use sentence case, not all caps.

### 3.4 Spacing, shape, and touch

Use a 4-point spacing base with common spacing values of 8, 12, 16, 24, and 32 points. Cards use a 12-point radius; full-width emergency actions use a 16-point radius. Interactive controls must provide at least a 48-by-48-point target, with the SOS control visually larger. Keep primary actions within comfortable thumb reach on small devices.

## 4. Navigation model

The app uses four primary destinations: **Home**, **Map**, **Report**, and **Profile**. A persistent SOS action appears above the navigation bar on Home and Map and is available from critical alert detail. The SOS action must not be hidden by a bottom sheet or map gesture.

| Destination | Icon concept | Badge behavior |
| --- | --- | --- |
| Home | House plus shield | Shows count of active critical alerts |
| Map | Map pin | Shows nearby active hazard count when known |
| Report | Plus inside warning triangle | No badge; action opens report flow |
| Profile | Person/shield | Shows incomplete setup or consent attention |

The navigation bar must remain visible in normal mode. During a verified critical alert, use a full-screen emergency surface with a clear “Back to safety” or “View map” action rather than normal navigation chrome.

## 5. Global UI states

Every screen must support the following environment states without layout breakage.

| State | Visual treatment | Required copy pattern |
| --- | --- | --- |
| Online | Small green or blue connectivity indicator | “Online — data may be current” |
| Offline | Blue/gray indicator and compact banner | “Offline — essential tools still work” |
| Limited | Amber indicator | “Limited connection — updates may be delayed” |
| Syncing | Progress indicator that does not block use | “Syncing 3 items” |
| Sync attention needed | Amber/red status with action | “Some updates need attention” |
| Stale data | Timestamp plus warning icon | “Last updated 4 hours ago” |
| Locally saved | Checkmark/device icon | “Saved on this device” |
| Relaying | Radio/waves icon | “Relaying nearby” |
| Uploaded | Cloud-upload icon | “Sent to emergency service” |
| Acknowledged | Shield/checkmark icon | “Emergency service acknowledged” |

The status component must expose a meaningful accessible label, not only an icon or color.

## 6. Screen specifications

### 6.1 Onboarding

**Purpose:** Configure the minimum safety setup without requiring connectivity.

**Layout:** A short, step-based flow with a progress indicator, language selector at the top, and a “Skip for now” option for noncritical setup. Use illustrations only when they clarify the task.

**Steps:** Choose language; choose home or frequent area using a coarse map region; select offline map pack; configure alerts; configure location precision; enable or decline mesh participation; enable or decline background sync; add emergency contacts; review readiness checklist.

**Interaction rules:** Explain each permission in plain language before invoking the OS permission dialog. If a permission is declined, continue with reduced capability and explain what remains available. Show download size and Wi-Fi recommendation for map packs. The final screen confirms “Your essential tools are ready” and displays offline readiness status.

### 6.2 Home dashboard

**Purpose:** Provide a rapid safety summary and entry point to emergency actions.

**Order from top to bottom:** Current safety status; active critical alert card if present; connectivity/freshness banner; large SOS action; quick actions for Map, Report hazard, and I am safe; readiness card; recent alerts/activity.

**Safety status examples:** “No active emergency in your area,” “Evacuation alert active,” “Limited data — check local instructions,” or “Offline — essential tools available.” The wording must be localized and avoid implying complete safety when data is unavailable.

**Home empty state:** Show preparedness checklist, map-pack status, nearby shelter summary, and a clear explanation that alerts may still arrive through supported channels.

### 6.3 Critical alert screen

**Purpose:** Make verified urgent instructions impossible to miss.

**Visual treatment:** Full-screen high-contrast surface with severity icon, “Official emergency alert” label, issuing authority, short title, direct instruction, affected area, issued time, expiry, and data freshness. Use alarm and haptics when appropriate, with a visible “Mute sound” control that does not dismiss the alert.

**Primary action:** “View evacuation route” or “Find a shelter.” Secondary action: “I need help” opens SOS. Tertiary action: “More details.” Do not put unrelated navigation or promotional content on this screen.

**Trust treatment:** Show a verified badge only after signature/provider validation. If the alert is cached or offline, show “Cached from [time]” and never present it as live. Expired alerts remain available in history with an “Expired” state.

### 6.4 Alert history

Use a chronological list with severity icon, title, source, date, expiry state, and freshness. Filter by active, expired, and nearby. Each item has a large accessible row target. Duplicate alert IDs collapse into one item and display the latest status.

### 6.5 Map screen

**Purpose:** Help the resident understand the local situation and reach a safe destination offline.

**Map layers:** Current location when permitted; shelters; evacuation routes; blocked roads; flood/fire/structural hazard overlays; map-pack boundary and freshness. Use a clear legend that can be opened without leaving the map.

**Controls:** Recenter, search, layers, download/update region, route to nearest shelter, and SOS. Controls must remain usable in low-contrast outdoor conditions and while wearing gloves where possible.

**Offline banner:** A compact, nonblocking banner states “Offline map — last updated [time].” When a route is based on stale data, show a persistent route warning above the turn-by-turn panel.

**No-route state:** “A safe route could not be confirmed from available data.” Provide “View nearest known shelter,” “Choose another destination,” and “Request help.” Never use reassuring language that implies the route is safe when the data is incomplete.

### 6.6 Shelter list and detail

The list uses cards with name, distance, availability state, last updated time, and service chips. Cards must distinguish **Open**, **Possibly full**, **Closed**, and **Unknown** with text and icons.

The detail screen contains a map preview, address/coordinates where appropriate, distance, route action, last updated timestamp, total capacity, approximate occupancy, water/food/medical indicators, accessibility information, and a stale-data warning. Capacity must not be shown as live unless the data is current.

### 6.7 SOS flow

**Entry state:** A large red SOS button labeled “Request emergency help.” Supporting text says “Press and hold for 3 seconds.”

**Activation:** The resident presses and holds. A visible progress ring and haptic feedback confirm the gesture. At completion, show a three-second cancellation countdown. The resident can cancel without penalty before final confirmation.

**Confirmation:** Show location scope in plain language: “Share precise location with emergency responders for this rescue request?” Provide “Share precise location,” “Use approximate location,” and “Cancel.” If GPS is unavailable, explain that the last known location or a manual pin will be used.

**Optional evidence:** After SOS is created, offer “Add a short message,” “Add voice note,” and “Add photo.” These must never delay initial local SOS creation. The first confirmation screen must state that the SOS is already saved on the device.

**Success state:** Display a large status card: “SOS saved on this device.” Then show the current delivery state, last attempt, battery reminder, and “Keep this screen available.” Do not say “Help is coming” unless a responder acknowledgment exists.

### 6.8 SOS status

Use a vertical timeline with the delivery states: Saved on device, Searching for connection, Relaying nearby, Uploaded to emergency service, Acknowledged by emergency service, or Unable to deliver. Each state has an icon, plain-language explanation, timestamp when known, and accessible label.

If delivery fails, provide “Try again,” “Improve location,” and “Call local emergency number” where jurisdictional configuration supports it. The app must preserve the SOS record even if the resident exits the screen.

### 6.9 Report hazard

Use a two-stage form. Stage one asks for category and severity using large icon-and-label tiles. Stage two asks for location, optional description, and optional media. The “Save report” action must be available offline and must create a local record before upload.

Category tiles include Flood, Fire, Blocked road, Building damage, Injured person, Missing person, Unsafe shelter, Utility failure, and Other. Avoid requiring residents to understand responder terminology. Show a review summary before final save, including location precision and media count.

After submission, show “Report saved” with a delivery state and a link to “My reports.” The resident can edit local drafts but cannot edit responder operational status.

### 6.10 Safe check-in

The screen begins with the direct question: “Who should know you are safe?” Allow contact selection using large rows with relationship labels. A separate location-choice control offers **No location**, **Approximate area**, or **Precise location** with a short privacy explanation.

The confirmation screen previews the exact message and recipients. After submission, show per-recipient delivery states. Offline submission says “Saved. It will send when a connection or relay is available.”

### 6.11 Contacts

Use a simple list with name, relationship, delivery channel, and sharing scope. Add/edit uses progressive disclosure so that the first form is short. Destructive deletion requires confirmation. Display a reminder that adding a contact does not automatically share the resident’s status.

### 6.12 Profile, privacy, and permissions

Group settings into **Language**, **Accessibility**, **Notifications**, **Location sharing**, **Mesh participation**, **Background sync**, **Emergency contacts**, **Offline downloads**, and **Your data**. Each group shows current state in the list row so residents do not need to open every screen.

The privacy screen must explain routine coarse location, active-emergency precise location, automatic expiry, emergency override behavior, and data export/delete options in plain language. Use independent toggles and confirmation dialogs for each consent category.

### 6.13 Offline downloads and readiness

Show map-pack cards with region, download status, size, version, last updated, expiry/freshness, checksum/verification state, and storage impact. Use progress that survives app restart. If storage is insufficient, explain what can be removed and protect active emergency data from deletion.

The readiness checklist uses rows with completed, attention, and unavailable states. Suggested checks include emergency contacts, offline map, shelter data, first-aid guide, meeting point, notification permission, and battery guidance.

## 7. Component inventory

| Component | Required variants | Behavior |
| --- | --- | --- |
| `SafetyStatusBanner` | Online, Offline, Limited, Syncing, Attention | Always includes text and optional action |
| `CriticalAlertCard` | Active, Cached, Expired, Verified, Verification failed | Promotes only verified active alerts |
| `EmergencyActionButton` | SOS, View route, Find shelter | Large target, haptic feedback, accessible label |
| `DeliveryTimeline` | SOS, report, check-in | Shows current state and timestamps |
| `FreshnessLabel` | Current, stale, expired, unknown | Uses timestamp plus semantic state |
| `LocationScopeSelector` | None, coarse, precise | Explains who receives location and why |
| `ShelterCard` | Open, full/possibly full, closed, unknown | Shows capacity freshness and services |
| `HazardCategoryTile` | All report categories | Icon plus label; supports selection state |
| `OfflineMapCard` | Downloading, ready, stale, failed | Resume/retry without losing progress |
| `ConsentRow` | Enabled, disabled, unavailable | Links to explanation and impact |
| `AudioReadButton` | Alert, instruction, help text | Announces availability and playback state |
| `EmptyState` | No alerts, no shelters, no reports | Provides next useful action |
| `ErrorState` | Verification, sync, map, permission | Explains limitation and recovery action |

## 8. Motion, sound, and haptics

Normal mode uses short, subtle transitions under 200 milliseconds. Reduced-motion settings disable nonessential movement. Emergency mode uses a single entrance transition and does not flash continuously.

Critical alerts may use a high-priority sound and haptic pattern configured by jurisdiction and OS capabilities. SOS press-and-hold uses progressive haptics; successful local persistence uses one clear confirmation pulse. Sound can be muted where policy permits, but the alert must remain visually and haptically prominent. Every audio action has a text alternative.

## 9. Accessibility requirements

The UI must support screen readers, dynamic text scaling, minimum WCAG 2.1 AA contrast, high-contrast mode, reduced motion, switch/keyboard navigation where supported, and touch targets of at least 48 points. Screen-reader order should follow the visual decision sequence: danger, instruction, primary action, supporting details, secondary actions.

Accessibility labels must communicate state, not implementation. For example, label a delivery item “SOS saved on device, 10:42 AM” rather than “green check icon.” Form errors are announced immediately and placed adjacent to the affected field. Do not use maps as the only way to access shelter information; provide a list view with text.

## 10. Localization and content rules

All user-facing strings must be localization-ready and bundled for core emergency content. Avoid idioms, abbreviations, unexplained acronyms, and long paragraphs. Use simple verbs such as “Leave now,” “Get help,” “Find shelter,” and “Tell someone you are safe.” Dates, times, distance units, decimal formats, and emergency numbers must be locale-aware.

Translation keys should be stable and context-specific, for example `alert.critical.viewRoute`, `sos.savedOnDevice`, and `map.staleWarning`. Never concatenate translated fragments in code.

## 11. Interaction and copy standards

| Situation | Preferred copy | Avoid |
| --- | --- | --- |
| Offline | “Offline — essential tools still work.” | “No internet.” |
| SOS local save | “SOS saved on this device.” | “Help is on the way.” |
| Unknown shelter capacity | “Capacity unknown — last update unavailable.” | “Shelter available.” |
| Stale route | “This route uses older data. Check local instructions.” | “Safe route.” |
| Permission request | “Allow location to improve rescue accuracy.” | “Enable all permissions.” |
| Sync failure | “Saved here. We will try again.” | “Submission failed” without recovery |
| Alert source | “Issued by [authority]. Verified [time].” | “Official” without verification evidence |

## 12. Responsive and platform behavior

The design must work on narrow phones, large phones, and rugged tablets. On tablets, use a two-column layout for map/list and a centered max-width content column for forms. On small phones, stack controls and keep the SOS action reachable without scrolling.

Respect platform conventions for back navigation, permission dialogs, notification settings, safe-area insets, status bars, and haptics. Do not rely on background execution being guaranteed. The foreground UI must remain complete when background sync is unavailable.

## 13. Design-to-code handoff

Create a tokenized component library before building individual screens. Every component must define default, pressed, focused, disabled, loading, offline, stale, error, and high-contrast variants where relevant. Use fixture data for all emergency states so that developers can build and test without a live backend.

Recommended screen route names are `/onboarding`, `/home`, `/alerts`, `/alerts/:id`, `/map`, `/shelters/:id`, `/sos`, `/sos/:id`, `/report`, `/reports`, `/check-in`, `/contacts`, `/downloads`, `/profile`, `/privacy`, and `/accessibility`.

The UI layer should consume domain objects through hooks or view models such as `useSafetyStatus()`, `useActiveAlerts()`, `useShelters()`, `useCreateSOS()`, `useDeliveryTimeline()`, `useOutbox()`, and `useConsentSettings()`. Do not call network clients directly from presentational components.

## 14. UX acceptance criteria

| ID | Acceptance criterion |
| --- | --- |
| UX-01 | A resident can identify current safety and connectivity status from the first viewport of Home. |
| UX-02 | A critical verified alert opens as a full-screen, high-contrast experience with source, instruction, expiry, and one primary next action. |
| UX-03 | SOS can be started from Home and Map and requires a three-second hold plus visible cancellation opportunity. |
| UX-04 | After SOS confirmation, the UI states that the record is saved locally before showing any transmission claim. |
| UX-05 | Offline mode leaves SOS, cached alerts, maps, shelter list, hazard creation, and safe check-in usable. |
| UX-06 | Every delivery state is represented by text, icon, and accessible label; color is not the sole indicator. |
| UX-07 | Stale map, shelter, and alert data show a timestamp and warning before a resident acts on it. |
| UX-08 | A resident can select no location, coarse location, or precise location for a safe check-in and see who receives it. |
| UX-09 | A resident can complete hazard reporting with category, severity, location, optional text, and optional media while offline. |
| UX-10 | All core flows remain usable with large text, screen reader, high contrast, reduced motion, and supported launch languages. |
| UX-11 | The app never claims that emergency services received an SOS without an authenticated acknowledgment. |
| UX-12 | The same UI works with deterministic mock data and a developer-controlled offline simulation mode. |

## 15. Usability test plan

Test with residents who have different ages, languages, literacy levels, disabilities, and familiarity with emergency apps. Include low-end Android devices, iOS devices, small screens, tablets, low battery, bright outdoor light, dark environments, no GPS, airplane mode, intermittent connectivity, stale data, and interrupted app restarts.

The critical tasks are: identify what an alert requires, start and cancel SOS, confirm an SOS with approximate location, find a shelter without network, understand stale capacity, report a blocked road, send a safe check-in to one contact, and change precise-location consent. A task passes only when the participant can complete it and accurately explain the current delivery/freshness state.

## 16. Vibe-coding UI implementation prompt

> Build the RDMP Resident App UI as an accessible, offline-first cross-platform mobile interface. Create a tokenized design system with semantic colors, typography, spacing, large touch targets, high-contrast mode, dynamic type, screen-reader labels, localization-ready strings, and reduced-motion support. Implement Onboarding, Home, Alert History, Critical Alert, Map, Shelter List/Detail, SOS, SOS Status, Hazard Report, My Reports, Safe Check-In, Contacts, Offline Downloads, Profile, Privacy, and Accessibility screens. Use deterministic mock data and an offline simulation toggle. Home must show safety and connectivity state above secondary content. Critical verified alerts must render full-screen with source, severity, expiry, plain-language instruction, alarm/haptic hooks, and one primary action. SOS must use press-and-hold, save locally before any network action, and show delivery states without claiming responder acknowledgment prematurely. Maps and shelters must show freshness warnings. Keep network calls behind repository hooks and design every component for loading, offline, stale, error, focused, and high-contrast states. Include tests for screen-reader labels, dynamic text, airplane mode, interrupted local writes, stale data, duplicate alerts, SOS status transitions, and permission denial.

## References

[1]: /home/ubuntu/upload/resident_app_prd.md "RDMP Resident App Product Requirements Document"