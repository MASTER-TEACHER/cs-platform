"use client";
import { useEffect, useState } from "react";
import { Download, FileText, Target, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { buildStudentProgressReport } from "@/services/reporting/studentProgressReportService";
import { studentReportToCsv } from "@/services/reporting/reportCsvService";
import type { StudentProgressReport } from "@/types/reporting";

export default function StudentProgressReportPanel({teacherId,studentId}:{teacherId:string;studentId:string}){
 const [report,setReport]=useState<StudentProgressReport|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 useEffect(()=>{let cancelled=false; (async()=>{try{setLoading(true);setError("");const r=await buildStudentProgressReport({teacherId,studentId});if(!cancelled)setReport(r);}catch(e){if(!cancelled)setError(e instanceof Error?e.message:"Student report could not be generated.");}finally{if(!cancelled)setLoading(false);}})(); return()=>{cancelled=true};},[teacherId,studentId]);
 if(loading)return <Card><div className="h-64 animate-pulse rounded-2xl bg-slate-100"/></Card>;
 if(error||!report)return error?<Card className="border border-amber-200 bg-amber-50">{error}</Card>:null;
 function exportCsv(){const blob=new Blob([studentReportToCsv(report!)],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`${report!.studentName.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-progress-report.csv`;a.click();URL.revokeObjectURL(u);}
 return <Card className="overflow-hidden rounded-3xl border border-slate-200">
  <div className="flex flex-col gap-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
   <div><p className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">Progress report</p><h2 className="mt-2 text-2xl font-black">{report.studentName}</h2><p className="mt-2 text-sm text-white/70">{report.className}</p></div>
   <button onClick={exportCsv} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-violet-950"><Download className="h-4 w-4"/>Export CSV</button>
  </div>
  <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
   <Metric label="Working grade" value={report.workingGrade||'—'}/><Metric label="Target grade" value={report.targetGrade||'—'}/><Metric label="Marks to next grade" value={report.marksToNextGrade===null?'—':String(report.marksToNextGrade)}/><Metric label="Completion" value={`${report.completionRate}%`}/>
  </div>
  <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
   <ReportList title="Strengths" icon={<TrendingUp className="h-4 w-4"/>} items={report.strengths.map(x=>`${x.topic} — ${x.mastery}% mastery`)}/>
   <ReportList title="Priority areas" icon={<Target className="h-4 w-4"/>} items={report.priorities.map(x=>`${x.topic} — ${x.mastery}% mastery`)}/>
   <ReportList title="Teacher commentary" icon={<FileText className="h-4 w-4"/>} items={report.teacherCommentary}/>
   <ReportList title="Student next steps" icon={<Target className="h-4 w-4"/>} items={report.studentNextSteps}/>
  </div>
 </Card>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>}
function ReportList({title,icon,items}:{title:string;icon:React.ReactNode;items:string[]}){return <div className="rounded-2xl bg-slate-50 p-5"><div className="flex items-center gap-2">{icon}<p className="font-black text-slate-900">{title}</p></div><div className="mt-4 space-y-2">{items.length?items.map(x=><p key={x} className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700">{x}</p>):<p className="text-sm text-slate-500">No report items available yet.</p>}</div></div>}
