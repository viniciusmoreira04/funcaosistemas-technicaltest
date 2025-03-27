$(document).ready(function () {
    var idCliente = 0;

    if (typeof obj !== 'undefined' && obj.Id > 0) {
        idCliente = obj.Id;
    }

    $("#incluir").click(function () {
        var cpf = $("#cpfBeneficiario").val();
        var nome = $("#nameBeneficiario").val();

        if (cpf && nome) {
            var beneficiario = {
                CPF: cpf,
                Nome: nome,
                Id: 0,
                idCliente: idCliente
            };
            $.ajax({
                url: '/Cliente/AdicionarBeneficiario',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(beneficiario),
                success: function (r) {
                    if (r.success == true) {
                        atualizarTabela(r.data);
                        $("#cpfBeneficiario").val('');
                        $("#nameBeneficiario").val('');
                    } else {
                        ModalDialog("Erro ao adicionar um Beneficiário", r.message);
                    }
                },
                error: function (r) {
                    ModalDialog("Erro ao adicionar um Beneficiário", r.message);
                }
            });
        } else {
            alert("Preencha todos os campos!");
        }
    });

    $("#beneficiarios").click(function () {
        if (typeof obj !== 'undefined' && obj.Id > 0) {
            carregarBeneficiarios(obj.Id);
        }
        $('#beneficiariosModal').modal('show');
    });
})

function atualizarTabela(beneficiarios) {
    var tbody = $("table tbody");
    tbody.empty();

    beneficiarios.forEach(function (b) {
        var row = "<tr>";
        row += "<td><input type='text' maxlength='14' value='" + b.CPF + "' id='cpf_" + b.Id + "' class='form-control'/></td>";
        row += "<td><input type='text' maxlength='50' value='" + b.Nome + "' id='nome_" + b.Id + "' class='form-control'/></td>";
        row += "<td><button onclick='alterarBeneficiario(\"" + b.Id + "\")' class='btn btn-primary btn-sm'>Alterar</button></td>";
        row += "<td><button type='submit' onclick='removerBeneficiario(\"" + b.Id + "\")' class='btn btn-primary btn-sm'>Remover</button></td>";
        row += "</tr>";
        tbody.append(row);
    });
}

function carregarBeneficiarios(idCli) {
    $.ajax({
        url: '/Beneficiario/GetBeneficiarios',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ idCliente: idCli }),
        success: function (data) {
            atualizarTabela(data);
        },
        error: function () {
            ModalDialog("Erro", "Erro ao carregar beneficiários!");
        }
    });
}

function removerBeneficiario(id) {
    var cpf = $("#cpfBeneficiario").val();
    var nome = $("#nameBeneficiario").val();

    var beneficiario = {
        CPF: cpf,
        Nome: nome,
        Id: id,
        idCliente: 0
    };
    $.ajax({
        url: '/Cliente/DeleteBeneficiario',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(beneficiario),
        success: function (data) {
            ModalDialog("Exclusão", "Beneficiário excluído", function () {
                atualizarTabela(data);
                $('#beneficiariosModal').modal('hide');
            });
        },
        error: function () {
            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
        }
    });
}

function alterarBeneficiario(id) {
    var cpf = $("#cpf_" + id).val();
    var nome = $("#nome_" + id).val();

    $.ajax({
        url: '/Beneficiario/AtualizarBeneficiario',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "Id": id,
            "CPF": cpf,
            "Nome": nome
        }),
        success: function (r) {
            if (r.success == true) {
                ModalDialog("Sucesso!", r.message)
            } else {
                ModalDialog("Sucesso!", r.message);
            }
        },
        error: function (r) {
            ModalDialog("Ocorreu um erro", r.message);
        }
    });
}

function ModalDialog(titulo, texto, callback) {
    var random = Math.random().toString().replace('.', '');
    var modalHtml = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(modalHtml);
    var $modal = $('#' + random);
    $modal.modal('show');

    $modal.on('hidden.bs.modal', function () {
        if (callback) {
            callback();
        }
        $modal.remove();
    });
}
