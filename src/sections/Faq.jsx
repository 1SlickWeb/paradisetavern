import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "../data/faq";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";
import { ease } from "../lib/motion";

function Item({ q, a, open, onToggle }) {
  const id = useId();
  return (
    <li className="border-b border-cream/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
        >
          <span className={`font-display text-xl transition-colors duration-300 sm:text-2xl ${open ? "text-saffron-soft" : "text-cream group-hover:text-saffron-soft"}`}>{q}</span>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
              open ? "rotate-45 border-paradise bg-paradise text-white" : "border-cream/20 text-cream group-hover:border-saffron"
            }`}
          >
            <Plus className="size-4" aria-hidden="true" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative pb-24 sm:pb-32">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Eyebrow>Good to know</Eyebrow>
          <SplitHeading
            id="faq-title"
            text="Questions, answered."
            accent={["answered"]}
            className="mt-5 font-display text-[clamp(2.4rem,5vw,4.2rem)] text-cream"
          />
          <Reveal as="p" className="mt-5 max-w-sm text-muted">
            Straight from the small print of our menu. Anything else, call us and ask.
          </Reveal>
        </div>
        <Reveal>
          <ul className="border-t border-cream/10">
            {faq.map((f, i) => (
              <Item key={f.q} {...f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
