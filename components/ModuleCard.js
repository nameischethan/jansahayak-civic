import Link from "next/link";
import * as Icons from "lucide-react";

export default function ModuleCard({ href, icon, title, desc, badge }) {
  const Icon = Icons[icon] || Icons.Grid;
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2.5 bg-white rounded-2xl shadow-card border border-slate-100 p-4 hover:border-saffron-400 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl bg-navy-800 group-hover:bg-saffron-500 flex items-center justify-center transition-colors">
          <Icon size={22} className="text-white" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wide bg-saffron-50 text-saffron-600 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-sm font-bold text-navy-800 leading-snug">{title}</h3>
      <p className="text-xs text-slate-500 leading-snug">{desc}</p>
    </Link>
  );
}
