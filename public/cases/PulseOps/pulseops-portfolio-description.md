# PulseOps

`DevOps` `SaaS` `Real-Time Monitoring`

---

## PulseOps — Infrastructure monitoring and incident response for DevOps teams

PulseOps helps on-call engineers monitor infrastructure health, configure alerting, and resolve incidents across a multi-cluster environment. The core challenge wasn't visual complexity — it was making six previously separate surfaces (health, alerting, logs, incidents, deployments, on-call coverage) behave like one operational record instead of six disconnected tools.

---

## Role & Activities

**Competitive Analysis & Benchmarking**
I benchmarked Datadog, Grafana, and PagerDuty to understand where their information architectures converge by convention versus by necessity. This informed treating dark mode as a functional choice for extended monitoring sessions rather than a stylistic default, and avoiding an interaction pattern already used elsewhere in this portfolio.

**Entity Modeling & Information Architecture**
The highest-risk decision was locking a Cluster → Service → Instance model before any screen work began, then mapping explicit relationships across surfaces — which alert triggered which incident, which deployment is a suspected cause, who's currently responding. That single decision is what lets the product read as one connected system rather than six independent views.

**Designing for Data Density & Progressive Disclosure**
With 21 service instances across four environments, I used layered disclosure throughout: aggregated rows that expand into per-cluster detail, a persistent incident panel that stays visible even in a healthy state, and a log stream built around a live/paused distinction so engineers can freeze context without losing the feed.

**State & Escalation Design**
On-call tooling lives or dies on its failure states. I designed explicit coverage-gap visualization into the rotation calendar, a multi-step escalation path from chat to phone to SMS, and a rollback flow that requires confirmation before an irreversible action — each traceable to a real incident scenario the product needed to explain.

---

## Outcome

The result is a product where a coverage gap visibly explains an unanswered incident, where a deployment's config change can be the answer to a regression three screens away, and where an engineer can move from alert to root cause to resolution without losing the thread — a reusable pattern for cross-screen consistency that's easy to promise and difficult to actually design.
