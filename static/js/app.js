$(document).ready(function($) {

    $('#normalize').hide()
    $('#results-table').insertAfter($('#accuracy'))

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var maxLength = 280;
    $('#encoded').on("input", function() {
        var text = $(this).val()
        var length = text.length
        $('#chars').text(length+"/280");
        if (text != "") {
            delay(function() {
                normalize(text)
            }, 1000);
        } else {
            $('#decoded').text('')
        }
    });

    

    $('#export').click(function() {
        var csv_value = $('#results-table').table2CSV({
            header:['No', 'Input', 'Expected', 'Result'],
            delivery: 'value'
        });

        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv_value]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "data.csv";
    
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });


    var encFile = ""
    var decFile = ""

    $('#enc-upload').change(function(selected) {
        var files = selected.target.files;
        encFile = files[0]
        readEncText(encFile)
    });

    $('#dec-upload').change(function(selected) {
        var files = selected.target.files;
        decFile = files[0]
        readDecText(decFile)
    })

    function toggleNormalizeButton() {
        if ($('#dec-data').val().length !== 0 && $('#enc-data').val().length !== 0) {
            $('#normalize').show()
        } else {
            $('#normalize').hide()
        }
    }

    function readEncText(file) {
        $('#enc-filename').html(file.name)
        var reader = new FileReader();
        reader.onload = (function (f) {
            return function(e) {
                $('#enc-data').val(e.target.result)
                toggleNormalizeButton()
            };
        })(file);
        reader.readAsText(file);
    }

    function readDecText(file) {
        $('#dec-filename').html(file.name)
        var reader = new FileReader();
        reader.onload = (function (f) {
            return function(e) {
                $('#dec-data').val(e.target.result)
                toggleNormalizeButton()
            };
        })(file);
        reader.readAsText(file);
    }

    function normalize(text) {
        $.ajax({
            url: '/normalize/api',
            type: 'POST',
            data: {'src': text},
            success: function(data) {
                if($('#encoded').val() !== "") {
                    $("#decoded").html(data['tgt'])
                }
            }
        });
    } 

    $('#cancel-dec-file').click(function() {
        $('#dec-filename').html('No file selected')
    });

    $('#cancel-enc-file').click(function() {
        $('#enc-filename').html('No file selected')
    });

});
