# Clinova

`HealthTech` `EDC Platform` `Design System`

---

## Clinova — Electronic data capture for clinical trials

Clinova is an EDC system for running Phase II–III clinical trials: the software clinical data managers and monitors use to capture, verify, and lock trial data across multiple sites. The design problem sits in the tension the domain is built on — the platform has to move fast enough for daily site work while holding a regulated audit posture where every value change is signed, reasoned, and traceable. Getting that balance wrong in either direction breaks the product.

---

## Role & Activities

**Domain framing & research**
The engagement started by pinning down what the product actually was. "Clinical data management" is easy to confuse with electronic health records, and the two have opposite mental models — one supports care at the bedside, the other supports data integrity in a trial. I benchmarked against the category's reference systems and reframed the work around EDC and 21 CFR Part 11 before any layout decisions. That framing cascaded through every screen that followed.

**Information architecture**
Trial data is deeply nested — study, site, subject, visit, form, field — and the navigation had to make that hierarchy walkable without burying the one thing a monitor is hunting for: where the data isn't clean yet. I structured the product around a dual-level model that keeps study-wide context available while letting a user drop straight into a single discrepancy.

**Interaction design for regulated states**
The core of the work was designing how the system behaves when data fails a check. I mapped the full lifecycle of a discrepancy — automatic edit checks, query generation, response, resolution — and designed the form states, audit trail, and electronic signature moments so that compliance reads as a first-class part of the interface rather than a layer bolted on top.

**Design system & data-density work**
I built the token architecture with a hard rule separating brand color from clinical status, so that the reds and ambers a reviewer relies on never compete with interface accent. Dense matrices, longitudinal lab views, and permission grids all draw from the same system.

---

## Outcome

Clinova became a tool that lets a monitor open any study and immediately see which subjects need attention, trace a single out-of-range lab result from the chart where it surfaced through the query it raised to the overdue follow-up it triggered, and understand exactly who is permitted to resolve it. The regulated behavior — signatures, reasons, audit history — is woven through the daily workflow instead of sitting apart from it, which is the difference between a system people trust with trial data and one they work around.
