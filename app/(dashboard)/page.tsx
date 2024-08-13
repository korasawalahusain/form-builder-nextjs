import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { ReactNode, Suspense } from "react";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getFormStats, GetFormStatsReturn } from "@/actions/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <StatsCardWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="font-bold text-4xl col-span-2">Your forms</h2>
      <Separator className="my-6" />
    </div>
  );
}

async function StatsCardWrapper() {
  const stats = await getFormStats();

  return <StatsCards data={stats} loading={false} />;
}

type StatsCardsProps = {
  loading: boolean;
  data?: GetFormStatsReturn;
};

function StatsCards({ data, loading }: StatsCardsProps) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        loading={loading}
        title="Total Visits"
        helperText="All time form visits"
        className="shadow-md shadow-blue-600"
        value={data?.visits.toLocaleString() ?? ""}
        icon={<LuView className="text-blue-600" />}
      />
      <StatsCard
        loading={loading}
        title="Total Submissions"
        helperText="All time form submissions"
        className="shadow-md shadow-yellow-600"
        value={data?.visits.toLocaleString() ?? ""}
        icon={<FaWpforms className="text-yellow-600" />}
      />
      <StatsCard
        loading={loading}
        title="Submission Rate"
        className="shadow-md shadow-green-600"
        value={data?.visits.toLocaleString() + "%" || ""}
        helperText="Visits that result in form submission"
        icon={<HiCursorClick className="text-green-600" />}
      />
      <StatsCard
        loading={loading}
        title="Bounce Rate"
        className="shadow-md shadow-red-600"
        value={data?.visits.toLocaleString() + "%" || ""}
        helperText="Visits that leave without interacting"
        icon={<TbArrowBounce className="text-red-600" />}
      />
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  loading: boolean;
  className: string;
  helperText: string;
};

function StatsCard({
  icon,
  title,
  value,
  loading,
  className,
  helperText,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}
