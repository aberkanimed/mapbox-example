import { DonutChart, Legend, Card } from '@tremor/react';

const sales = [
  {
    name: 'Private',
    sales: 980,
  },
  {
    name: 'Public',
    sales: 456,
  },
];

const valueFormatter = (number) =>`${Intl.NumberFormat('us').format(number).toString()}`;

export default function TrafficModeChart() {
  return (
    <>
    <Card>
      <div className="flex items-center justify-center space-x-6">
        <DonutChart
          data={sales}
          category="sales"
          index="name"
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
          className="w-40"
        />
        <Legend
          categories={['Private', 'Public']}
          colors={['blue', 'cyan']}
          className="max-w-xs"
        />
      </div>
    </Card>
    </>
  );
}