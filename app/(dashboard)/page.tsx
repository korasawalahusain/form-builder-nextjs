import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@ui/card';
import Link from 'next/link';
import { Suspense } from 'react';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Form } from '@prisma/client';
import { FaEdit } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { Skeleton } from '@ui/skeleton';
import { formatDistance } from 'date-fns';
import { Separator } from '@ui/separator';
import { FaWpforms } from 'react-icons/fa';
import { BiRightArrowAlt } from 'react-icons/bi';
import { getForms, getFormStats } from '@actions';
import { StatsCards, CreateFormButton } from '@components';

export default function Home() {
  return (
    <div className='container py-4'>
      <Suspense fallback={<StatsCards loading={true} />}>
        <StatsCardWrapper />
      </Suspense>
      <Separator className='my-6' />
      <h2 className='col-span-2 text-4xl font-bold'>Your forms</h2>
      <Separator className='my-6' />
      <div className='grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3'>
        <CreateFormButton />
        <Suspense
          fallback={[1, 1, 1, 1].map((_, index) => (
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

function FormCardSkeleton() {
  return <Skeleton className='h-[190px] w-full border-2 border-primary/20' />;
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
        <CardTitle className='flex items-center justify-between gap-2'>
          <span className='truncate font-bold'>{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant='destructive'>Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-sm text-muted-foreground'>
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {form.published && (
            <span className='flex items-center gap-2'>
              <LuView className='text-muted-foreground' />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className='text-muted-foreground' />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
        {form.description || 'No description'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className='text-md mt-2 w-full gap-4'>
            <Link href={`/forms/${form.id}`}>
              View Submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant='secondary'
            className='text-md mt-2 w-full gap-4'
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
