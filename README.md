# LAIG-FEUP

-> Continuar trabalho até 23 de outubro

Dúvidas:
- Se continua o processo de dar parse quando encontra um erro, ou se faz logo return e pronto. Ou apenas "merda" no construtor das primitivas

- Na sphere e na Cylinder tinhas uma verificaçao manhosa nas stacks e slices de <3 que já corrigi, mas verificar

- Nos patches tinha um problema que quando corre o ciclo for a guardar as mensagens de erro, ele so guardava se o erro fosse na
ultima iteraçao. Alterei para verificar apenas os argumentos ate encontrar um erro, assim guarda o primeiro erro e nao verifica se as outras tem...


## To-Do List
-> XML

	- [x] Refactor ao XML

	- [x] Ver que texturas não são utilizadas para não dar load no inicio(otimização)

	- [x] Adicionar o resto das coisas de acordo com o esboço

	- [NOT NEEDED]Adicionar uma animação de um aspirador tipo pé das colunas. Em que também seja possivel movimentar com as teclas "awsd"

	- [NOT NEEDED] Talvez uma animação simples que não seja o relógio. Ainda pensei na lareira mas não vejo forma de modular tal coisa.

	- [x] Tirar ideias da cena do danny visto que é copia da nossa :D

	- [x] Procurar texturas e materiais interessantes para dar um bom design a cena

	-  Verificar se as texturas sao potencias de 2

	- [x] Patches

	- Adicionar um aspirador?

	- [x] Posição da camera

-> Código

	->MyInterface
		- [NOT NEEDED] Adicionar função que lida com o input do keyboard

	->MyGraphNode
		- [x] Verificar if's das texturas e materiais (alguns podem ser desnecessários e verificar se a herança está correta)

	->MySceneGraph
		-Refactor :D
		- [I think it is done, but needed to check] Verificar os erros no parse das primitivas? (id's iguais e valores?)
		-Cada uma dessas entidades contém um identificador do tipo string . Cada identificador
			deve ser único dentro de cada bloco (por exemplo, não podem existir duas fontes de luz com o mesmo
		identificador).
		- [x] Warning: tag <NODES> out of order


-> Enunciado

	- [x]Ver na parte das luzes o w na light position w=1, point light, w=0, directional light

	- [x] Cilindro Slices e Stacks estão trocadas!

	- [x] Tags devem respeitar a capitalização das letras como especificadas

	- [x] Folha "rectangle": é desenhada no plano XY

	- [x] Folha "cylinder": é desenhado com o eixo coincidente com eixo dos ZZ; a base com "bottom radius" fica
	no plano XY; a base com "top radius" fica algures no eixo positivo ZZ; o cilindro tem “tampas”

	- [x] Folha "sphere": tem pólos norte e sul respetivamente nos lados positivo e negativo do eixo ZZ; o centro
	está na origem das coordenadas.


-> Outros

	- [x] Apagar console.logs desnecessários, visto que limita demasiado o desempenho da cena

	- [x] Apagar comentários desnecessários como as primitivas das stacks e as funções que se encontram no SceneGraph

	- [x] Ver documentos que se encontram no moodle pode ser que as funções das bibliotecas utilizadas possam melhorar o desempenho

	-Ler laig-cenas.txt by damas e verificar o que for necessário corrigir

	- [x]Mudar nome dos diretórios xD

	-Onde se verifica se os valores default estão corretos? No XMLScene?


## Critérios de avaliação:
● Estruturação e Documentação do código 2 valores

● Primitivas e Geometria 4 valores

● Transf.Geométricas - descrição e herança 4 valores

● Materiais - descrição e herança 3.5 valores

● Texturas - descrição, dimensões e herança 3.5 valores

● Patches/NURBS 3 valores
