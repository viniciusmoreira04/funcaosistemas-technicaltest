using System.Linq;

namespace FI.WebAtividadeEntrevista.Validators
{
    public static class CPFValidator
    {
        public static bool IsValidCpf(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
            {
                return false;
            }

            cpf = cpf.Replace("-", "").Replace(".", "");


            if (cpf.Length != 11)
            {
                return false;
            }

            if (cpf.Any(c => !char.IsDigit(c)))
            {
                return false;
            }

            char firstChar = cpf.First();

            if (cpf.All(c => c == firstChar))
            {
                return false;
            }

            bool enforceCpfIntegrity = false;

            CalculateVerifyingDigits(cpf, out int firstDigit, out int secondDigit);

            return !enforceCpfIntegrity || cpf[9].ToString() == firstDigit.ToString() && cpf[10].ToString() == secondDigit.ToString();
        }

        private static void CalculateVerifyingDigits(string cpf, out int firstDigit, out int secondDigit)
        {
            int sum = 0;
            for (int i = 0; i < 9; i++)
            {
                sum += int.Parse(cpf[i].ToString()) * (10 - i);
            }

            firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

            sum = 0;
            for (int i = 0; i < 10; i++)
            {
                sum += int.Parse(cpf[i].ToString()) * (11 - i);
            }

            secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        }
    }

}