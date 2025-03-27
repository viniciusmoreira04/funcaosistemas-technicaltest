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

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);  
    }

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
            error:
            function () {
                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                var retorno = r;
                if (retorno.Mensagem == null)
                    retorno.Mensagem = "Cliente salvo com sucesso!";
                ModalDialog("Sucesso", retorno.Mensagem);
                return true;
            }
        });
    })    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
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

    $('body').append(texto);
    $('#' + random).modal('show');
}