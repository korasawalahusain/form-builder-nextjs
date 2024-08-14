import React from 'react';
import { FormWithStats, getFormWithStatsById } from '@actions';
import { StatsCards, VisitButton, FormLinkShare } from '@components';

type Props = {
  params: { id: string };
};

export default async function BuilderPage({ params: { id } }: Props) {
  const form: FormWithStats = await getFormWithStatsById(Number(id));

  return (
    <>
      <div className='border-b border-muted py-10'>
        <div className='container flex justify-between'>
          <h1 className='truncate text-4xl font-bold'>{form.name}</h1>
          <VisitButton formUrl={form.shareURL} />
        </div>
      </div>
      <div className='border-b border-muted py-4'>
        <div className='container flex items-center justify-between gap-2'>
          <FormLinkShare formUrl={form.shareURL} />
        </div>
      </div>

      <StatsCards
        loading={false}
        className='container'
        data={{
          visits: form.visits,
          bounceRate: form.bounceRate,
          submissions: form.submissions,
          submissionRate: form.submissionRate,
        }}
      />

      <div className='container pt-10'>
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

type SubmissionsTableProps = {
  id: number;
};

function SubmissionsTable({ id }: SubmissionsTableProps) {
  return <></>;
}
