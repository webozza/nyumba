const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const isValidNumber = (number: string) => {
  if (!number) return true;
  const m = number.replace(/[^0-9]/g, "");
  return /^\d{10}$/.test(m);
};

const Validations = {
  isValidEmail,
  isValidNumber,
};

export default Validations;
