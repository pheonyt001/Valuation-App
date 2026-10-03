import { Calculator } from "../data";
import { Calculator as CalcIcon } from "lucide-react";

export default function CalculatorCard({item,onClick}:{item:Calculator;onClick:()=>void}) {
  return <button onClick={onClick} className="text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft hover:-translate-y-0.5 hover:border-slate-400 transition">
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4"><CalcIcon size={20}/></div>
    <div className="font-semibold">{item.name}</div>
    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</div>
  </button>
}