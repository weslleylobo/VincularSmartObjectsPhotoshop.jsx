# 🔗 Vincular Smart Objects Photoshop.jsx

Script em `JavaScript para Adobe Photoshop` que automatiza o processo de `vinculação de Smart Objects` a partir de uma lista de nomes.
Ideal para designers que precisam inserir múltiplas imagens como elementos vinculados de forma rápida e organizada.

---

## 📄 Descrição

O `Vincular Smart Objects Photoshop.jsx` faz o seguinte:

1. Lê uma lista de nomes de arquivos (sem extensão) do arquivo `lista.txt` no Desktop.
2. Procura os arquivos correspondentes na pasta `D:\Links Produtos` com extensões suportadas.
3. Insere cada arquivo encontrado como `Smart Object vinculado` no documento atual.
4. Redimensiona as imagens proporcionalmente conforme a porcentagem configurada.
5. Centraliza automaticamente cada Smart Object no documento.

---

## 🧩 Funcionalidades

* Processamento em lote a partir de lista de nomes.
* Inserção como Smart Objects vinculados (preserva links externos).
* Redimensionamento proporcional configurável por largura ou altura.
* Centralização automática no documento.
* Compatibilidade com vários formatos de imagem.
* Criação automática de documento se não houver um aberto.

---

## 🖼️ Formatos Suportados

`JPG`, `JPEG`, `PNG`, `TIF`, `TIFF`, `PSD`, `PDF`, `SVG`

---

## ⚙️ Instruções de Uso

1. `Crie um arquivo lista.txt` no Desktop com os nomes dos arquivos (sem extensão), um por linha.

2. `Certifique-se que a pasta D:\Links Produtos` existe e contém os arquivos listados.

3. `Abra o Adobe Photoshop.`

4. Vá em:

   `
   Arquivo > Scripts > Procurar...
   `

   E selecione o arquivo `Vincular Smart Objects Photoshop.jsx`.

5. O script irá:

   * Criar um novo documento se nenhum estiver aberto
   * Buscar e vincular todos os arquivos da lista
   * Redimensionar e centralizar cada imagem
   * Exibir relatório com arquivos encontrados e não encontrados

---

## ⚙️ Configuração

No início do script, você pode personalizar:

```
var scaleToFitPercent = 20; // Porcentagem de escalonamento
var scaleType = 'width'; // 'width' ou 'height'
var alignToCenter = true; // Centralização automática
```

---

## 📅 Informações

* `Autor:` Weslley Lobo
* `Data de criação:` 29/10/2025
* `Versão:` 1.0
* `Compatibilidade:` Adobe Photoshop 2025

---

## ⚠️ Observações

* Mantenha o arquivo `lista.txt` com nomes simples, sem extensões.
* Smart Objects vinculados mantém conexão com os arquivos originais.
* Arquivos não encontrados são listados no relatório final.
* O script preserva a proporção original de todas as imagens.

---

## 📜 Licença

Este projeto é distribuído sob a licença `MIT`.
Sinta-se à vontade para usar, modificar e compartilhar.

---
