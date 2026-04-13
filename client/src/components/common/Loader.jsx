export function Loader({ text = "Loading..." }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur">
      {text}
    </div>
  );
}
