import { AreaChart, Card } from '@tremor/react';

const chartdata = [
  {
    date: 'Apr 23',
    Public: 3470,
    'Private': 2108,
  },
  {
    date: 'May 23',
    Public: 3475,
    'Private': 1812,
  },
  {
    date: 'Jun 23',
    Public: 3129,
    'Private': 1726,
  },
  {
    date: 'Jul 23',
    Public: 3490,
    'Private': 1982,
  },
  {
    date: 'Aug 23',
    Public: 2903,
    'Private': 2012,
  },
  {
    date: 'Sep 23',
    Public: 2643,
    'Private': 2342,
  },
  {
    date: 'Oct 23',
    Public: 2837,
    'Private': 2473,
  },
  {
    date: 'Nov 23',
    Public: 2954,
    'Private': 3848,
  },
  {
    date: 'Dec 23',
    Public: 3239,
    'Private': 3736,
  },
  {
    date: 'Jan 24',
    Public: 2890,
    'Private': 2338,
  },
  {
    date: 'Feb 24',
    Public: 2756,
    'Private': 2103,
  },
  {
    date: 'Mar 24',
    Public: 3322,
    'Private': 2194,
  },
];

const dataFormatter = (number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

export default function TrafficAreaChart() {
  return (
    <Card>
        <AreaChart
          className="h-80"
          data={chartdata}
          index="date"
          categories={['Public', 'Private']}
          colors={['indigo', 'rose']}
          yAxisWidth={60}
          onValueChange={(v) => console.log(v)}
        />
    </Card>
  );
}