import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

const CURRENT_GST_RATE = 0.15;
const CURRENT_COMPANY_TAX_RATE = 0.28;
const PROPOSED_STANDARD_GST_RATE = 0.3;
const PROPOSED_PREMIUM_GST_RATE = 0.5;
const PROPOSED_COMPANY_PROFIT_THRESHOLD = 1_000_000;
const PROPOSED_COMPANY_TAX_RATE = 0.25;
const PROPOSED_LVT_RATE = 0.05;
const YEAR_10_LAND_VALUE_INDEX = 0.78;
const TRAINING_STUDENTS_PER_COHORT = 12;
const TRAINING_STAFF_PER_COHORT = 2;
const TRAINING_STAFF_FTE_ALLOCATION = 0.3;
const TRAINING_STAFF_AVERAGE_SALARY = 85_000;
const TRAINING_EMPLOYER_ON_COST_RATE = 0.25;
const TRAINING_FACILITIES_COST_PER_COHORT = 15_000;
const MEDIUM_COMPANY_TRAINING_COHORTS = 2;
const CURRENT_SYSTEM_REFERENCE_REVENUE = 30;
const CURRENT_SYSTEM_REFERENCE_NEED = 35;
const POLICY_FUNDING_NEED_LOW = 16;
const POLICY_FUNDING_NEED_HIGH = 21.5;
const POLICY_LVT_LOW = 5;
const POLICY_LVT_HIGH = 10;
const POLICY_LVT_MIDPOINT = (POLICY_LVT_LOW + POLICY_LVT_HIGH) / 2;

const incomeTaxBrackets = [
  { upperBound: 15_600, rate: 0.105 },
  { upperBound: 53_500, rate: 0.175 },
  { upperBound: 78_100, rate: 0.3 },
  { upperBound: 180_000, rate: 0.33 },
  { upperBound: Number.POSITIVE_INFINITY, rate: 0.39 },
];

function calculateIncomeTax(annualIncome: number) {
  let tax = 0;
  let previousUpperBound = 0;

  for (const bracket of incomeTaxBrackets) {
    const taxableAmount = Math.max(
      Math.min(annualIncome, bracket.upperBound) - previousUpperBound,
      0,
    );
    tax += taxableAmount * bracket.rate;
    previousUpperBound = bracket.upperBound;

    if (annualIncome <= bracket.upperBound) break;
  }

  return tax;
}

function calculateCompanyTax(annualProfit: number, profitThreshold: number, taxRate: number) {
  return Math.max(annualProfit - profitThreshold, 0) * taxRate;
}

function calculateGst(standardRate: number, standardSpending: number, premiumSpending = 0) {
  return standardSpending * standardRate + premiumSpending * PROPOSED_PREMIUM_GST_RATE;
}

type HouseholdTaxScenario = {
  household: string;
  housing: string;
  salaryIncome: number;
  salaryCount: number;
  companyProfit: number;
  landValue: number;
  improvementValue: number;
  occupants: number;
  currentTaxableSpending: number;
  proposedStandardSpending: number;
  proposedPremiumSpending: number;
  currentCouncilRates: number;
  trainingCohorts: number;
};

type HouseholdTaxBreakdown = HouseholdTaxScenario & {
  currentIncomeTax: number;
  currentCompanyTax: number;
  currentGst: number;
  proposedIncomeTax: number;
  proposedCompanyTax: number;
  proposedLvt: number;
  proposedLocalRates: number;
  proposedGst: number;
  trainingCompanyScale: string;
  trainingStudentCount: number;
  trainingStaffCount: number;
  trainingSalaryCost: number;
  trainingEmployerOnCosts: number;
  trainingFacilitiesCost: number;
  annualTrainingContribution: number;
  currentTotal: number;
  proposedTotal: number;
};

