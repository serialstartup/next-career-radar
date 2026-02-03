"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const FALLBACK_ROLES = ["Frontend Developer","Backend Developer","Full Stack Developer"];
const FALLBACK_COUNTRIES = ["United Kingdom","Germany","Ireland"];
const FALLBACK_JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "part-time", label: "Part-time" },
];

export function MarketFilterBar() {
  const router = useRouter();
  const search = useSearchParams();

  const role = search.get("role") || "Frontend Developer";
  const country = search.get("country") || "United Kingdom";
  const type = search.get("type") || "full-time";

  const baseQuery = useMemo(() => {
    const params = new URLSearchParams(search.toString());
    return params;
  }, [search]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(baseQuery.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/market?${params.toString()}`);
  }

  function resetFilters() {
    router.push(`/market`);
  }

  // meta fetch (roles, countries, job types)
  const [options, setOptions] = React.useState<{roles:string[];countries:string[];jobTypes:{value:string;label:string}[]}>({
    roles: FALLBACK_ROLES,
    countries: FALLBACK_COUNTRIES,
    jobTypes: FALLBACK_JOB_TYPES,
  })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(()=>{
    let active = true
    async function load(){
      try{
        setLoading(true)
        const base = process.env.NEXT_PUBLIC_BASE_URL
        const url = base ? `${base}/api/market/meta` : `/api/market/meta`
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        if(!active) return
        setOptions({ roles: json.roles || FALLBACK_ROLES, countries: json.countries || FALLBACK_COUNTRIES, jobTypes: json.jobTypes || FALLBACK_JOB_TYPES })
      }catch{
        setOptions({ roles: FALLBACK_ROLES, countries: FALLBACK_COUNTRIES, jobTypes: FALLBACK_JOB_TYPES })
      }finally{ setLoading(false) }
    }
    load()
    return ()=>{ active = false }
  },[])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" className="cursor-default">{role}</Badge>
      <Badge variant="outline" className="cursor-default">{country}</Badge>
      <Badge variant="outline" className="cursor-default capitalize">{JOB_TYPES.find(j=>j.value===type)?.label || type}</Badge>

      <div className="ml-auto flex flex-wrap gap-2">
        <Select value={role} onValueChange={(v)=>updateParam("role", v)} disabled={loading}>
          <SelectTrigger size="sm"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            {options.roles.map((r)=>(<SelectItem key={r} value={r}>{r}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={(v)=>updateParam("country", v)} disabled={loading}>
          <SelectTrigger size="sm"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            {options.countries.map((c)=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={(v)=>updateParam("type", v)} disabled={loading}>
          <SelectTrigger size="sm"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            {options.jobTypes.map((jt)=>(<SelectItem key={jt.value} value={jt.value}>{jt.label}</SelectItem>))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
      </div>
    </div>
  );
}
