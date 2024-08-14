import { cn } from '@lib';
import { FormStats } from '@actions';
import StatsCard from './stats-card';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';

type StatsCardsProps = {
  loading: boolean;
  data?: FormStats;
  className?: string;
};

export default function StatsCards({
  data,
  loading,
  className,
}: StatsCardsProps) {
  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      <StatsCard
        loading={loading}
        title='Total Visits'
        helperText='All time form visits'
        className='shadow-md shadow-blue-600'
        value={data?.visits.toLocaleString() ?? ''}
        icon={<LuView className='text-blue-600' />}
      />
      <StatsCard
        loading={loading}
        title='Total Submissions'
        helperText='All time form submissions'
        className='shadow-md shadow-yellow-600'
        value={data?.submissions.toLocaleString() ?? ''}
        icon={<FaWpforms className='text-yellow-600' />}
      />
      <StatsCard
        loading={loading}
        title='Submission Rate'
        className='shadow-md shadow-green-600'
        helperText='Visits that result in form submission'
        icon={<HiCursorClick className='text-green-600' />}
        value={data?.submissionRate.toLocaleString() + '%' || ''}
      />
      <StatsCard
        loading={loading}
        title='Bounce Rate'
        className='shadow-md shadow-red-600'
        helperText='Visits that leave without interacting'
        icon={<TbArrowBounce className='text-red-600' />}
        value={data?.bounceRate.toLocaleString() + '%' || ''}
      />
    </div>
  );
}
