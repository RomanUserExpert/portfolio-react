# DataMind

`AI / LLMOps` `B2B SaaS` `Data-Dense Interfaces`

---

## DataMind - observability and evaluation platform for teams running LLM applications in production

Teams shipping LLM features operate without the instrumentation they'd demand anywhere else in their stack. A prompt change can lift average quality while quietly wrecking one narrow class of user question, and nobody notices until support tickets accumulate. DataMind exists for the engineers who have to catch that, which made the hard part of this project credibility rather than density: the people who'd judge the interface write evaluation harnesses for a living and spot a wrong abstraction in about five seconds.

---

## Role & Activities

**Competitive analysis and domain research**

I worked through LangSmith, Langfuse, Braintrust, Arize Phoenix, and Weights & Biases Weave to understand how practitioners actually reason about model quality. The category turned out to contain three distinct products that get conflated: observability, data labeling, and visual app building. My initial scope borrowed from all of them, so I cut it back to observability and evaluation only.

**Canonical dataset before layout**

I built a fictional production incident with full internal consistency, then validated every figure with Python scripts before touching a single screen. Weighted segment averages, token costs derived from real model pricing, timing that actually sums. Numbers that don't reconcile are the fastest way to lose a technical audience.

**Designing for diagnostic reasoning**

The central design problem was making a regression visible when the headline metric had improved. That required deciding what earns visual weight and what gets deliberately demoted, then threading one causal chain across the whole product so a viewer could follow the incident from symptom to root cause without reading documentation.

**Semantic colour architecture**

Quality, latency, and cost are three separate registers, and conflating them produces an interface that lies. I built a token system where the brand accent belongs exclusively to actions, status colours never touch anything else, and one warning tone appears in exactly one place across the entire product.

---

## Outcome

The product holds together as a single system rather than a collection of adjacent views. Every figure resolves to one validated source, which means an engineer can trace a production failure through prompt history, regression testing, human review, and budget impact without hitting a number that contradicts the previous screen. The design decisions that mattered most were subtractive: cutting scope that belonged to a different product category, and refusing to let a rising average metric look like unambiguous good news.
