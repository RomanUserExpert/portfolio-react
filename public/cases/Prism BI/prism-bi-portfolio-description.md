# Prism BI

`Fintech` `Self-serve BI` `Design System`

---

## Prism BI — Self-serve analytics builder for payments teams

Prism BI lets analysts and finance leads at a payments company build, schedule, and govern their own dashboards without filing a ticket with data engineering. The challenge wasn't any single interaction — it was making the full path from raw data to a trusted, shareable report feel like one coherent system instead of a loose collection of admin tools bolted together over time.

---

## Role & Activities

**Stakeholder interviews & analytics review**
Early conversations with an analytics lead and finance stakeholders surfaced the real failure mode: people weren't struggling to read dashboards, they were waiting on engineering for new ones. That reframed the brief from "design a dashboard" to "design a builder," shaping every downstream decision.

**Information architecture — edit vs. view duality**
The key structural call was treating editing and consuming as two separate problems rather than one screen with a mode toggle. Builders needed room to manipulate layout and data mappings; consumers needed a clean surface for reading numbers and drilling into the records behind them. Resolving that early prevented a messy hybrid screen trying to serve both audiences at once.

**Role-based access modeling**
Row-level permissions needed compound logic — a regional team seeing only its rows, sometimes across an OR condition spanning two regions — without turning the screen into a raw query builder. Reusing a compound-rule pattern from elsewhere in the portfolio kept the model consistent across projects.

---

## Outcome

What started as "build a dashboard" became a self-serve analytics platform where editing, consumption, and governance are each treated as distinct, intentional surfaces rather than one overloaded screen. An analyst can go from connecting a source to a scheduled, access-controlled report without writing a support ticket. The row-level access model and the edit/view split are reusable patterns the team can extend as new dashboards get added.
