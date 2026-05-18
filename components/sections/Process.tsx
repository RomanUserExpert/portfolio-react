import SectionLabel from '@/components/ui/SectionLabel'
import styles from './Process.module.css'

const steps = [
  { num: '01', title: 'Discovery', desc: 'Clarify goals, constraints, and what problem actually needs solving — before touching a single screen.' },
  { num: '02', title: 'Research & Framing', desc: 'Review existing flows, identify friction, map journeys and key decision points.' },
  { num: '03', title: 'Structure & Wireframes', desc: 'Information architecture and logic first — visuals follow from clarity, not the other way around.' },
  { num: '04', title: 'Design System', desc: 'Scalable components with tokens, variants, and every key state defined.' },
  { num: '05', title: 'Prototyping', desc: 'Interactive prototypes to validate flows and communicate intent before development starts.' },
  { num: '06', title: 'Dev Handoff', desc: 'Clean Figma files — auto layout, components, tokens, all states. No guessing during implementation.' },
  { num: '07', title: 'Post-launch Support', desc: 'Available after release — clarifying edge cases, adjusting to real user feedback, and keeping the design consistent as the product evolves.' },
]

export default function Process() {
  return (
    <section id="process">
      <SectionLabel>Process</SectionLabel>
      <div className={styles.list}>
        {steps.map((step) => (
          <div key={step.num} className={styles.row}>
            <span className={styles.num}>{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
