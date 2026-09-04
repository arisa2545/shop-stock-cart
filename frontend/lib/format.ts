const thb = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
});

export function formatTHB(amount: number): string {
  return thb.format(amount);
}

export function formatPricePerUnit(amount: number, unit: string): string {
  return `${formatTHB(amount)} / ${unit}`;
}
