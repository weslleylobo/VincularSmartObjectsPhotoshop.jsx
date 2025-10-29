/* =========================================================
SCRIPT: Vincular Smart Objects Photoshop.jsx
AUTOR: [Weslley Lobo]
DATA DE CRIAÇÃO: 29/10/2025
VERSÃO: 1.0

DESCRIÇÃO:
Este script automatiza o processo de vinculação de Smart Objects no Adobe Photoshop.
Ele faz o seguinte:

Lê uma lista de nomes de arquivos (sem extensão) do arquivo "lista.txt" no Desktop.
Procura os arquivos correspondentes na pasta "D:\Links Produtos" com extensões suportadas.
Insere cada arquivo encontrado como Smart Object vinculado no documento atual.
Redimensiona as imagens proporcionalmente conforme a porcentagem configurada.
Centraliza automaticamente cada Smart Object no documento.

CONFIGURAÇÃO:
- Arquivo de lista: "lista.txt" no Desktop
- Pasta de origem: "D:\Links Produtos"
- Escalonamento: Por largura ou altura (configurável)
- Alinhamento: Centralizado automaticamente

SUPORTE A FORMATOS:
JPG, JPEG, PNG, TIF, TIFF, PSD, PDF, SVG

OBSERVAÇÕES:
Se não houver documento aberto, um novo será criado automaticamente.
O script mantém a proporção original de todas as imagens.
Arquivos não encontrados são listados no relatório final.
========================================================= */

// ========== CONFIGURAÇÃO ==========
var baseFolder = new Folder('D:/Links Produtos');
var listFile = new File(Folder.desktop + '/lista.txt');
var allowedExtensions = ['jpg','jpeg','png','tif','tiff','psd','pdf','svg'];
var scaleToFitPercent = 50; // escala relativa à dimensão escolhida (porcentagem)

// ESCOLHA O TIPO DE ESCALONAMENTO:
// 'width' = escala baseada na largura do documento
// 'height' = escala baseada na altura do documento
var scaleType = 'height'; // ← ALTERE AQUI: 'width' ou 'height'

var alignToCenter = true; // centralizar horizontalmente e verticalmente
// ===================================

function arrayContains(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase() === value.toLowerCase()) return true;
    }
    return false;
}

// Função para remover espaços em branco
function trimString(str) {
    if (str == null || str == undefined) return '';
    return str.replace(/^\s+|\s+$/g, '');
}

try {
    // Verifica se a pasta base existe
    if (!baseFolder.exists) {
        alert('A pasta D:/Links Produtos não foi encontrada.');
        throw 'no-folder';
    }

    // Verifica se lista.txt existe
    if (!listFile.exists) {
        alert('O arquivo lista.txt não foi encontrado no Desktop.');
        throw 'no-list';
    }

    // Valida o tipo de escalonamento
    if (scaleType !== 'width' && scaleType !== 'height') {
        alert('Tipo de escalonamento inválido. Use "width" ou "height".');
        throw 'invalid-scale-type';
    }

    // Lê o conteúdo da lista.txt
    listFile.open('r');
    var listContent = listFile.read();
    listFile.close();

    // Separa linhas e remove espaços vazios, garantindo que seja string
    var names = listContent.split(/\r?\n/);
    var trimmedNames = [];
    for (var i = 0; i < names.length; i++) {
        var line = names[i];
        if (line != null && line != undefined) {
            var n = trimString(line.toString().replace(/\s+/g, ''));
            if (n.length > 0) trimmedNames.push(n);
        }
    }

    if (trimmedNames.length === 0) {
        alert('O arquivo lista.txt está vazio ou inválido.');
        throw 'empty-list';
    }

    // Cria documento se necessário
    if (app.documents.length === 0) {
        var docWidth = 3000;
        var docHeight = 2000;
        var docRes = 300;
        var newDoc = app.documents.add(docWidth, docHeight, docRes, 'Colagem vinculada');
    }

    var doc = app.activeDocument;
    var notFound = [];

    // Função para colocar arquivo como linked smart object
    function placeLinked(file) {
        var idPlc = charIDToTypeID('Plc ');
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID('null'), new File(file.fsName));
        desc.putBoolean(charIDToTypeID('Lnkd'), true);
        executeAction(idPlc, desc, DialogModes.NO);
    }

    // Processa cada nome da lista
    for (var j = 0; j < trimmedNames.length; j++) {
        var baseName = trimmedNames[j];
        var foundFile = null;

        // Procura o arquivo com qualquer extensão suportada
        for (var e = 0; e < allowedExtensions.length; e++) {
            var ext = allowedExtensions[e];
            var candidate = new File(baseFolder + '/' + baseName + '.' + ext);
            if (candidate.exists) {
                foundFile = candidate;
                break;
            }
        }

        if (foundFile == null) {
            notFound.push(baseName);
            continue;
        }

        // Coloca o arquivo no documento
        placeLinked(foundFile);
        var placedLayer = doc.activeLayer;

        try {
            // Redimensiona proporcionalmente baseado no tipo escolhido
            var b = placedLayer.bounds;
            var widthPx = b[2].as('px') - b[0].as('px');
            var heightPx = b[3].as('px') - b[1].as('px');
            
            var scaleFactor;
            
            if (scaleType === 'width') {
                // Escala baseada na largura do documento
                var targetWidth = doc.width.as('px') * (scaleToFitPercent / 100);
                scaleFactor = (targetWidth / widthPx) * 100;
            } else {
                // Escala baseada na altura do documento
                var targetHeight = doc.height.as('px') * (scaleToFitPercent / 100);
                scaleFactor = (targetHeight / heightPx) * 100;
            }
            
            placedLayer.resize(scaleFactor, scaleFactor, AnchorPosition.MIDDLECENTER);

            if (alignToCenter) {
                var nb = placedLayer.bounds;
                var nwidth = nb[2].as('px') - nb[0].as('px');
                var nheight = nb[3].as('px') - nb[1].as('px');
                var targetX = (doc.width.as('px') - nwidth) / 2;
                var targetY = (doc.height.as('px') - nheight) / 2;
                var curLeft = nb[0].as('px');
                var curTop = nb[1].as('px');
                var dx = targetX - curLeft;
                var dy = targetY - curTop;
                placedLayer.translate(UnitValue(dx, 'px'), UnitValue(dy, 'px'));
            }

        } catch (e) {
            $.writeln('Erro ao posicionar ' + foundFile.name + ': ' + e);
        }
    }

    var msg = 'Importação concluída.\nArquivos encontrados: ' + (trimmedNames.length - notFound.length) + '\nArquivos não encontrados: ' + notFound.length;
    if (notFound.length > 0) {
        msg += '\n\nNão encontrados:\n' + notFound.join(', ');
    }
    alert(msg);

} catch (err) {
    if (err !== 'cancel' && err !== 'no-folder' && err !== 'no-list' && err !== 'empty-list' && err !== 'no-files' && err !== 'invalid-scale-type') {
        alert('Ocorreu um erro: ' + err);
    }
}