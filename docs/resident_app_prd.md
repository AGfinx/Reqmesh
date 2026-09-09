# Product Requirements Document: RDMP Resident App

**Document status:** Implementation-ready product specification**Product:** Resilient Disaster-Management Platform — Resident Mobile App

**Source design:** [1]

## 1. Product summary

The RDMP Resident App is an offline-first mobile safety companion for people preparing for, experiencing, and recovering from disasters. It gives residents four dependable capabilities: **receive trusted emergency alerts, request rescue, find a safe route or shelter, and communicate their safety status**. The app must continue performing core life-safety workflows when cellular service, Wi-Fi, or cloud connectivity is unavailable.

The product is intentionally resident-focused. It must not expose responder-only tools such as medical triage editing, tactical incident assignment, or command-center controls. Resident interactions should be fast, icon-led, multilingual, accessible, and usable under stress, darkness, low battery, poor connectivity, and limited literacy.

> **Product promise:** When the network is unavailable, the resident can still understand the danger, ask for help, navigate toward safety, and tell trusted people that they are safe.

## 2. Goals and success measures

| Goal | Success measure | MVP target |
| --- | --- | --- |
| Deliver life-safety alerts | A targeted online device receives a critical alert and opens the alert detail | P99 cloud dispatch under 1.5 seconds; app renders cached alerts offline |
| Preserve survival workflows offline | Resident can open SOS, report a hazard, view cached maps, and view saved shelters with airplane mode enabled | 100% of core flows execute without a network call |
| Make rescue requests actionable | SOS contains location, timestamp, optional evidence, status, and delivery state | SOS is durably stored locally before any transmission attempt |
| Help residents reach safety | App produces a route using downloaded map data and avoids known hazards | Route calculation works offline against cached road and hazard data |
| Enable trusted welfare communication | Resident can check in safe and manage a small emergency contact list | Check-in is queued offline and syncs when a peer or WAN gateway is available |
| Protect personal data | Routine location is coarse; precise location is used only for active life-safety events | Clear consent, emergency override disclosure, and automatic precision expiry |
| Operate under constraints | App remains useful on legacy devices and low bandwidth | Android 10+ and iOS; high-contrast mode; screen reader labels; low-data media defaults |

## 3. Users and primary scenarios

| Persona | Need | Primary app behavior |
| --- | --- | --- |
| Resident preparing for risk | Wants a plan before an event | Selects home area, downloads a map pack, saves shelters, adds contacts, and reviews a readiness checklist |
| Resident under immediate threat | Needs unambiguous instructions | Receives a high-priority alert, sees what to do, and follows an evacuation route |
| Trapped or injured resident | Needs help with minimal interaction | Presses and holds SOS, confirms location, optionally records a short message/photo, and waits for delivery status |
| Displaced resident | Needs a safe place and a way to notify family | Searches nearby shelters, filters by capacity/services, navigates offline, and sends “I am safe” |
| Resident reporting local danger | Wants to warn neighbors and responders | Submits a categorized hazard report with location, description, and optional photo |
| Caregiver or family coordinator | Needs visibility into loved ones’ status | Receives check-in or SOS notifications shared by the resident under explicit consent |

## 4. Scope

### 4.1 In scope for the resident MVP

The MVP includes onboarding, emergency contacts, location and mesh consent, a resident home dashboard, trusted emergency alerts, offline alert history, a one-action SOS flow, hazard reporting, offline map-pack download and rendering, nearby shelter discovery, route guidance, safe check-in, connectivity and sync status, multilingual content selection, accessibility settings, and local encrypted persistence.

### 4.2 Deferred until later phases

Advanced multi-hop BLE/Wi-Fi mesh relaying, satellite-specific transport, live voice chat, family accounts with delegated access, automatic sensor-triggered alerts, continuous high-precision tracking, shelter reservation, in-app responder messaging, and full cross-device account recovery are deferred. The UI may expose capability placeholders only when the corresponding backend and device capability exist; it must never imply that a deferred feature is operational.

The source roadmap places enhanced offline maps and CRDT synchronization after the initial MVP, followed by mesh networking and satellite/cell-broadcast hardening.[1] The resident app should therefore ship with an interface contract that supports these capabilities while keeping the first release testable with ordinary HTTPS/FCM/APNs and local offline storage.

