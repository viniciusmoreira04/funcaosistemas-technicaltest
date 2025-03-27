$(document).ready(function () {
    $('#formNovoBeneficiario').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlExclusao,
            method: "DELETE",
            data: {
                "ID": id,
            },
            error:
                function () {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formNovoBeneficiario")[0].reset();
                }
        });
    })
})