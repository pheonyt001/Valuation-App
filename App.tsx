import { useEffect, useMemo, useState } from "react";
import { calculators, categories, formulas } from "./data";
import { CalculationResult, HistoryItem, CalcId } from "./types";
import CalculatorCard from "./components/CalculatorCard";
import CalculatorForm from "./components/CalculatorForm";
import ResultCard from "./components/ResultCard";
import { Search, Moon, Sun, Home, Calculator, History, BookOpen, Settings, ArrowLeft, Trash2, GraduationCap } from "lucide-react";

const HISTORY_KEY="pvcalc-history-v1";
const THEME_KEY="pvcalc-theme";

export default function App(){
  const [view,setView]=useState<"home"|"calculators"|"history"|"formulas"|"study"|"settings">("home");
  const [selected,setSelected]=useState<CalcId|"">("");
  const [query,setQuery]=useState("");
  const [result,setResult]=useState<CalculationResult|null>(null);
  const [history,setHistory]=useState<HistoryItem[]>(()=>{try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]")}catch{return []}});
  const [dark,setDark]=useState(()=>localStorage.getItem(THEME_KEY)==="dark");

  useEffect(()=>{document.documentElement.classList.toggle("dark",dark);localStorage.setItem(THEME_KEY,dark?"dark":"light")},[dark]);
  useEffect(()=>localStorage.setItem(HISTORY_KEY,JSON.stringify(history)),[history]);

  const item=calculators.find(c=>c.id===selected);
  const filtered=useMemo(()=>calculators.filter(c=>(c.name+" "+c.description+" "+c.category).toLowerCase().includes(query.toLowerCase())),[query]);

  function openCalc(id:CalcId){setSelected(id);setResult(null);setView("calculators")}
  function onResult(r:CalculationResult,inputs:Record<string,string>){
    setResult(r);
    setHistory(h=>[{...r,id:crypto.randomUUID(),calculator:selected as CalcId,createdAt:new Date().toISOString(),inputs},...h].slice(0,50));
  }

  return <div className="min-h-screen">
    <header className="no-print sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={()=>setView("home")} className="flex items-center gap-3 font-bold"><span className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 grid place-items-center"><Calculator size={19}/></span><span className="hidden sm:block">Property Valuation Calculator</span></button>
        <div className="flex items-center gap-2"><button onClick={()=>setDark(v=>!v)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700">{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {view==="home" && <HomeView openCalc={openCalc} setView={setView}/>}
      {view==="calculators" && <div>
        {item ? <div>
          <button onClick={()=>{setSelected("");setResult(null)}} className="no-print mb-5 flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={17}/> All calculators</button>
          <div className="mb-5"><div className="text-xs uppercase tracking-wider text-slate-500">{item.category}</div><h1 className="text-2xl sm:text-3xl font-bold mt-1">{item.name}</h1><p className="text-slate-500 mt-1">{item.description}</p></div>
          <CalculatorForm item={item} onResult={onResult}/>
          {result && <ResultCard result={result}/>}
        </div> : <CalculatorList query={query} setQuery={setQuery} filtered={filtered} openCalc={openCalc}/>}
      </div>}
      {view==="history" && <HistoryView history={history} openCalc={openCalc} clear={()=>setHistory([])}/>}
      {view==="formulas" && <FormulaView/>}
      {view==="study" && <StudyView openCalc={openCalc}/>}
      {view==="settings" && <SettingsView dark={dark} setDark={setDark}/>}
    </main>

    <nav className="no-print fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-2xl mx-auto grid grid-cols-5">
        {([["home","Home",Home],["calculators","Calculators",Calculator],["history","History",History],["formulas","Formulas",BookOpen],["settings","Settings",Settings]] as const).map(([id,label,Icon])=>
          <button key={id} onClick={()=>{setView(id);if(id!=="calculators")setSelected("")}} className={`py-3 text-xs flex flex-col items-center gap-1 ${view===id?"font-bold":"text-slate-500"}`}><Icon size={19}/>{label}</button>)}
      </div>
    </nav>
  </div>
}

function HomeView({openCalc,setView}:{openCalc:(id:CalcId)=>void;setView:(v:any)=>void}){
 return <div>
  <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-soft">
    <div className="max-w-3xl"><div className="text-sm opacity-70">Estate Management & Valuation — Nigeria</div><h1 className="text-3xl sm:text-5xl font-black mt-2">Property Valuation Calculations</h1><p className="mt-4 text-slate-300 max-w-2xl">Calculate valuation problems, see the formula, and study the complete working in one place.</p>
    <div className="flex flex-wrap gap-3 mt-6"><button onClick={()=>setView("calculators")} className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold">Open calculators</button><button onClick={()=>setView("study")} className="border border-slate-600 px-5 py-3 rounded-xl font-bold">Study mode</button></div></div>
  </section>
  <div className="grid sm:grid-cols-3 gap-4 mt-6">
    {calculators.slice(0,3).map(c=><CalculatorCard key={c.id} item={c} onClick={()=>openCalc(c.id)}/>)}
  </div>
  <div className="mt-8"><h2 className="text-xl font-bold">What this app covers</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">{categories.map(c=><div key={c} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 text-sm">{c}</div>)}</div></div>
  <p className="text-xs text-slate-500 mt-8">Educational and preliminary-estimation tool. Professional valuation requires appropriate evidence, assumptions, standards and applicable Nigerian law.</p>
 </div>
}