## 5. Product principles

1. **Life safety before completeness.** The app must show the next safest action before secondary information.

1. **Offline by default for critical paths.** Network state may improve freshness, but it must not block SOS, cached alerts, maps, or saved shelter information.

1. **Trust is visible.** Every alert shows its source, severity, issue time, expiry, and freshness state.

1. **Consent is explicit.** Location precision, mesh participation, background sync, and contact sharing are separate choices.

1. **No silent failure.** Every queued action shows whether it is saved locally, relaying, uploaded, acknowledged, or failed.

1. **Design for stress.** Large tap targets, short sentences, strong color contrast, audio cues, haptics, and one primary action per screen are mandatory.

1. **Privacy minimizes harm.** Routine location is coarse; exact coordinates are shared only during an active emergency flow and expire after resolution.

## 6. Information architecture

The primary navigation has four destinations: **Home**, **Map**, **Report**, and **Profile**. A persistent emergency action is available from Home, Map, and the alert detail screen. The app uses a modal emergency presentation for critical alerts so that a resident cannot miss a mandatory evacuation instruction.

| Screen | Purpose | Primary action |
| --- | --- | --- |
| Onboarding | Set language, region, permissions, contacts, and offline pack | Finish setup |
| Home | Summarize safety state, active alert, connectivity, and quick actions | View active alert or SOS |
| Critical alert | Present verified instruction, affected area, expiry, and actions | View route / Find shelter |
| Map | Show cached map, shelters, evacuation routes, and hazard overlays | Start route |
| Shelter detail | Show distance, capacity freshness, services, and directions | Navigate |
| SOS | Capture and send rescue request | Press and hold to send |
| SOS status | Show local save, relay, upload, and responder acknowledgment states | Update or cancel when permitted |
| Report hazard | Capture category, severity, location, description, and media | Save and send report |
| Safe check-in | Share “I am safe” with selected contacts and platform | Send check-in |
| Contacts | Maintain emergency contacts and sharing permissions | Add or edit contact |
| Offline downloads | Manage region map packs and preparedness content | Download / update pack |
| Profile and privacy | Manage consent, language, accessibility, data export/delete | Save settings |

## 7. Functional requirements

### FR-01: Onboarding and preparedness

The app shall allow a resident to select a language, confirm a home or frequent location using a coarse area, and choose an offline region pack. It shall explain notifications, location precision, background sync, mesh participation, and emergency contact sharing as separate consent decisions. The app shall allow setup to complete without network access when a signed default configuration is bundled with the app.

The app shall provide a readiness checklist containing emergency contacts, offline map availability, shelter data freshness, device battery guidance, first-aid content, and a household meeting point. Checklist completion is local state and may synchronize later.

### FR-02: Emergency alerts

The app shall receive alerts through push notification when online and shall retain the latest signed alerts locally for offline viewing. An alert shall include title, severity, urgency, issuing authority, description, affected area, issued time, expiry, recommended action, and source/freshness label.

Extreme or immediate life-safety alerts shall use a full-screen presentation, audible alarm, haptic feedback, and a prominent action button. The alert may bypass local silent or do-not-disturb behavior only when the backend-issued authorization is cryptographically verifiable and the alert is marked as a mandatory life-safety broadcast. The user shall see that an emergency override occurred.

The app shall suppress duplicates by alert ID, display expired alerts as expired rather than silently deleting them, and make stale/offline data visually distinct from current data. If push delivery fails, the backend may use SMS or other supported fallback channels; the app must safely handle a deep link that opens an offline-compatible alert page.

### FR-03: SOS rescue request

The resident shall start SOS from Home, Map, alert detail, and the lock-screen-capable integration when supported by the platform. To reduce accidental activation, the primary in-app SOS action shall require a press-and-hold gesture for three seconds followed by a short confirmation countdown. If the resident cannot complete the confirmation, the app shall still preserve a draft locally but shall not claim that an SOS was sent.

