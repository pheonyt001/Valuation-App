import { CalculationResult } from "../types";
import { Printer, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ResultCard({result}:{result:CalculationResult}) {
  const [show,setShow]=useState(true);
  const formatted=result.resultLabel==="Yield"||result.resultLabel==="LTV"||result.resultLabel==="IRR"
    ? `${result.result.toLocaleString("en-NG",{maximumFractionDigits:4})}%`
    : `₦${result.result.toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  return <section className="print-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-5 mt-5">
    <div className="flex items-start justify-between gap-4">
      <div><div className="text-sm text-slate-500">{result.resultLabel}</div><div className="text-3xl font-bold mt-1 break-words">{formatted}</div></div>
      <button onClick={()=>window.print()} className="no-print p-2 rounded-lg border border-slate-200 dark:border-slate-700" title="Print"><Printer size={18}/></button>
    </div>
    <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4">
      <div className="font-semibold">Formula</div><div className="mt-1 font-mono text-sm bg-slate-50 dark:bg-slate-950 rounded-xl p-3">{result.formula}</div>
      <button onClick={()=>setShow(v=>!v)} className="no-print mt-4 text-sm font-semibold flex items-center gap-1">{show?"Hide":"Show"} full working <ChevronDown size={16}/></button>
      {show && <div className="mt-3 space-y-2 text-sm">{result.working.map((w,i)=><div key={i} className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3 font-mono">{w}</div>)}</div>}
      {result.notes?.map((n,i)=><p key={i} className="mt-4 text-xs text-amber-700 dark:text-amber-300">{n}</p>)}
    </div>
  </section>
}