function CalculatorList({query,setQuery,filtered,openCalc}:{query:string;setQuery:(x:string)=>void;filtered:any[];openCalc:(id:CalcId)=>void}){
 return <div><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><h1 className="text-3xl font-bold">Calculators</h1><p className="text-slate-500 mt-1">Choose a valuation or investment calculation.</p></div><div className="relative w-full sm:w-80"><Search size={18} className="absolute left-3 top-3.5 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search calculators..." className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"/></div></div>
 {categories.map(cat=>{const list=filtered.filter(c=>c.category===cat);if(!list.length)return null;return <section key={cat} className="mb-7"><h2 className="font-bold mb-3">{cat}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(c=><CalculatorCard key={c.id} item={c} onClick={()=>openCalc(c.id)}/>)}</div></section>})}</div>
}

function HistoryView({history,openCalc,clear}:{history:HistoryItem[];openCalc:(id:CalcId)=>void;clear:()=>void}){
 return <div><div className="flex justify-between items-end mb-5"><div><h1 className="text-3xl font-bold">Calculation History</h1><p className="text-slate-500">Saved locally on this device.</p></div>{history.length>0&&<button onClick={clear} className="text-sm text-red-600 flex gap-1 items-center"><Trash2 size={16}/> Clear</button>}</div>
 {history.length===0?<div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">No calculations yet.</div>:<div className="space-y-3">{history.map(h=><button key={h.id} onClick={()=>openCalc(h.calculator)} className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between gap-4"><div><div className="font-semibold">{h.title}</div><div className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleString()}</div></div><div className="font-bold">{h.resultLabel}: {h.resultLabel==="Yield"||h.resultLabel==="LTV"||h.resultLabel==="IRR"?h.result.toFixed(2)+"%":"₦"+h.result.toLocaleString("en-NG",{maximumFractionDigits:2})}</div></button>)}</div>}</div>
}

function FormulaView(){
 return <div><h1 className="text-3xl font-bold">Formula Library</h1><p className="text-slate-500 mt-1 mb-6">Core formulas for property valuation calculations.</p><div className="grid lg:grid-cols-2 gap-4">{formulas.map(([name,formula,use])=><div key={name} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><h2 className="font-bold">{name}</h2><div className="font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-xl mt-3">{formula}</div><p className="text-sm text-slate-500 mt-3">{use}</p></div>)}</div></div>
}

function StudyView({openCalc}:{openCalc:(id:CalcId)=>void}){
 const topics=[["Years' Purchase","yp-term"],["Investment Method","investment"],["Term & Reversion","term-reversion"],["Residual Method","residual"],["DCF","dcf"],["IRR","irr"]] as const;
 return <div><div className="flex items-center gap-3"><GraduationCap/><div><h1 className="text-3xl font-bold">Study Mode</h1><p className="text-slate-500">Practice the calculations and open a calculator when ready.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">{topics.map(([name,id])=><button key={id} onClick={()=>openCalc(id)} className="text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-400"><div className="font-bold">{name}</div><p className="text-sm text-slate-500 mt-2">Open worked calculator</p></button>)}</div></div>
}

function SettingsView({dark,setDark}:{dark:boolean;setDark:(x:boolean)=>void}){
 return <div><h1 className="text-3xl font-bold">Settings</h1><div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between"><div><div className="font-semibold">Dark mode</div><div className="text-sm text-slate-500">Change the app appearance.</div></div><button onClick={()=>setDark(!dark)} className={`w-12 h-7 rounded-full p-1 ${dark?"bg-slate-900":"bg-slate-300"}`}><span className={`block w-5 h-5 rounded-full bg-white transition ${dark?"translate-x-5":""}`}/></button></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-5 text-sm text-amber-900 dark:text-amber-200"><strong>Educational disclaimer:</strong> This app is for educational and preliminary estimation purposes. Actual property valuation depends on property-specific evidence, assumptions, valuation date, professional standards and applicable Nigerian law.</div></div>
}