const householdTaxScenarios: readonly HouseholdTaxScenario[] = [
  {
    household: 'Poorest renter',
    housing: 'Rented NZ$450k home; no land owned',
    salaryIncome: 50_000,
    salaryCount: 1,
    companyProfit: 0,
    landValue: 0,
    improvementValue: 0,
    occupants: 1,
    currentTaxableSpending: 30_000,
    proposedStandardSpending: 5_000,
    proposedPremiumSpending: 0,
    currentCouncilRates: 0,
    trainingCohorts: 0,
  },
  {
    household: 'Average owner',
    housing: 'NZ$950k home: NZ$450k land + NZ$500k improvements',
    salaryIncome: 60_000,
    salaryCount: 2,
    companyProfit: 0,
    landValue: 450_000,
    improvementValue: 500_000,
    occupants: 4,
    currentTaxableSpending: 45_000,
    proposedStandardSpending: 20_000,
    proposedPremiumSpending: 0,
    currentCouncilRates: 4_000,
    trainingCohorts: 0,
  },
  {
    household: 'Richest owner',
    housing: 'NZ$4m home: NZ$3m land + NZ$1m improvements',
    salaryIncome: 150_000,
    salaryCount: 1,
    companyProfit: 2_000_000,
    landValue: 3_000_000,
    improvementValue: 1_000_000,
    occupants: 2,
    currentTaxableSpending: 200_000,
    proposedStandardSpending: 100_000,
    proposedPremiumSpending: 100_000,
    currentCouncilRates: 8_000,
    trainingCohorts: MEDIUM_COMPANY_TRAINING_COHORTS,
  },
];

function getTrainingCompanyScale(trainingCohorts: number) {
  if (trainingCohorts === 0) return 'No company allocation';
  if (trainingCohorts === 1) return 'Small company';
  if (trainingCohorts === MEDIUM_COMPANY_TRAINING_COHORTS) return 'Medium company';
  return 'Large company';
}

function calculateTrainingContribution(trainingCohorts: number) {
  const trainingStudentCount = trainingCohorts * TRAINING_STUDENTS_PER_COHORT;
  const trainingStaffCount = trainingCohorts * TRAINING_STAFF_PER_COHORT;
  const trainingSalaryCost =
    trainingStaffCount * TRAINING_STAFF_FTE_ALLOCATION * TRAINING_STAFF_AVERAGE_SALARY;
  const trainingEmployerOnCosts = trainingSalaryCost * TRAINING_EMPLOYER_ON_COST_RATE;
  const trainingFacilitiesCost = trainingCohorts * TRAINING_FACILITIES_COST_PER_COHORT;

  return {
    trainingCompanyScale: getTrainingCompanyScale(trainingCohorts),
    trainingStudentCount,
    trainingStaffCount,
    trainingSalaryCost,
    trainingEmployerOnCosts,
    trainingFacilitiesCost,
    annualTrainingContribution:
      trainingSalaryCost + trainingEmployerOnCosts + trainingFacilitiesCost,
  };
}

function calculateHouseholdTaxBreakdown(scenario: HouseholdTaxScenario): HouseholdTaxBreakdown {
  const currentIncomeTax = calculateIncomeTax(scenario.salaryIncome) * scenario.salaryCount;
  const currentCompanyTax = calculateCompanyTax(
    scenario.companyProfit,
    0,
    CURRENT_COMPANY_TAX_RATE,
  );
  const currentGst = calculateGst(CURRENT_GST_RATE, scenario.currentTaxableSpending);
  const proposedIncomeTax = 0;
  const proposedCompanyTax = calculateCompanyTax(
    scenario.companyProfit,
    PROPOSED_COMPANY_PROFIT_THRESHOLD,
    PROPOSED_COMPANY_TAX_RATE,
  );
  const proposedLvt = scenario.landValue * YEAR_10_LAND_VALUE_INDEX * PROPOSED_LVT_RATE;
  const proposedLocalRates = scenario.improvementValue * 0.001 * scenario.occupants;
  const proposedGst = calculateGst(
    PROPOSED_STANDARD_GST_RATE,
    scenario.proposedStandardSpending,
    scenario.proposedPremiumSpending,
  );
  const currentTotal =
    currentIncomeTax + currentCompanyTax + currentGst + scenario.currentCouncilRates;
  const proposedTotal =
    proposedIncomeTax + proposedCompanyTax + proposedLvt + proposedLocalRates + proposedGst;
  const trainingContribution = calculateTrainingContribution(scenario.trainingCohorts);

  return {
    ...scenario,
    currentIncomeTax,
    currentCompanyTax,
    currentGst,
    proposedIncomeTax,
    proposedCompanyTax,
    proposedLvt,
    proposedLocalRates,
    proposedGst,
    ...trainingContribution,
    currentTotal,
    proposedTotal,
  };
}

const householdTaxBreakdowns = householdTaxScenarios.map(calculateHouseholdTaxBreakdown);

const trainingContributionScaleRows = [
  { label: 'Small company', cohorts: 1 },
  { label: 'Medium company', cohorts: MEDIUM_COMPANY_TRAINING_COHORTS },
  { label: 'Large company', cohorts: 4 },
].map(({ label, cohorts }) => ({
  label,
  cohorts,
  ...calculateTrainingContribution(cohorts),
}));

