import { BarChart, Card } from '@tremor/react';

export default function CrowdedAreaBarChart({chartdata}) {
  return (
    <>
        <Card>
        <BarChart
            data={chartdata}
            index="hour"
            categories={['density']}
            colors={['blue']}
            yAxisWidth={48}
        />
        </Card>
    </>
  );
}