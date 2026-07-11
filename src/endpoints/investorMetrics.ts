import { InvestorMetricsInput, InvestorMetricsOutput } from "../utils/schemas";

export function calculateMetrics(input: InvestorMetricsInput): InvestorMetricsOutput {
  const purchasePrice = input.purchase_price;
  const monthlyRent = input.monthly_rent;
  const downPaymentPercent = input.down_payment_percent;
  
  const interestRate = input.interest_rate ?? 7.0;
  const loanTermYears = input.loan_term_years ?? 30;
  const annualTaxes = input.annual_taxes ?? purchasePrice * 0.012;
  const annualInsurance = input.annual_insurance ?? 1200;
  const vacancyRate = input.vacancy_rate ?? 0.08;
  const managementFee = input.management_fee ?? 0.10;
  const estimatedRepairs = input.estimated_repairs ?? 0;

  // --- CALCS ---
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;

  let monthlyMortgage = 0;
  if (loanAmount > 0) {
    if (interestRate > 0) {
      const monthlyRate = (interestRate / 100) / 12;
      const numPayments = loanTermYears * 12;
      monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyMortgage = loanAmount / (loanTermYears * 12);
    }
  }

  const monthlyTaxes = annualTaxes / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyVacancy = monthlyRent * vacancyRate;
  const monthlyManagement = monthlyRent * managementFee;
  const monthlyRepairs = estimatedRepairs / 12;

  const monthlyExpenses = monthlyMortgage + monthlyTaxes + monthlyInsurance + monthlyVacancy + monthlyManagement + monthlyRepairs;
  const monthlyCashflow = monthlyRent - monthlyExpenses;

  // NOI is computed before mortgage (debt service)
  const annualNOI = (monthlyRent * 12) - ((monthlyTaxes + monthlyInsurance + monthlyVacancy + monthlyManagement + monthlyRepairs) * 12);
  const capRatePercent = (annualNOI / purchasePrice) * 100;

  let cashOnCashPercent = 0;
  if (downPayment > 0) {
    cashOnCashPercent = ((monthlyCashflow * 12) / downPayment) * 100;
  }

  // DSCR calculation
  let dscr = 0;
  const denominator = monthlyMortgage + monthlyTaxes + monthlyInsurance;
  if (denominator > 0) {
    dscr = monthlyRent / denominator;
  }

  const grossRentMultiplier = purchasePrice / (monthlyRent * 12);

  // Helper to round to 2 decimal places
  const r = (val: number) => parseFloat(val.toFixed(2));

  return {
    purchase_price: r(purchasePrice),
    down_payment: r(downPayment),
    loan_amount: r(loanAmount),
    monthly_mortgage: r(monthlyMortgage),
    monthly_rent: r(monthlyRent),
    monthly_expenses: r(monthlyExpenses),
    monthly_cashflow: r(monthlyCashflow),
    annual_noi: r(annualNOI),
    cap_rate_percent: r(capRatePercent),
    cash_on_cash_percent: r(cashOnCashPercent),
    dscr: r(dscr),
    gross_rent_multiplier: r(grossRentMultiplier)
  };
}
