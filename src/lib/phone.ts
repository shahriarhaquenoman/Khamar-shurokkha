export function normalizeBangladeshPhone(input: string): string {
  const asciiDigits = input.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
  let digits = asciiDigits.replace(/\D/g, '');

  if (digits.startsWith('00880')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `88${digits}`;
  else if (digits.startsWith('1')) digits = `880${digits}`;

  if (!/^8801[3-9]\d{8}$/.test(digits)) {
    throw new Error('invalid_phone');
  }

  return `+${digits}`;
}

export function phoneLoginEmail(phone: string): string {
  const normalized = normalizeBangladeshPhone(phone);
  return `farmer-${normalized.replace(/\D/g, '')}@phone.khamar-shurokkha.invalid`;
}
