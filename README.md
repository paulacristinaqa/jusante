# Jusante — Jóias inspiradas no Rio Minho

Pré-visualização da loja Jusante (jóias de autor, tiragens de 3 a 9 exemplares), feita para **testar as fotografias das peças** antes da migração para o Shopify.

Site estático: HTML, CSS e JavaScript, sem instalação nem dependências. Os tipos de letra estão incluídos na pasta `assets/fontes`, por isso também funciona sem internet.

## Abrir no computador

Faça duplo clique em `index.html`.

> Se o navegador não guardar as fotos ao abrir o ficheiro diretamente, use um servidor local na pasta da loja:
> `python -m http.server 8000` e depois abra http://localhost:8000

## Testar fotos

1. Clique em **✦ Modo fotos** (canto inferior esquerdo).
2. Arraste as fotos para cima de qualquer peça, coleção, imagem principal ou retrato do atelier. Também pode clicar no espaço da foto para as escolher.
   - Cada peça aceita até 6 fotos. No cartão da loja, a 2.ª foto aparece quando passa o rato por cima.
   - Na página de produto, as miniaturas mudam a foto principal. Use **Trocar** ou **Remover** para gerir cada foto.
3. Compare as variantes na barra:
   - **Fundo**: creme, branco, verde ou areia.
   - **Formato**: 1:1, 4:5, 3:4 ou 2:3.
   - **Enquadramento**: preencher ou mostrar inteira.
4. Em modo fotos aparecem as dimensões de cada imagem e avisos de **baixa resolução** (menos de 1200 px) ou de **proporção diferente** do formato escolhido.

As fotos ficam guardadas **apenas neste navegador** (IndexedDB) e continuam lá depois de recarregar a página. **Apagar todas** limpa-as.

### Fotos permanentes (para ver em qualquer dispositivo / GitHub)

Copie os ficheiros para a pasta `fotos/` e indique-os em `js/produtos.js`:

```js
imagens: ["fotos/anel-seixo-1.jpg", "fotos/anel-seixo-2.jpg"]
```

Sugestão para o Shopify: imagens quadradas de 2048 × 2048 px, em JPG ou WebP, com menos de 1 MB cada.

## Editar peças

Tudo está em `js/produtos.js`: título, preço, material, coleção, descrição, detalhes, tamanhos e tiragem (`edicao` = total de exemplares, `disponiveis` = quantos restam). Os pontos dourados, os selos "Última peça" e "Esgotada" e o número do exemplar ("n.º 4/5") são calculados a partir destes dois valores.

## Especialidade: Opala Favo de Mel da Etiópia

Secção própria em `#/opala`, com um bloco de destaque na página inicial e um filtro "Opala" na loja.

- As peças **não têm opala natural**: são feitas em cerâmica plástica com efeito opala. A opala de Welo é apenas a inspiração, e os textos do site dizem-no em todos os sítios.
- As peças estão no fim de `js/produtos.js`, com `especialidade: "opala"` e `edicao: 1` (peças únicas).
- O campo `efeito` (padrão, tons, forma, medidas) aparece como **Efeito opala** na página de produto.
- A imagem do destaque na página inicial testa-se no Modo fotos, como as restantes.

## Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "Loja Jusante"
git branch -M main
git remote add origin https://github.com/O-SEU-UTILIZADOR/jusante-loja.git
git push -u origin main
```

O repositório já tem uma publicação automática (`.github/workflows/pages.yml`): cada alteração em `main` atualiza o site em cerca de um minuto, em https://paulacristinaqa.github.io/jusante/

Atenção: no plano gratuito, o GitHub Pages só publica a partir de repositórios **públicos**. Se o repositório for privado, o site só fica online com um plano pago. Para acesso só seu, a alternativa é abrir a loja localmente.

## Estrutura

```
index.html          página única (início, loja, coleções, produto, atelier)
css/estilo.css      identidade visual (verde #1B3B36, ouro #D9B48F, creme #FBF8F0)
js/produtos.js      catálogo — editar aqui
js/app.js           navegação, saco de compras, modo fotos
assets/simbolo.svg  símbolo Jusante
assets/fontes/      Great Vibes, Cormorant Garamond, Jost (licença OFL)
fotos/              coloque aqui as fotos definitivas
```

## Para o Shopify

- Os campos de `produtos.js` correspondem aos do Shopify: `handle`, `title`, `body_html`, `product_type`, `tags` (coleção), variantes de tamanho e `images`.
- A tiragem pode passar para o inventário (quantidade = `disponiveis`) e para um metafield `edicao`.
- O checkout desta pré-visualização está desativado de propósito.