An SOS record shall contain a locally generated unique ID, event type, severity, coarse location by default, precise location only after emergency confirmation and consent/override, last-known location fallback, local logical timestamp, optional short text or voice note, optional compressed photo, device battery level, and delivery state. The record shall be encrypted locally and signed before mesh or cloud transmission where platform identity keys are available.

SOS delivery states shall be: **Saved on device**, **Searching for connection**, **Relaying nearby**, **Uploaded to emergency service**, **Acknowledged by emergency service**, and **Unable to deliver**. The resident must be able to see the last state and last attempt time without exposing cryptographic or responder-only details.

### FR-04: Hazard reporting

The resident shall report flood, fire, blocked road, structural collapse, injured person, missing person, unsafe shelter, utility failure, or other hazard. The app shall default to the device location or last-known location, allow manual adjustment on the map, and require category plus severity. Description and media are optional, with media compression and deferred upload enabled by default.

A report is immediately saved locally before any upload. It is assigned a priority based on life-safety relevance and queued for synchronization. The resident may view their submitted reports and the state of each report, but may not change responder operational status.

### FR-05: Offline map and routing

The app shall render a downloaded map pack without network access. A map pack shall contain a region boundary, version, download date, expiry/freshness metadata, shelters, evacuation routes, and available hazard overlays. The resident shall be warned when a map pack is missing, stale, incomplete, or incompatible with the current location.

Offline routing shall use cached road and evacuation-route data and avoid roads marked as blocked, flooded, or otherwise hazardous. If a safe route cannot be calculated, the app shall show the reason and offer the nearest known shelter or a bearing/distance fallback only when the data quality is sufficient. The app shall never present an outdated route as guaranteed safe.

### FR-06: Shelter discovery

The resident shall search or browse nearby shelters from the Map and alert flows. Each shelter card shall show name, distance, last updated time, active/inactive status, total capacity, approximate occupancy or availability state, water/food/medical indicators, accessibility indicators when known, and offline-data freshness.

Capacity values that are stale or unknown shall be labeled clearly. The app shall support filters for open, accessible, medical support, family-friendly, and water/food availability only when those attributes are present in the dataset.

### FR-07: Safe check-in and household contacts

The resident shall send a signed “I am safe” check-in to selected contacts and, if enabled, the platform. The resident shall choose whether to share precise location, coarse area, or no location. The check-in shall remain useful offline by storing it locally and relaying it through supported channels when available.

Emergency contacts shall be stored with name, phone/email or supported delivery address, relationship, preferred language if available, and sharing permissions. The app shall not silently broadcast a resident’s status to all contacts. A contact can receive a check-in or SOS only after the resident has selected the sharing scope, except where a verified life-safety emergency override is required by the platform’s emergency policy.

### FR-08: Connectivity and synchronization

The Home screen shall show one of **Online**, **Offline**, **Limited**, **Syncing**, or **Sync attention needed**. The app shall maintain an encrypted local outbox and retry according to priority: SOS and active safety events first, then hazard reports and check-ins, then map and telemetry updates.

Synchronization shall be idempotent. Repeated transmission of the same record must not create duplicate incidents or check-ins. A sync failure must preserve the local record and offer retry; it must never discard a resident submission. The implementation should expose vector-clock or equivalent version metadata in the repository boundary even if the first release uses a simplified merge strategy.

### FR-09: Accessibility, language, and low-literacy support

The resident app shall support system screen readers, dynamic text sizing, minimum WCAG 2.1 AA contrast, large touch targets, reduced motion, color-independent status indicators, high-contrast emergency mode, and text-to-speech for critical alerts. Core flows shall be translated through locally bundled strings for the supported launch languages and shall not depend on a network translation request.

Critical content shall use plain language, short headings, recognizable icons with labels, and optional audio. The app shall not rely on color alone to distinguish alert severity or delivery state.

