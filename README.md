# RDMP — Resilient Disaster-Management Platform

[![Status: Product Definition](https://img.shields.io/badge/status-product--definition-1455A0)](#project-status)
[![Offline First](https://img.shields.io/badge/design-offline--first-006D77)](#core-principles)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-167A4A)](#accessibility)
[![Security](https://img.shields.io/badge/security-zero--trust-B42318)](#security-and-privacy)

RDMP is an **offline-first disaster-management platform** designed to preserve resident life-safety workflows when cellular networks, internet backhaul, cloud services, or electrical infrastructure are degraded or unavailable. The platform connects resident mobile experiences with emergency alerts, offline maps, shelters, hazard reports, SOS requests, safe check-ins, mesh relays, responder workflows, and resilient cloud services.

The first product surface in this repository is the **Resident App**. It helps people understand active hazards, request rescue, navigate toward known shelters, report local danger, and notify trusted contacts that they are safe. Critical resident workflows must continue to operate on-device without a network connection.

> **Product promise:** When the network is unavailable, a resident can still understand the danger, ask for help, navigate toward safety, and tell trusted people that they are safe.

## Project status

This repository currently contains the product, UI/UX, and system-design specifications for implementation. It is ready to be used as the source of truth for a vibe-coded MVP or a production engineering kickoff. Backend services, mobile clients, infrastructure manifests, and production integrations should be added incrementally according to the roadmap below.

| Area | Status | Notes |
|---|---|---|
| Resident product requirements | Defined | See `docs/resident_app_prd.md` |
| Resident UI/UX specification | Defined | See `docs/resident_app_uiux_prd.md` |
| Enterprise system design | Defined | See `docs/disaster_management_platform_system_design.md` |
| Mobile MVP implementation | Planned | Begin with local-first repositories and deterministic mock data |
| Mesh networking | Deferred | Requires device-level BLE/Wi-Fi Direct engineering and field testing |
| Satellite and cell-broadcast integrations | Deferred | Requires jurisdictional and provider integration work |
| Production emergency operations | Not yet approved | Requires security, legal, operational, and agency review |

## Why RDMP exists

Disasters create a difficult combination of urgent decisions, unreliable communications, power loss, incomplete information, and rapidly changing hazards. Traditional online-only applications fail precisely when residents need them most. RDMP therefore treats **local execution, durable storage, explicit delivery states, data minimization, and graceful degradation** as core product behavior rather than optional enhancements.

The platform supports the disaster lifecycle across preparedness, response, recovery, and audit operations. It is designed to serve residents, community leaders, responders, government agencies, NGOs, administrators, and automated monitoring systems, while keeping each role’s capabilities isolated.

## Resident App capabilities

The resident MVP focuses on a small set of life-safety actions that should remain useful during a network partition.

| Capability | Resident outcome |
|---|---|
| Emergency alerts | Receive trusted alerts with source, severity, expiry, affected area, freshness, and recommended action. |
| Offline alert history | Reopen cached alerts when the app has no network, with clear stale or cached labeling. |
| SOS rescue request | Press and hold to create a locally durable rescue request, optionally share precise location, and view delivery status. |
| Offline maps | View downloaded maps, evacuation routes, shelters, and known hazards without making a network request. |
| Shelter discovery | Compare nearby shelters, capacity freshness, services, accessibility information, and route options. |
| Hazard reporting | Report floods, fires, blocked roads, structural damage, injured people, missing people, unsafe shelters, and utility failures. |
| Safe check-in | Tell selected contacts or the platform that the resident is safe, with explicit location-sharing scope. |
| Preparedness | Download regional data, add emergency contacts, complete a readiness checklist, and configure consent. |
| Accessibility | Use high contrast, dynamic text, screen readers, reduced motion, audio guidance, and icon-plus-text interactions. |

Responder triage, tactical assignment, command-center controls, NGO inventory operations, and administrative broadcast authorization are **not resident features** and must not be exposed through the resident UI.

## Core principles

1. **Life safety before completeness.** The next safest action should be more prominent than secondary information.
2. **Offline by default for critical paths.** SOS, cached alerts, map packs, saved shelters, hazard creation, and safe check-in cannot depend on a live network.
3. **Trust is visible.** Alerts must show issuing authority, severity, verification, issue time, expiry, and freshness.
4. **No silent failure.** Every queued action reports whether it is saved locally, searching, relaying, uploaded, acknowledged, or unable to deliver.
5. **Consent is explicit.** Precise location, coarse location, mesh participation, background sync, and contact sharing are separate choices.
6. **Privacy minimizes harm.** Routine location is coarse; precise location is limited to an active emergency workflow and expires according to policy.
7. **Design for stress.** Use large touch targets, plain language, strong contrast, audio and haptic feedback, and one primary action per screen.
8. **Graceful degradation.** When a capability is unavailable, the UI explains the limitation and offers the safest available alternative.

## High-level architecture

RDMP is organized into five logical tiers.

```text
┌──────────────────────────────────────────────────────────────┐
│ Resident Mobile App                                          │
│ UI · View Models · Local Repository · SQLite · Secure Store   │
│ Offline Maps · Outbox · Sync Worker · Mesh Adapter           │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS / Push / Mesh / Satellite
┌──────────────────────────────▼───────────────────────────────┐
│ Edge and Gateway Layer                                       │
│ API Gateway · CDN · Mesh Gateway · Store-and-forward nodes   │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ Platform Services                                             │
│ Auth · Alerts · Notifications · Incidents · GIS · Weather   │
│ Sync · Mesh · Audit · Observability                          │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ Data and Messaging                                            │
│ PostgreSQL/PostGIS · TimescaleDB · Object Storage            │
│ Redis · Kafka · Search/Logs                                  │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ External Providers                                            │
│ FCM · APNs · SMS · Weather · Seismic · Hydrological feeds    │
└──────────────────────────────────────────────────────────────┘
```

### Mobile architecture

The resident app should use a local-first architecture in which the local database is the primary source of truth for the UI. Network responses update local state; presentational components should not call network clients directly.

| Layer | Responsibility |
|---|---|
| Presentation | Accessible screens, navigation, emergency mode, loading/error states, and localized copy. |
| View model/state | Combines local data, connectivity state, user actions, and delivery states for the UI. |
| Domain | SOS, alerts, reports, check-ins, shelter search, routing, consent, and readiness rules. |
| Repository | Provides stable interfaces for local persistence, mock transport, production transport, maps, notifications, and secure storage. |
| Local data | Encrypted SQLite, outbox queue, cached alerts, shelter data, map-pack metadata, contacts, and consent state. |
| Platform integration | Push notifications, OS permissions, secure key storage, background tasks, GPS, haptics, audio, and optional mesh transport. |

### Cloud service boundaries

The system design defines separate services for alerting, notification dispatch, authentication, incident management, GIS, weather, mesh gateway, synchronization, audit, and observability. The resident client should interact through a versioned API gateway and should not depend on internal service topology.

## Repository layout

The following layout is recommended for the implementation repository. Keep product specifications versioned beside the code so that design intent remains discoverable.

```text
.
├── README.md
├── apps/
│   └── resident-mobile/          # Cross-platform resident application
├── packages/
│   ├── design-system/            # Tokens and reusable accessible components
│   ├── domain/                   # Shared types and business rules
│   ├── local-data/               # SQLite schema, migrations, repositories
│   ├── api-client/               # Versioned API and transport adapters
│   ├── map-engine/               # Offline map and route abstractions
│   └── test-fixtures/            # Deterministic disaster scenarios
├── services/
│   ├── api-gateway/
│   ├── alert-service/
│   ├── incident-service/
│   ├── gis-service/
│   ├── sync-service/
│   └── notification-service/
├── infrastructure/               # IaC, deployment, observability, runbooks
├── docs/
│   ├── resident_app_prd.md
│   ├── resident_app_uiux_prd.md
│   └── disaster_management_platform_system_design.md
├── scripts/                       # Local development and test utilities
└── .github/                       # CI, issue templates, pull-request templates
```

If the implementation uses a different monorepo or mobile framework, preserve the same conceptual boundaries. In particular, retain a replaceable transport layer and keep local persistence independent from screen components.

## Getting started

The specifications do not prescribe a final framework or package manager. The commands below describe the expected developer workflow and should be adapted to the selected implementation stack.

### Prerequisites

Install the following before beginning development:

- Node.js 20 or later and the repository’s selected package manager.
- The mobile SDK required by the chosen framework, such as Expo/React Native, Android Studio, Xcode, or native platform tooling.
- A simulator or physical device running a supported Android or iOS version.
- SQLite development tooling for local database inspection and migration testing.
- Git, a code editor, and access to the repository’s development environment variables.

### Clone and install

```bash
git clone <repository-url>
cd <repository-directory>

# Use the package manager selected by the project.
pnpm install
```

### Configure local environment

Create a local environment file from the project template.

```bash
cp .env.example .env.local
```

Do not commit secrets. Local development should work with mock transports and seeded fixture data, without requiring production notification, mapping, emergency-service, or cloud credentials.

Typical development variables may include:

```dotenv
APP_ENV=development
API_BASE_URL=http://localhost:3000
ENABLE_MOCK_TRANSPORT=true
ENABLE_OFFLINE_SIMULATION=true
MAP_PROVIDER=mock
PUSH_PROVIDER=mock
LOG_LEVEL=debug
```

The exact environment variable names belong to the implementation. Production credentials must be supplied through the deployment secret manager rather than checked into the repository.

### Run the resident app

```bash
pnpm dev
```

The development build should expose an **offline simulation toggle**. This toggle must allow developers and QA to switch between Online, Offline, Limited, Syncing, and Sync attention needed states without changing device settings.

### Run quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

If the repository uses native platform commands, document them in `apps/resident-mobile/README.md` and keep the root README focused on cross-project workflows.

## Development requirements

### Local-first data behavior

Every critical mutation must be written to the local database before an upload is attempted. The outbox must survive app restart, operating-system restart, temporary power loss, and intermittent network conditions.

The recommended outbox fields are:

| Field | Purpose |
|---|---|
| `mutation_id` | Idempotency key for deduplication. |
| `entity` | `sos`, `incident`, `check_in`, or another domain entity. |
| `entity_id` | Stable local entity identifier. |
| `priority` | Life-safety priority before reports, check-ins, and background data. |
| `payload` | Serialized mutation data, encrypted when sensitive. |
| `attempts` | Number of transmission attempts. |
| `next_retry_at` | Backoff scheduling. |
| `state` | Pending, sending, relaying, uploaded, acknowledged, or failed. |
| `last_error` | Safe, user-actionable failure detail. |

Repeated uploads with the same idempotency key must not create duplicate incidents, SOS records, or check-ins.

### Emergency-state behavior

The following delivery states are part of the resident experience and should be represented consistently across screens:

- **Saved on device:** The record is durable locally but has not been confirmed as transmitted.
- **Searching for connection:** The app is attempting an available transport.
- **Relaying nearby:** A supported mesh or gateway relay is handling the message.
- **Uploaded to emergency service:** The platform accepted the record.
- **Acknowledged by emergency service:** An authenticated emergency-service acknowledgment exists.
- **Unable to deliver:** Current transports failed; the record remains locally available for retry.

The app must never display “Help is on the way” or equivalent language without a verified responder acknowledgment.

### Offline simulation scenarios

The fixture system should include deterministic scenarios for:

| Scenario | Expected behavior |
|---|---|
| No active alert, online | Home shows current status and normal preparedness content. |
| Critical evacuation alert | Full-screen alert shows authority, instruction, expiry, route, shelter, and SOS actions. |
| Airplane mode | Cached alerts, SOS, hazard report, map, shelter list, and safe check-in remain usable. |
| Stale map pack | Route UI shows last update and a persistent stale-data warning. |
| SOS with no GPS | UI explains that last-known or manual location will be used. |
| SOS interrupted during write | Local record is recovered after app restart. |
| Duplicate sync request | Server/mock transport acknowledges without creating a duplicate. |
| Push unavailable | App uses cached alert/deep-link handling or configured fallback behavior. |
| Permission denied | App continues with reduced capability and explains the limitation. |
| Low battery | Nonessential background work is reduced while SOS remains available. |

## UI/UX guidelines

The resident interface is designed for stress, darkness, low literacy, limited bandwidth, and small or aging devices.

- Use four primary destinations: **Home**, **Map**, **Report**, and **Profile**.
- Keep SOS prominent on Home, Map, and critical alert detail.
- Give each screen one primary action, one visible safety state, and one freshness/connectivity explanation.
- Use semantic design tokens rather than hard-coded screen colors.
- Use large targets of at least 48 points and larger treatment for SOS.
- Use icons with labels; do not use color as the only status signal.
- Support screen readers, dynamic text, high contrast, reduced motion, audio, haptics, and localization.
- Make stale data explicit with timestamps and warning labels.
- Do not make maps the only way to access shelter information; always provide a text/list alternative.

The recommended visual language is **reassuring, prepared, direct, and civic**. Avoid military styling, decorative complexity, continuous flashing, frightening imagery, and language that overpromises safety.

## Security and privacy

RDMP operates in a hostile environment where devices may be captured and false alerts or telemetry may be injected. Security controls must be designed into the product from the first implementation rather than added after the UI is complete.

### Client security requirements

- Store encryption and signing keys in Android Keystore/StrongBox or iOS Keychain/Secure Enclave when available.
- Encrypt sensitive local databases, outbox records, contact destinations, precise locations, and media.
- Use TLS 1.3 for online communication.
- Validate signatures and trusted alert origins before presenting an alert as authoritative.
- Do not log private keys, message bodies, contact details, or precise locations.
- Use opaque device and user identifiers in analytics and client logs.
- Preserve life-safety records even when a user revokes future data collection consent.
- Treat emergency overrides as auditable, time-bounded, and jurisdiction-specific behavior.

### Location policy

Routine location should be coarse and minimized. Precise location should be shared only for an active SOS or equivalent life-safety event, with clear user disclosure and automatic expiry after the emergency is closed according to the configured policy. Safe check-ins must provide explicit choices for no location, approximate area, or precise location.

This project is not ready for production emergency deployment until privacy, security, legal, regulatory, and agency reviews are complete.

## Testing strategy

Testing must include more than normal online happy paths. The most important quality property is that local life-safety workflows remain correct under failure.

### Unit tests

Cover domain rules, alert severity, freshness calculations, location-scope selection, SOS press-and-hold behavior, delivery-state transitions, outbox priority, retry backoff, idempotency, duplicate suppression, and consent changes.

### Integration tests

Cover SQLite migrations, crash-safe writes, app restart recovery, map-pack loading, repository adapters, local notifications, push deep links, secure-storage access, and transport fallback.

### End-to-end tests

Cover onboarding without a network, receiving a critical alert, opening a cached alert, creating SOS in airplane mode, restarting after SOS creation, reporting a hazard offline, finding a shelter from a stale map pack, checking in with one selected contact, and changing accessibility or privacy settings.

### Accessibility tests

Verify screen-reader order and labels, dynamic text at large sizes, high-contrast mode, reduced motion, keyboard/switch navigation where supported, focus behavior, error announcements, and color-independent status communication.

### Field and resilience tests

Before production consideration, test on low-end and aging devices, low battery, bright sunlight, darkness, limited storage, degraded GPS, intermittent connectivity, multiple languages, background execution restrictions, and simulated regional data staleness. Mesh, satellite, and mass-notification integrations require dedicated field and load testing beyond the resident UI suite.

## API and domain boundaries

The resident client should consume versioned gateway contracts. Initial integrations may include:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/alerts/nearby` | Retrieve active nearby alerts. |
| `GET` | `/api/v1/shelters/nearby` | Retrieve nearby shelter information. |
| `GET` | `/api/v1/weather/forecast` | Retrieve localized weather and hazard context. |
| `POST` | `/api/v1/incidents` | Upload a resident hazard or SOS incident. |
| `POST` | `/api/v1/sync` | Bidirectionally synchronize local mutations. |
| `GET` | `/api/v1/map-packs/{region}/manifest` | Check map-pack metadata and freshness. |
| `POST` | `/api/v1/check-ins` | Upload a safe check-in. |

Transport contracts should remain behind interfaces so mock and production implementations can be swapped without rewriting screens.

## Roadmap

The platform design describes a phased implementation path. The resident app should follow the same dependency order.

| Phase | Scope |
|---|---|
| Phase 1 — Resident MVP | Onboarding, authentication where required, alert inbox, push handling, basic incident reporting, local persistence, and basic map-pack rendering. |
| Phase 2 — Enhanced offline | Full offline maps, shelter routing, encrypted outbox, synchronization, weather context, SMS fallback, and deduplication. |
| Phase 3 — Mesh networking | BLE/Wi-Fi Direct discovery, store-and-forward relay, packet signing, deduplication, battery tuning, and gateway support. |
| Phase 4 — Responder integration | Command-center workflows, responder assignment, advanced GIS, medical triage, and inter-agency permissions. |
| Phase 5 — Scale and harden | Multi-region operations, chaos testing, satellite/cell-broadcast integration, security audit, accessibility audit, and regional failover drills. |

## Contribution guidelines

Contributions should improve resident safety, reliability, accessibility, privacy, or maintainability. Before opening a pull request, confirm that the change does not make a critical workflow depend on a network request or remove an explicit delivery/freshness state.

Use small, focused pull requests. A pull request should explain the user problem, affected screen or domain, offline behavior, privacy implications, test coverage, and any operational assumptions. Include screenshots or short recordings for UI changes, including offline, stale, error, and high-contrast states where relevant.

Recommended commit style:

```text
feat(resident): add offline hazard report draft
fix(sync): preserve outbox item after retry failure
test(sos): cover interrupted local write
chore(ui): update emergency status tokens
docs: clarify map-pack freshness behavior
```

All changes should pass linting, type checks, automated tests, accessibility checks where applicable, and the project’s security review requirements. Do not include real resident data, real emergency contact details, private keys, production tokens, or unapproved disaster communications in commits or fixtures.

## Operational and safety disclaimer

RDMP is a software platform concept and implementation specification. It is **not a substitute for official emergency services, public safety instructions, medical advice, evacuation authorities, or local disaster-management procedures**. A route, shelter capacity, hazard report, or delivery state may be incomplete or stale, especially during a network partition. Production deployment requires official agency ownership, jurisdictional configuration, operational runbooks, security review, privacy/legal approval, provider integration, field testing, and ongoing monitoring.

## Documentation

- [Resident App PRD](docs/resident_app_prd.md)
- [Resident App UI/UX PRD](docs/resident_app_uiux_prd.md)
- [Enterprise System Design](docs/disaster_management_platform_system_design.md)

## License

No license has been selected yet. Until a license is added to the repository, all rights are reserved. Add an approved `LICENSE` file before accepting external contributions or redistributing the implementation.

## References

[1]: docs/resident_app_prd.md "RDMP Resident App Product Requirements Document"
[2]: docs/resident_app_uiux_prd.md "RDMP Resident App UI/UX Product Requirements Document"
[3]: docs/disaster_management_platform_system_design.md "Resilient Disaster-Management Platform Enterprise System Design"
