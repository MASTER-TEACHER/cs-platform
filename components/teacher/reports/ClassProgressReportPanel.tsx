"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Card from "@/components/ui/Card";
import { buildClassProgressReport } from "@/services/reporting/classProgressReportService";
import { classReportToCsv } from "@/services/reporting/reportCsvService";
import type { ClassProgressReport } from "@/types/reporting";
export default function ClassProgressReportPanel({teacherId,classId}:{teacherId:string;classId:string}){
 const [report,setReport]=useState<ClassProgressReport|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{let cancelled=false;(async()=>{try{setLoading(true);const r=await buildClassProgressReport({teacherId,classId});if(!cancelled)setReport(r);}finally{if(!cancelled)setLoading(false);}})();return()=>{cancelled=true}},[teacherId,classId]);
 if(loading)return <Card><div className="h-56 animate-pulse rounded-2xl bg-slate-100"/></Card>; if(!report)return null;
 function exportCsv(){const blob=new Blob([classReportToCsv(report!)],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`${report!.className.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-progress-report.csv`;a.click();URL.revokeObjectURL(u);}
 return <Card className="overflow-hidden rounded-3xl border border-slate-200">
  <div className="flex flex-col gap-4 bg-gradient-to-r from-teal-950 to-cyan-800 p-6 text-white lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">Class report</p><h2 className="mt-2 text-2xl font-black">{report.className}</h2></div><button onClick={exportCsv} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-teal-950"><Download className="h-4 w-4"/>Export CSV</button></div>
  <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Average working" value={report.averageWorkingGrade||'—'}/><Metric label="Average target" value={report.averageTargetGrade||'—'}/><Metric label="On / above target" value={`${report.onOrAboveTargetPercentage}%`}/><Metric label="Completion" value={`${report.averageCompletionRate}%`}/></div>
  <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2"><TopicList title="Strongest curriculum areas" items={report.strongestTopics}/><TopicList title="Priority curriculum areas" items={report.priorityTopics}/></div>
 </Card>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>}
function TopicList({title,items}:{title:string;items:Array<{topic:string;mastery:number}>}){return <div className="rounded-2xl bg-slate-50 p-5"><p className="font-black text-slate-900">{title}</p><div className="mt-4 space-y-2">{items.map(i=><div key={i.topic} className="flex items-center justify-between rounded-xl bg-white px-4 py-3"><span className="text-sm font-bold text-slate-700">{i.topic}</span><span className="text-sm font-black text-slate-950">{i.mastery}%</span></div>)}</div></div>}