## 8. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Offline resilience | Home, cached alerts, SOS creation, hazard report creation, cached maps, saved shelters, and safe check-in must work with all network interfaces disabled. |
| Performance | Home opens from warm local state in under 2 seconds on a representative low-end device; SOS record is durably written in under 1 second after confirmation. |
| Reliability | Local writes use a crash-safe database transaction. Outbox entries survive app restart, OS restart, and temporary power loss. |
| Security | Use hardware-backed key storage when available; encrypt local databases and sensitive media; use TLS 1.3 online; sign emergency-originated offline records where supported. |
| Privacy | Routine location is coarse and minimized. Precise location is limited to an active emergency and automatically expires after the emergency is closed plus the configured grace period. |
| Battery | Background sync and discovery are duty-cycled; no continuous GPS polling in normal mode. |
| Compatibility | Android 10+ and supported current iOS versions; responsive layouts for small phones and rugged tablets. |
| Observability | Capture privacy-safe crash, sync, alert-render, and delivery-state metrics. Never log message bodies, precise locations, private keys, or contact details. |
| Resilience messaging | Every network-dependent action exposes local persistence and delivery status. |

These constraints align with the system design’s offline-uptime, encryption, battery, accessibility, and privacy targets.[1]

## 9. Suggested client architecture for vibe coding

Use a mobile client with a local-first repository boundary. The UI must read from local state and subscribe to changes; network responses update the local store rather than bypassing it.

| Layer | Suggested implementation |
| --- | --- |
| UI | React Native with Expo if the project requires rapid cross-platform prototyping; use accessible native controls and a design-token system. |
| State | Zustand or Redux Toolkit for ephemeral UI state; a repository/service layer for domain state. |
| Local persistence | SQLite with encrypted sensitive fields; use a migration system from the first commit. |
| Offline queue | `outbox` table with priority, entity type, operation, payload, attempts, next retry time, and delivery state. |
| Maps | MapLibre-compatible renderer with offline MBTiles/PMTiles adapter; mock the adapter initially if map binaries are not available. |
| Secure storage | OS Keychain/Keystore for tokens, encryption keys, and device identity material. |
| Connectivity | Network reachability listener plus explicit “offline simulation” developer toggle. |
| Notifications | FCM/APNs adapter behind an interface; local notification fallback for cached/queued alert previews. |
| Testing | Unit tests for reducers/repositories, offline integration tests, accessibility checks, and end-to-end tests with airplane-mode simulation. |

The implementation must keep transport adapters replaceable. A mock transport should make the app fully demonstrable without backend credentials, while production adapters map to the APIs in Section 10.

## 10. API and domain contracts

The following contracts are resident-facing projections of the platform services. The mobile app must not expose admin-only or responder-only endpoints directly to untrusted UI code.

| Method | Endpoint | Use |
| --- | --- | --- |
| `GET` | `/api/v1/alerts/nearby?lat=&lng=&radius=` | Fetch active alerts when online |
| `GET` | `/api/v1/shelters/nearby?lat=&lng=&radius=` | Fetch nearby shelter data |
| `GET` | `/api/v1/weather/forecast?lat=&lng=` | Fetch current hazard/weather context |
| `POST` | `/api/v1/incidents` | Upload a resident hazard or SOS incident |
| `POST` | `/api/v1/sync` | Bidirectional sync of local mutations |
| `GET` | `/api/v1/map-packs/{region}/manifest` | Check map-pack version and metadata |
| `GET` | `/api/v1/contacts` | Fetch encrypted/scope-limited contact metadata |
| `POST` | `/api/v1/check-ins` | Upload a safe check-in |

### Resident incident payload

```json
{
  "incident_id": "uuid-v4",
  "client_device_id": "opaque-device-id",
  "category": "structural_collapse",
  "severity": "high",
  "description": "Blocked road near the school.",
  "location": {
    "precision": "coarse",
    "h3_cell": "optional-h3-cell",
    "latitude": null,
    "longitude": null
  },
  "media": [],
  "client_timestamp": "logical-or-device-timestamp",
  "vector_clock": {},
  "priority": "P1",
  "signature": "optional-ed25519-signature"
}
```

### Sync payload

```json
{
  "device_id": "opaque-device-id",
  "client_timestamp": "2026-08-24T10:00:00Z",
  "local_mutations": [
    {
      "entity": "incident",
      "action": "CREATE",
      "payload": {},
      "idempotency_key": "uuid-v4",
      "priority": "P0"
    }
  ],
  "known_server_version": "opaque-version"
}
```

