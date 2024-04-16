import { RiAlarmWarningLine, RiCheckboxCircleLine } from '@remixicon/react';
import { Callout, Card } from '@tremor/react';

export default function CalloutUsageExample() {
  return (
    <div className="flex gap-5">
      <Card>
        <p className="text-tremor-default text-tremor-content">Crowed level: High</p>
        <p className="text-3xl text-red-600 font-semibold">82</p>
        <Callout
          className="mt-4"
          title="Critical Crowd Area"
          icon={RiAlarmWarningLine}
          color="rose"
        >
          Plaza de Arriola
        </Callout>
      </Card>
    </div>
  );
}