const householdTaxData = householdTaxBreakdowns.map(
  ({ household, currentTotal, proposedTotal, annualTrainingContribution }) => ({
    household,
    current: currentTotal,
    proposed: proposedTotal,
    trainingContribution: annualTrainingContribution,
  }),
);

const householdTaxConfig = {
  current: { label: 'Current system', color: 'var(--chart-3)' },
  proposed: { label: 'Proposed taxes (Year 10)', color: 'var(--chart-1)' },
  trainingContribution: {
    label: 'Company training contribution (not tax)',
    color: 'var(--chart-2)',
  },
};

const transitionData = [
  { year: 'Year 1', landPrice: 100, lvtBill: 100, takeHome: 100 },
  { year: 'Year 5', landPrice: 88, lvtBill: 108, takeHome: 112 },
  { year: 'Year 10', landPrice: 78, lvtBill: 90, takeHome: 125 },
];

const transitionConfig = {
  landPrice: { label: 'House / land price', color: 'var(--chart-3)' },
  lvtBill: { label: 'LVT bill', color: 'var(--chart-1)' },
  takeHome: { label: 'Wage / take-home index', color: 'var(--chart-2)' },
};

const trainingContributionData = [
  { programme: 'Ages 12–18 school day', coreInstruction: 2, companyTraining: 3 },
];

const trainingContributionConfig = {
  coreInstruction: { label: 'Core instruction', color: 'var(--chart-3)' },
  companyTraining: { label: 'Company-run training', color: 'var(--chart-1)' },
};

const revenueCompositionData = [
  { source: 'gst', value: 11, fill: 'var(--color-gst)' },
  { source: 'corporateTax', value: 3.5, fill: 'var(--color-corporateTax)' },
  { source: 'subsurfaceLevy', value: 1.6, fill: 'var(--color-subsurfaceLevy)' },
  { source: 'otherQuantified', value: 1.365, fill: 'var(--color-otherQuantified)' },
  { source: 'lvt', value: POLICY_LVT_MIDPOINT, fill: 'var(--color-lvt)' },
];

const revenueCompositionConfig = {
  gst: { label: 'Tiered GST', color: 'var(--chart-1)' },
  corporateTax: { label: 'Corporate/company tax', color: 'var(--chart-2)' },
  subsurfaceLevy: { label: 'Subsurface levy', color: 'var(--chart-3)' },
  otherQuantified: { label: 'Other quantified lines', color: 'var(--chart-4)' },
  lvt: { label: 'Land value tax (midpoint)', color: 'var(--chart-5)' },
};

const revenueCompositionTotal = revenueCompositionData.reduce(
  (total, item) => total + item.value,
  0,
);

const gdpFundingData = [
  {
    scenario: 'Current system',
    accruedRevenue: CURRENT_SYSTEM_REFERENCE_REVENUE,
    fundingNeed: CURRENT_SYSTEM_REFERENCE_NEED,
  },
  {
    scenario: 'Confirmed lines',
    accruedRevenue: revenueCompositionTotal - POLICY_LVT_MIDPOINT,
    fundingNeed: (POLICY_FUNDING_NEED_LOW + POLICY_FUNDING_NEED_HIGH) / 2,
  },
  {
    scenario: 'With LVT midpoint',
    accruedRevenue: revenueCompositionTotal,
    fundingNeed: (POLICY_FUNDING_NEED_LOW + POLICY_FUNDING_NEED_HIGH) / 2,
  },
];

const gdpFundingTickLabels: Record<string, string> = {
  'Current system': 'Current',
  'Confirmed lines': 'Confirmed',
  'With LVT midpoint': 'With LVT',
};

const gdpFundingConfig = {
  accruedRevenue: { label: 'Revenue accrued', color: 'var(--chart-1)' },
  fundingNeed: { label: 'Funding need', color: 'var(--chart-3)' },
};

