$(document).ready(function () {
    function formatCPF(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    function formatCEP(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    }
    function formatTelefone(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
    $('#CPF').on('input', function () {
        $(this).val(formatCPF($(this).val()));
    });
    $('#CEP').on('input', function () {
        $(this).val(formatCEP($(this).val()));
    });
    $('#Telefone').on('input', function () {
        $(this).val(formatTelefone($(this).val()));
    });

    const btnBeneficiarios = $('<button>', {
        type: 'button',
        class: 'btn btn-primary',
        text: 'Beneficiários',
        id: 'btnBeneficiarios',
        click: function () {
            const clienteId = $('#clienteId').val(); 

            $.ajax({
                url: urlGetBeneficiarios,
                type: 'POST',
                data: {
                    Id: clienteId,  
                    Nome: $('#Nome').val(),
                    CPF: $('#CPF').val()
                },
                success: function (response) {
                    alert('Sucesso: ' + response);
                    window.location.href = urlRetorno;
                },
                error: function (response) {
                    alert('Erro: ' + response.responseText);
                }
            });
        }
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
            },
            error: function () {
                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
            }
        });
    });
});