The server must return acknowledged mutation IDs, server changes, conflicts requiring user-visible attention, and a server version. The client must treat acknowledgment as delivery confirmation, not as responder acceptance.

## 11. Local data model

| Table | Required fields |
| --- | --- |
| `alerts` | `alert_id`, source, severity, urgency, title, description, zone, issued_at, expires_at, signature, freshness, viewed_at |
| `incidents` | `incident_id`, category, severity, description, location_precision, coarse_location, precise_location_encrypted, status, created_at, updated_at |
| `sos_events` | `sos_id`, incident_id, confirmation_state, delivery_state, attempt_count, last_attempt_at, acknowledgment_at |
| `shelters` | `shelter_id`, name, location, capacity, occupancy, services, active, updated_at, source, freshness |
| `map_packs` | `region_id`, version, local_path, size_bytes, downloaded_at, expires_at, checksum, status |
| `contacts` | `contact_id`, display_name, channel, destination_encrypted, relationship, sharing_scope |
| `check_ins` | `check_in_id`, state, location_scope, selected_contact_ids, created_at, delivery_state |
| `outbox` | `mutation_id`, entity, entity_id, priority, serialized_payload, attempts, next_retry_at, state, last_error |
| `consents` | `location_precision`, `mesh_participation`, `background_sync`, `contact_sharing`, `updated_at`, consent_version |

Routine mesh messages should auto-expire locally according to the platform policy. The source design specifies rolling retention for routine location and mesh data, while incident and triage records have longer operational retention.[1]

## 12. Key user stories and acceptance criteria

### US-01: Receive and act on evacuation alert

**As a resident in an affected area, I want a trusted, prominent evacuation instruction so that I know what to do immediately.**

**Acceptance criteria:** Given a valid immediate alert, when the device receives it, then the app displays the source, severity, expiry, action, and affected area; plays the configured alarm; and provides “View route” and “Find shelter.” Given no network, when the resident reopens the app, then the cached alert remains viewable with an offline/staleness label. Given a duplicate alert ID, then only one alert record is shown.

### US-02: Request rescue offline

**As a trapped resident, I want to send an SOS even without cellular service so that nearby devices or a later gateway can relay it.**

**Acceptance criteria:** Given airplane mode, when the resident confirms SOS, then a durable local record exists before the UI reports success; the UI shows “Saved on device” and “Searching for connection”; the event is placed at the highest queue priority; and the record remains after app restart. The UI must never show “Emergency service received” until an authenticated acknowledgment is returned.

### US-03: Navigate to safety

**As an evacuating resident, I want an offline route that avoids known hazards so that I can reach a shelter safely.**

**Acceptance criteria:** Given a valid downloaded map pack, when the resident requests a route, then the app calculates and renders it without a network request and excludes roads marked impassable. If the map pack is stale, the route screen shows the stale-data warning before navigation begins.

### US-04: Report a hazard

**As a resident, I want to report a blocked road or damaged building so that responders receive local information.**

**Acceptance criteria:** The resident can select category and severity, confirm or adjust location, add text, optionally add compressed media, and save the report offline. The report appears in “My reports” with a delivery state. Retrying sync with the same idempotency key does not create a duplicate.

### US-05: Tell family I am safe

**As a resident, I want to check in with selected people without broadcasting my exact location to everyone.**

**Acceptance criteria:** The resident chooses recipients and location scope; the check-in is saved offline; the UI identifies each delivery state; and no unselected contact receives the check-in through the app.

### US-06: Use the app accessibly

**As a resident with a disability or limited literacy, I want alerts and emergency actions to be understandable and operable.**

**Acceptance criteria:** Core flows are operable with screen reader labels, large text, keyboard/switch access where supported, high contrast, and no color-only meaning. Critical alert text can be read aloud using bundled/local capabilities.

## 13. UX states and failure behavior

