import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Line({ w = "w-full" }: { w?: string }) {
  return <div className={`h-3 bg-muted rounded ${w}`} />
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1,2,3].map(i=> (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <Line w="w-1/3" />
            <Line w="w-1/4" />
            <Line w="w-1/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Demanded Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_,i)=> (
          <div className="space-y-2" key={i}>
            <Line w="w-1/2" />
            <div className="h-2 bg-muted rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SalarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Insights (Yearly)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Line /><Line /><Line />
        </div>
        <div className="h-3 bg-muted rounded-full" />
        <div className="grid gap-2 md:grid-cols-3">
          {[1,2,3].map(i=> (
            <div key={i} className="rounded-md border p-3 space-y-2">
              <Line w="w-1/2" />
              <Line w="w-3/4" />
              <Line w="w-1/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

