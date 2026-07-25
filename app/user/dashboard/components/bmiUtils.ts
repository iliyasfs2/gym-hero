export function calculatePreciseBMI(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;

  const heightInMeters = heightCm / 100;
  const bmi = weightKg / (heightInMeters * heightInMeters);

  const preciseBmi = Number(bmi.toFixed(2));

  let category = "";
  let color = "";

  if (preciseBmi < 18.5) {
    category = "Underweight";
    color = "#f59e0b";
  } else if (preciseBmi >= 18.5 && preciseBmi < 24.99) {
    category = "Normal weight";
    color = "#10b981";
  } else if (preciseBmi >= 25 && preciseBmi < 29.99) {
    category = "Overweight";
    color = "#f97316";
  } else {
    category = "Obese";
    color = "#ef4444";
  }

  return { bmi: preciseBmi, category, color };
}
