# Archon

`Fintech` `SaaS` `Data Density`

---

## Archon - Enterprise record search for fintech B2B teams

Archon is a record search and management platform for revenue and operations teams handling large account and contract datasets - built for the moment a CRM's basic search stops being enough. The core challenge was compound filtering: letting non-technical users build AND/OR query logic across dozens of fields without ever seeing the word "query." Every downstream screen had to stay usable at scale, from a single record to a 124,000-row dataset.

---

## Role & Activities

**Heuristic Evaluation of Existing Tools**
I audited filter builders in Salesforce, Airtable, and Retool to understand where compound logic UX typically breaks down - usually at nested groups and operator-type mismatches. That research shaped the decision to color-code AND and OR groups distinctly rather than relying on text labels alone, which most competitors don't do.

**Information Architecture**
Mapping the record lifecycle - search, inspect, act, export - determined the screen sequence and what belonged in a side panel versus a dedicated page. Export specifically needed to be a full wizard, not a modal, once it became clear scheduling and column selection couldn't be compressed into an overlay without losing clarity.

**Designing for Data Density**
The hardest craft problem was the results table: surfacing enough columns for confident bulk decisions without forcing horizontal scroll fatigue. I solved this with progressive disclosure - a record detail panel that holds risk scoring and contact context off the main grid, keeping the table itself lean.

**State and Edge Case Design**
Bulk operations needed to handle partial failure gracefully. I designed the status-change flow to detect record-level conflicts (a locked record mid-edit) and recalculate the affected count live, so users always see an honest number before committing.

---

## Outcome

Archon gives operations teams a way to interrogate large datasets with the same logical precision as a database query, without writing one. Saved filters turn one-off investigations into reusable team assets, and the conflict-aware bulk actions mean status changes and exports no longer require a "let me check if anyone else is editing this" Slack message first. The system holds together as a cohesive product - six screens that share one data model, one visual language, and one underlying philosophy about how complexity should be revealed gradually rather than all at once.
