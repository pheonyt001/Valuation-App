import { useState } from "react";
import { Calculator } from "../data";
import { calculate } from "../lib/calculations";
import { CalculationResult } from "../types";
import { RotateCcw, Calculator as CalcIcon } from "lucide-react";

export default function CalculatorForm({item,onResult}:{item:Calculator;onResult:(r:CalculationResult,inputs:Record<string,string>)=>void}) {
  const [values,setValues]=useState<Record<string,string>>({});
  const [error,setError]=useState("");
  const submit=(e:React.FormEvent)=>{e.preventDefault();setError("");try{const r=calculate(item.id,values);onResult(r,values)}catch(err){setError(err instanceof Error?err.message:"Unable to calculate.");}};
  return <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft">
    <div className="grid sm:grid-cols-2 gap-4">
      {item.fields.map(field=><label key={field.key} className="block">
        <span className="text-sm font-medium">{field.label}</span>
        <div className="relative mt-1">
          <input required={field.type!=="text"} type={field.type==="text"?"text":"number"} min={field.min} step={field.step} placeholder={field.placeholder}
            value={values[field.key]??""} onChange={e=>setValues(v=>({...v,[field.key]:e.target.value}))}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-400 pr-14"/>
          {field.unit && <span className="absolute right-3 top-3 text-sm text-slate-500">{field.unit}</span>}
        </div>
      </label>)}
    </div>
    {error && <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-3 text-sm">{error}</div>}
    <div className="flex gap-3 mt-5">
      <button className="flex-1 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 font-semibold flex items-center justify-center gap-2"><CalcIcon size={18}/> Calculate</button>
      <button type="button" onClick={()=>setValues({})} className="px-4 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-2"><RotateCcw size={17}/> Clear</button>
    </div>
  </form>
}