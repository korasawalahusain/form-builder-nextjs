import Link from "next/link";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { FaWpforms } from "react-icons/fa";
import { ReactNode, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { BiRightArrowAlt } from "react-icons/bi";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateFormButton } from "@/components/index";
import { Separator } from "@/components/ui/separator";
import { getForms, getFormStats, GetFormStatsReturn } from "@/actions/form";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <StatsCardWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="font-bold text-4xl col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton />
        <Suspense
          fallback={[1].map((_, index) => (
            <FormCardSkeleton key={index} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
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

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />;
}

async function FormCards() {
  const forms: Form[] = await getForms();

  return forms.map((form, index) => <FormCard key={index} form={form} />);
}

type FormCardProps = {
  form: Form;
};

function FormCard({ form }: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View Submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant="secondary"
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/builder/${form.id}`}>
              Edit Form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
