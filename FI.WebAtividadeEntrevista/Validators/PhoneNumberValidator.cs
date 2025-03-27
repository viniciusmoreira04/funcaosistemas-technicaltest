using System.Text.RegularExpressions;

namespace FI.WebAtividadeEntrevista.Validators
{
    public static class PhoneNumberValidator
    {
        private static readonly Regex PhoneNumberPattern = PhoneValidatorRegex;

        public static bool IsValid(string phoneNumber)
        {
            return !string.IsNullOrWhiteSpace(phoneNumber) && PhoneNumberPattern.IsMatch(phoneNumber);
        }

        private static readonly Regex PhoneValidatorRegex = new Regex("^\\d{4,11}$", RegexOptions.Compiled);
    }
}