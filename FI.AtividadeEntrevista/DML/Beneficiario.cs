namespace FI.AtividadeEntrevista.DML
{
    /// <summary>
    /// Classe de beneficiário que representa o registro na tabela Beneficiarios do Banco de Dados
    /// </summary>
    public class Beneficiario
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// CPF do Beneficiário
        /// </summary>
        public string CPF { get; set; }

        /// <summary>
        /// Nome do Beneficiário
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        /// ID do Cliente relacionado
        /// </summary>
        public long IdCliente { get; set; }
    }
}