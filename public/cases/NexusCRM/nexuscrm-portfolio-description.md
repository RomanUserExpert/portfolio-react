# NexusCRM

`Sales Ops` `Enterprise SaaS` `Workflow Automation`

---

## NexusCRM - B2B sales operations platform

NexusCRM is a sales operations platform for mid-market B2B teams running pipeline, outreach, and forecasting through one system instead of three disconnected tools. The core challenge wasn't any individual screen - it was keeping six interconnected modules honest against each other, so a weighted pipeline number means the same thing whether a rep is scanning the board or a director is closing the quarterly forecast.

---

## Role & Activities

**Competitive Benchmarking**
Before structuring the pipeline view, I mapped how Pipedrive, HubSpot, and Outreach/Salesloft handle kanban-to-table switching, deal-rot signaling, and cadence branching - then made deliberate departures where convention didn't fit an enterprise context, rather than defaulting to a prior project's pattern.

**Cross-Module Data Architecture**
Every figure traces back to one locked dataset. Weighted pipeline value, quota attainment, and forecast variance are calculated once and referenced everywhere downstream - a rep's pipeline review and a manager's forecast rollup never quietly disagree.

**Workflow Automation Design**
The email sequence builder needed to demonstrate real sales-ops sophistication, not a mail-merge queue with a visual skin. I designed branching logic - an open/no-open condition that splits a cadence into two paths and reconverges before a final send - as structural proof this is automation, not a linear list.

**Design System & Theming**
Built a token architecture where brand color is strictly decoupled from semantic status colors and chart palettes, so the product supports dark and light themes without any color carrying two conflicting meanings.

---

## Outcome

NexusCRM gives sales teams one system to trust instead of several spreadsheets to reconcile by hand. Reps get a pipeline dense enough for daily triage without losing legibility; managers get a forecast built from the same numbers reps already see, not a separate estimate assembled after the fact. The integration layer - with explicit field-type conflict resolution rather than a silent best-guess - signals a platform built to sit inside a company's existing stack, not replace it overnight.
