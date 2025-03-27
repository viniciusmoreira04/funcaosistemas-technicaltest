using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Resources;
using FI.WebAtividadeEntrevista.Validators;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        [HttpPost]
        public JsonResult IncluirBeneficiario(BeneficiarioModel model)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return Json(new { success = false, message = ClienteMsg.EXC0001 });
            }

            if (!CPFValidator.IsValidCpf(model.CPF))
                return Json(new { success = false, message = BeneficiarioMsg.EXC0001 });

            BoBeneficiario boBeneficiario = new BoBeneficiario();

            model.Id = boBeneficiario.Incluir(new Beneficiario()
            {
                CPF = model.CPF,
                Nome = model.Nome,
                IdCliente = model.IdCliente
            });

            return Json(BeneficiarioMsg.INF0001);
        }

        [HttpPost]
        public JsonResult AtualizarBeneficiario(BeneficiarioModel model)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return Json(new { success = false, message = ClienteMsg.EXC0001 });
            }

            if (!CPFValidator.IsValidCpf(model.CPF))
                return Json(new { success = false, message = BeneficiarioMsg.EXC0001 });

            BoBeneficiario boBeneficiarios = new BoBeneficiario();

            boBeneficiarios.Alterar(new Beneficiario()
            {
                CPF = model.CPF,
                Nome = model.Nome,
                IdCliente = model.IdCliente,
                Id = model.Id
            });

            return Json(new { success = true, message = ClienteMsg.INF0001 });
        }

        [HttpPost]
        public JsonResult RemoveBeneficiario(long id)
        {
            try
            {
                BoBeneficiario boBeneficiario = new BoBeneficiario();
                boBeneficiario.Excluir(id);
                return Json(BeneficiarioMsg.INF0002);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult GetBeneficiarios(long idCliente)
        {
            try
            {
                List<Beneficiario> beneficiario = new BoBeneficiario().Listar(idCliente);
                return Json(beneficiario, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}