# LAIG-FEUP

-> Fazer XML até 9 de outubro

-> Continuar trabalho até 23 de outubro

## To-Do List
-> XML

	-Refactor ao XML
	
	- Adicionar o resto das coisas de acordo com o esboço
	
	- Adicionar uma animação de um aspirador tipo pé das colunas. Em que também seja possivel movimentar com as teclas "awsd"
	
	- Talvez uma animação simples que não seja o relógio. Ainda pensei na lareira mas não vejo forma de modular tal coisa.
	
	- Tirar ideias da cena do danny visto que é copia da nossa :D
	
	- Procurar texturas e materiais interessantes para dar um bom design a cena
	

-> Código

	->MyInterface
		- Adicionar função que lida com o input do keyboard
	
	->MyGraphNode
		- Verificar if's das texturas e materiais (alguns podem ser desnecessários e verificar se a herança está correta)
		
	->MySceneGraph
		-Refactor :D
		-Verificar os erros no parse das primitivas? (id's iguais e valores?)
		-Cada uma dessas entidades contém um identificador do tipo string . Cada identificador
			deve ser único dentro de cada bloco (por exemplo, não podem existir duas fontes de luz com o mesmo
		identificador).

		
-> Enunciado

	-Ver na parte das luzes o w na light position w=1, point light, w=0, directional light
	
	- Cilindro Slices e Stacks estão trocadas! 
	
	-Tags devem respeitar a capitalização das letras como especificadas
	
	- Folha "rectangle": é desenhada no plano XY
	
	- Folha "cylinder": é desenhado com o eixo coincidente com eixo dos ZZ; a base com "bottom radius" fica
	no plano XY; a base com "top radius" fica algures no eixo positivo ZZ; o cilindro tem “tampas”
	
	- Folha "sphere": tem pólos norte e sul respetivamente nos lados positivo e negativo do eixo ZZ; o centro
	está na origem das coordenadas.
	
		
-> Outros

	-Apagar console.logs desnecessários, visto que limita demasiado o desempenho da cena
	
	-Apagar comentários desnecessários como as primitivas das stacks e as funções que se encontram no SceneGraph
	
	-Ver documentos que se encontram no moodle pode ser que as funções das bibliotecas utilizadas possam melhorar o desempenho
	
	-Ler laig-cenas.txt by damas e verificar o que for necessário corrigir
	
	-Mudar nome dos diretórios xD
	
	-Onde se verifica se os valores default estão corretos? No XMLScene?
		
		
## Critérios de avaliação:
● Estruturação e Documentação do código 2 valores

● Primitivas e Geometria 4 valores

● Transf.Geométricas - descrição e herança 4 valores

● Materiais - descrição e herança 3.5 valores

● Texturas - descrição, dimensões e herança 3.5 valores

● Patches/NURBS 3 valores