| Condition | Required resident experience |
| --- | --- |
| No network | Show Offline; keep critical actions enabled; save all mutations locally. |
| Intermittent network | Show Limited; retry with backoff; prioritize SOS and current alert actions. |
| Stale map or shelter data | Show last updated time and a warning; never imply live capacity. |
| GPS unavailable | Use last-known location or manual map pin; state the limitation clearly. |
| Low battery | Recommend battery-saving mode; disable nonessential background work after warning; keep SOS available. |
| Permission denied | Explain consequences and offer a reduced-capability path rather than blocking the app. |
| Sync conflict | Preserve both local and server values when safety-relevant; present a plain-language review only when resident action is required. |
| Invalid or unverifiable alert | Do not display it as authoritative; show a verification error and retain security telemetry without exposing secrets. |
| Media upload failure | Keep the text/location incident and mark media as pending; allow retry or remove media. |

## 14. Security and privacy requirements

The client shall encrypt sensitive local data, protect keys using platform secure storage, and avoid placing precise locations or personal contact data in logs. Routine location shall use coarse geospatial representation; exact coordinates may be transmitted only for an active SOS or equivalent emergency event, with automatic expiry after the incident is closed according to the platform policy.[1]

The app shall show a privacy center with current consent states, a short explanation of emergency override behavior, data export/delete controls where supported, and a record of when precise location was enabled. The product must separate “participate in mesh relay,” “share location,” and “sync in background.” Revoking a consent affects future collection and transmission; it must not silently delete a life-safety record already acknowledged by emergency authorities.

## 15. MVP delivery plan

| Sprint/phase | Deliverable |
| --- | --- |
| 0 | Project shell, design tokens, navigation, mock data, offline simulation toggle, accessibility baseline |
| 1 | Onboarding, profile, contacts, consent center, local database and migrations |
| 2 | Home dashboard, alert inbox, critical alert presentation, local notification mock |
| 3 | SOS creation, local encrypted persistence, outbox, delivery-state UI |
| 4 | Hazard reporting, safe check-in, “My activity,” idempotent mock sync |
| 5 | Map-pack manager, offline map adapter/mock renderer, shelter cards, route state |
| 6 | API adapters, push notification integration, telemetry, device testing, release hardening |

## 16. Definition of done

The resident MVP is complete when a new user can install the app, finish onboarding, download or load a region pack, receive a mock or real alert, open it with no network, calculate an offline route, create an SOS and hazard report offline, restart the app without losing either record, view delivery states, send a safe check-in to a selected contact, and change consent/accessibility settings. Automated tests must cover airplane mode, duplicate sync, app restart during write, stale map data, permission denial, screen-reader labels, and critical alert rendering.

A production release additionally requires security review, notification provider configuration, map-license validation, disaster communication governance approval, privacy/legal review for the target jurisdiction, field testing across representative low-end devices, and a documented incident-response runbook.

## 17. Vibe-coding implementation prompt

> Build the RDMP Resident App as an offline-first, accessible cross-platform mobile application. Use a local repository as the source of truth for alerts, SOS events, hazard reports, shelters, map packs, contacts, consent, check-ins, and an encrypted priority outbox. Implement Home, Map, Report, Profile, Alert Detail, SOS, Shelter Detail, Safe Check-In, Contacts, Offline Downloads, and Privacy screens. Add an offline simulation toggle for development. Use mock repositories and deterministic seed data first, then place production REST/push/map integrations behind replaceable adapters. Never make SOS, cached alerts, offline maps, hazard creation, or safe check-in depend on a live network. Show explicit delivery states and never claim emergency-service acknowledgment without a verified response. Apply high contrast, large targets, screen-reader labels, localization-ready strings, minimal animations, and plain-language copy. Include unit, integration, and end-to-end tests for offline restart, outbox retry, idempotency, stale data, accessibility, and alert severity behavior.

## 18. Out of scope and product risks

The resident app is not a substitute for public emergency services, official evacuation planning, medical diagnosis, or guaranteed route safety. Offline shelter capacity and hazard data can become stale; the UI must communicate this limitation. Mesh relay availability depends on compatible nearby devices, permissions, radio support, and battery. Emergency override behavior requires jurisdiction-specific legal review and must be auditable. Map licensing, multilingual emergency content, OS background restrictions, and false reports require operational governance beyond the client UI.

## References

[1]: /home/ubuntu/upload/disaster_management_platform_system_design.md "Resilient Disaster-Management Platform (RDMP): Enterprise System Design Document"