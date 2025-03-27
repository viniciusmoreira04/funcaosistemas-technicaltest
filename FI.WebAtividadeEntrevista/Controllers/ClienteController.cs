using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Resources;
using FI.WebAtividadeEntrevista.Validators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        private static List<Beneficiario> beneficiarios = new List<Beneficiario>();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            beneficiarios.Clear();
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return Json(new { success = false, message = ClienteMsg.EXC0001 });
            }

            if (!CPFValidator.IsValidCpf(model.CPF))
                return Json(new { success = false, message = BeneficiarioMsg.EXC0001 });

            if (!EmailValidator.IsValid(model.Email))
                return Json(new { success = false, message = ClienteMsg.EXC0003 });

            if (!PhoneNumberValidator.IsValid(model.Telefone))
                return Json(new { success = false, message = ClienteMsg.EXC0004 });

            BoCliente boCliente = new BoCliente();

            if (!boCliente.VerificarExistencia(model.CPF))
            {
                BoBeneficiario boBeneficiarios = new BoBeneficiario();

                model.Id = boCliente.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    CPF = model.CPF,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone
                });

                if (beneficiarios.Count > 0)
                {
                    foreach (Beneficiario beneficiario in beneficiarios)
                    {
                        beneficiario.IdCliente = model.Id;
                        boBeneficiarios.Incluir(beneficiario);
                    }
                }
                return Json(ClienteMsg.INF0001);
            }
            else
                return Json(new { success = false, message = ClienteMsg.EXC0002 });
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return Json(new { success = false, message = ClienteMsg.EXC0001 });
            }

            BoCliente boCliente = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            boCliente.Alterar(new Cliente()
            {
                Id = model.Id,
                CEP = model.CEP,
                CPF = model.CPF,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone
            });

            if (beneficiarios.Count > 0)
                foreach (Beneficiario beneficiario in beneficiarios)
                {
                    if (beneficiario.Id == 0)
                        boBeneficiario.Incluir(beneficiario);
                }

            return Json(new { success = true, message = ClienteMsg.INF0001 });
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente boCliente = new BoCliente();
            Cliente cliente = boCliente.Consultar(id);
            ClienteModel model = null;
            beneficiarios = new BoBeneficiario().Listar(id);

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };
            }
            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult AdicionarBeneficiario(Beneficiario beneficiario)
        {
            BoCliente boCliente = new BoCliente();

            if (!CPFValidator.IsValidCpf(beneficiario.CPF))
                return Json(new { success = false, message = BeneficiarioMsg.EXC0001 });

            if (beneficiario.IdCliente != 0)
            {
                if (!boCliente.VerificarExistencia(beneficiario.CPF) && !verificarBeneficiarioCPF(beneficiario.CPF))
                {
                    beneficiarios.Add(beneficiario);
                    return Json(new { success = true, data = beneficiarios });
                }
                else
                    return Json(new { success = false, message = BeneficiarioMsg.EXC0002 });
            }
            else
            {
                if (!verificarBeneficiarioCPF(beneficiario.CPF))
                    return Json(new { success = false, message = BeneficiarioMsg.EXC0002 });
                else
                {
                    beneficiarios.Add(beneficiario);
                    return Json(new { success = true, data = beneficiarios });
                }
            }
        }

        [HttpPost]
        public JsonResult DeleteBeneficiario(BeneficiarioModel model)
        {
            BoBeneficiario boBeneficiario = new BoBeneficiario();
            var beneficiario = beneficiarios.FirstOrDefault(b => b.Id == model.Id);

            if (model.Id > 0)
                boBeneficiario.Excluir(model.Id);

            beneficiarios.Remove(beneficiario);
            return Json(beneficiarios);
        }

        public bool verificarBeneficiarioCPF(string cpf)
        {
            var beneficiario = beneficiarios.FirstOrDefault(benificiario => benificiario.CPF == cpf);
            return beneficiario != null;
        }
    }
}