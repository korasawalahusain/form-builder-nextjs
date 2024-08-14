import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableHeader,
} from '@ui/table';
import {
  StatsCards,
  VisitButton,
  ElementsType,
  FormLinkShare,
  FormElementInstance,
} from '@components';
import {
  FormWithStats,
  getFormSubmissions,
  getFormWithStatsById,
} from '@actions';
import { Badge } from '@ui/badge';
import { Checkbox } from '@ui/checkbox';
import React, { ReactNode } from 'react';
import { format, formatDistance } from 'date-fns';

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

      <div className='container py-10'>
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

type SubmissionsTableProps = {
  id: number;
};

type ColumnType = {
  id: string;
  label: string;
  required: boolean;
  type: ElementsType;
};
type RowType = { [key: string]: string } & {
  submittedAt: Date;
};

const FormElements: ElementsType[] = [
  'TextField',
  'DateField',
  'NumberField',
  'SelectField',
  'CheckboxField',
  'TextAreaField',
];

async function SubmissionsTable({ id }: SubmissionsTableProps) {
  const form = await getFormSubmissions(id);

  const formElements: FormElementInstance[] = JSON.parse(form.content);
  const columns: ColumnType[] = formElements
    .filter((element) => FormElements.includes(element.type))
    .map((element) => ({
      id: element.id,
      type: element.type,
      label: element.extraAttributes.label,
      required: element.extraAttributes.required,
    }));
  const rows: RowType[] = form.formSubmissions.map((submission) => {
    const content = JSON.parse(submission.content);
    return {
      ...content,
      submittedAt: submission.createdAt,
    };
  });

  return (
    <>
      <h1 className='my-4 text-2xl font-bold'>Submissions</h1>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className='uppercase'>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className='text-right uppercase text-muted-foreground'>
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column, index) => (
                  <RowCell
                    key={index}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className='text-right text-muted-foreground'>
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

type RowCellProps = {
  value: string;
  type: ElementsType;
};

function RowCell({ type, value }: RowCellProps) {
  let node: ReactNode = value;

  switch (type) {
    case 'DateField':
      if (!value) break;
      node = <Badge variant='outline'>{format(new Date(value), 'PPP')}</Badge>;
      break;
    case 'CheckboxField':
      const checked = value === 'true';
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