export function RevenueCompositionChart() {
  return (
    <ChartContainer config={revenueCompositionConfig} className="min-h-[360px] w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="source"
              formatter={(value) => `${Number(value).toFixed(3)}% of GDP`}
            />
          }
        />
        <Pie
          data={revenueCompositionData}
          dataKey="value"
          nameKey="source"
          startAngle={90}
          endAngle={-270}
          isAnimationActive={false}
          innerRadius={68}
          outerRadius={112}
          paddingAngle={2}
          strokeWidth={2}
        >
          {revenueCompositionData.map((entry) => (
            <Cell key={entry.source} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="source"
              className="w-full flex-wrap gap-x-3 gap-y-1 px-2 text-center"
            />
          }
          height={64}
        />
      </PieChart>
    </ChartContainer>
  );
}

export function GdpFundingChart() {
  return (
    <ChartContainer config={gdpFundingConfig} className="min-h-[360px] w-full">
      <BarChart accessibilityLayer data={gdpFundingData} margin={{ left: 8, right: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="scenario"
          interval={0}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => gdpFundingTickLabels[String(value)] ?? String(value)}
        />
        <YAxis
          domain={[0, 40]}
          ticks={[0, 10, 20, 30, 40]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent formatter={(value) => `${Number(value).toFixed(1)}% of GDP`} />
          }
        />
        <ChartLegend
          content={<ChartLegendContent className="w-full flex-wrap gap-x-3 gap-y-1 px-2" />}
          height={48}
        />
        <Bar
          dataKey="accruedRevenue"
          fill="var(--color-accruedRevenue)"
          radius={4}
          maxBarSize={56}
        />
        <Bar dataKey="fundingNeed" fill="var(--color-fundingNeed)" radius={4} maxBarSize={56} />
      </BarChart>
    </ChartContainer>
  );
}

export function HouseholdTaxChart() {
  return (
    <ChartContainer config={householdTaxConfig} className="min-h-[320px] w-full">
      <BarChart accessibilityLayer data={householdTaxData} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="household" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent formatter={(value) => `NZ$${Number(value).toLocaleString()}`} />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="current"
          stackId="current-system"
          fill="var(--color-current)"
          radius={4}
          maxBarSize={56}
        />
        <Bar
          dataKey="proposed"
          stackId="proposed-policy"
          fill="var(--color-proposed)"
          radius={[0, 0, 4, 4]}
          maxBarSize={56}
        />
        <Bar
          dataKey="trainingContribution"
          stackId="proposed-policy"
          fill="var(--color-trainingContribution)"
          radius={[4, 4, 0, 0]}
          maxBarSize={56}
        />
      </BarChart>
    </ChartContainer>
  );
}

function formatCurrency(value: number) {
  return `NZ$${Math.round(value).toLocaleString('en-NZ')}`;
}

function formatSalaryIncome(scenario: HouseholdTaxBreakdown) {
  const salary = formatCurrency(scenario.salaryIncome);
  return scenario.salaryCount === 1
    ? salary
    : `${salary} x ${scenario.salaryCount} = ${formatCurrency(
        scenario.salaryIncome * scenario.salaryCount,
      )}`;
}

function BreakdownList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-1 text-xs leading-5 text-muted-foreground sm:text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function HouseholdTaxBreakdownTable() {
  return (
    <Table className="min-w-[900px]">
      <TableCaption className="caption-top mb-3 text-left leading-5">
        Direct recurring annual taxes in the same scenario used by the chart. Inheritance tax and
        securities-backed borrowing tax are excluded because they are event-based or conditional.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[18%]">Persona and inputs</TableHead>
          <TableHead className="w-[27%]">Current system</TableHead>
          <TableHead className="w-[27%]">Proposed policy, Year 10</TableHead>
          <TableHead className="w-[16%] text-right">Annual change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {householdTaxBreakdowns.map((scenario) => {
          const annualChange = scenario.proposedTotal - scenario.currentTotal;

          return (
            <TableRow key={scenario.household}>
              <TableCell className="whitespace-normal align-top">
                <div className="grid gap-2">
                  <strong className="font-heading text-sm text-foreground">
                    {scenario.household}
                  </strong>
                  <BreakdownList
                    items={[
                      scenario.housing,
                      `Salary income: ${formatSalaryIncome(scenario)}`,
                      `Company profit: ${formatCurrency(scenario.companyProfit)}`,
                      ...(scenario.trainingCohorts > 0
                        ? [
                            `Training scale: ${scenario.trainingCompanyScale}; ${scenario.trainingCohorts} cohorts / ${scenario.trainingStudentCount} students`,
                            `Training staff: ${scenario.trainingStaffCount} staff at ${TRAINING_STAFF_FTE_ALLOCATION} FTE each`,
                            `Training contribution: ${formatCurrency(scenario.annualTrainingContribution)} (not tax)`,
                          ]
                        : [
                            'Company training contribution: not included in this household scenario',
                          ]),
                    ]}
                  />
                </div>
              </TableCell>
              <TableCell className="whitespace-normal align-top">
                <BreakdownList
                  items={[
                    `Income tax: ${formatCurrency(scenario.currentIncomeTax)}`,
                    `Company tax: ${formatCurrency(scenario.currentCompanyTax)}`,
                    `GST: ${formatCurrency(scenario.currentGst)}`,
                    `Council rates: ${formatCurrency(scenario.currentCouncilRates)}`,
                    `Total: ${formatCurrency(scenario.currentTotal)}`,
                  ]}
                />
              </TableCell>
              <TableCell className="whitespace-normal align-top">
                <BreakdownList
                  items={[
                    'Personal income tax: NZ$0',
                    `Company tax: ${formatCurrency(scenario.proposedCompanyTax)}`,
                    `LVT: ${formatCurrency(scenario.proposedLvt)}`,
                    `Local rates: ${formatCurrency(scenario.proposedLocalRates)}`,
                    `GST: ${formatCurrency(scenario.proposedGst)}`,
                    `Tax total: ${formatCurrency(scenario.proposedTotal)}`,
                    ...(scenario.trainingCohorts > 0
                      ? [
                          `Tax + contribution: ${formatCurrency(scenario.proposedTotal + scenario.annualTrainingContribution)}`,
                        ]
                      : []),
                  ]}
                />
              </TableCell>
              <TableCell className="whitespace-normal text-right align-top font-semibold text-foreground">
                {annualChange > 0 ? '+' : ''}
                {formatCurrency(annualChange)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function TrainingContributionChart() {
  return (
    <ChartContainer config={trainingContributionConfig} className="min-h-[220px] w-full">
      <BarChart
        accessibilityLayer
        data={trainingContributionData}
        layout="vertical"
        margin={{ left: 8, right: 8 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <YAxis dataKey="programme" type="category" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value) => `${value} hours per school day`} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="coreInstruction"
          stackId="school-day"
          fill="var(--color-coreInstruction)"
          radius={[4, 0, 0, 4]}
          maxBarSize={56}
        />
        <Bar
          dataKey="companyTraining"
          stackId="school-day"
          fill="var(--color-companyTraining)"
          radius={[0, 4, 4, 0]}
          maxBarSize={56}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function TrainingContributionBreakdownTable() {
  return (
    <Table className="min-w-[920px]">
      <TableCaption className="caption-top mb-3 text-left leading-5">
        Illustrative annual cost sensitivity, not a statutory charge. Each 12-student cohort uses
        two staff at 0.3 FTE each, an NZ$85,000 average salary, 25% employer on-costs, and NZ$15,000
        for facilities and administration.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[18%]">Company scale</TableHead>
          <TableHead className="w-[18%]">Learner load</TableHead>
          <TableHead className="w-[20%]">Staff allocation</TableHead>
          <TableHead className="w-[15%]">Salary + on-costs</TableHead>
          <TableHead className="w-[14%]">Facilities/admin</TableHead>
          <TableHead className="w-[15%]">Estimated annual cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainingContributionScaleRows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="whitespace-normal align-top font-semibold text-foreground">
              {row.label}
            </TableCell>
            <TableCell className="whitespace-normal align-top text-muted-foreground">
              {row.cohorts} cohort{row.cohorts === 1 ? '' : 's'} / {row.trainingStudentCount}{' '}
              students
            </TableCell>
            <TableCell className="whitespace-normal align-top text-muted-foreground">
              {row.trainingStaffCount} staff x {TRAINING_STAFF_FTE_ALLOCATION} FTE each
            </TableCell>
            <TableCell className="whitespace-normal align-top text-muted-foreground">
              {formatCurrency(row.trainingSalaryCost + row.trainingEmployerOnCosts)}
            </TableCell>
            <TableCell className="whitespace-normal align-top text-muted-foreground">
              {formatCurrency(row.trainingFacilitiesCost)}
            </TableCell>
            <TableCell className="whitespace-normal align-top font-semibold text-foreground">
              {formatCurrency(row.annualTrainingContribution)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TransitionChart() {
  return (
    <ChartContainer config={transitionConfig} className="min-h-[320px] w-full">
      <LineChart accessibilityLayer data={transitionData} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          domain={[70, 130]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="landPrice"
          type="monotone"
          stroke="var(--color-landPrice)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          dataKey="lvtBill"
          type="monotone"
          stroke="var(--color-lvtBill)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          dataKey="takeHome"
          type="monotone"
          stroke="var(--color-takeHome)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
