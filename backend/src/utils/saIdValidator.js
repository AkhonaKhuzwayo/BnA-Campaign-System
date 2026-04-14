// Validates South African ID number (13 digits, Luhn check)
function validateSAId(id) {
  if (!/^\d{13}$/.test(id)) return false;
  let total = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(id[i], 10);
    if (i % 2 === 0) {
      total += digit;
    } else {
      const doubled = digit * 2;
      total += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  const checkDigit = (10 - (total % 10)) % 10;
  return checkDigit === parseInt(id[12], 10);
}
module.exports = { validateSAId };
