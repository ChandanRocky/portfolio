import { useState } from "react";
import { motion } from "framer-motion";

const API = process.env.REACT_APP_BACKEND_URL;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status.state === "success" || status.state === "error") {
      setStatus({ state: "idle", message: "" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status.state === "loading") return;

    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 10) {
      setStatus({ state: "error", message: "Please fill name, email and a message of at least 10 characters." });
      return;
    }

    setStatus({ state: "loading", message: "Transmitting…" });
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || "Portfolio inquiry",
          message: form.message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Send failed");
      setStatus({ state: "success", message: data.message || "Message delivered." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Something went wrong. Try again." });
    }
  };

  const fieldClass =
    "w-full bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-neon-lime focus:outline-none transition-colors";

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="cell cell-corner p-6 sm:p-8 relative"
      data-testid="contact-form"
    >
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-danger/70" />
          <span className="w-2 h-2 rounded-full bg-neon-lime/70" />
          <span className="w-2 h-2 rounded-full bg-neon-cyan/70" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
          ~/chandan@portfolio · new-message.compose
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime/80 mb-2 block">/ Name</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            className={fieldClass}
            required
            data-testid="contact-form-name"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime/80 mb-2 block">/ Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@domain.com"
            className={fieldClass}
            required
            data-testid="contact-form-email"
          />
        </label>
      </div>

      <label className="block mt-4">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime/80 mb-2 block">/ Subject</span>
        <input
          name="subject"
          type="text"
          value={form.subject}
          onChange={onChange}
          placeholder="What's it about?"
          className={fieldClass}
          data-testid="contact-form-subject"
        />
      </label>

      <label className="block mt-4">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime/80 mb-2 block">/ Message</span>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={onChange}
          placeholder="Tell me about what you're building, the role, or just say hi…"
          className={`${fieldClass} resize-none leading-relaxed`}
          minLength={10}
          required
          data-testid="contact-form-message"
        />
      </label>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        <button
          type="submit"
          disabled={status.state === "loading"}
          data-testid="contact-form-submit"
          className="btn-magnetic disabled:opacity-50"
        >
          {status.state === "loading" ? "Transmitting…" : "Send Message"}
          <span aria-hidden>→</span>
        </button>

        <div className="font-mono text-[11px] tracking-[0.18em] uppercase" data-testid="contact-form-status">
          {status.state === "idle" && (
            <span className="text-white/40">channel · secure</span>
          )}
          {status.state === "loading" && (
            <span className="text-neon-cyan animate-pulse">› sending…</span>
          )}
          {status.state === "success" && (
            <span className="text-neon-lime">✓ {status.message}</span>
          )}
          {status.state === "error" && (
            <span className="text-neon-danger">✗ {status.message}</span>
          )}
        </div>
      </div>
    </motion.form>
  );
}
