# LAIG-FEUP
Repository to host Graphical Applications Laboratory projects.

 
## Goals

### Project 1
The main goal of this project was to build a 3D graphic application. It reads the components of a given scene, specified by a text file, and displays it.

The text file must comply with a defined language, LSX - Language of Scenes in XML, which obeys to a concept widely used in Computer Graphics: Scene graph. Furthermore, the syntax follows the XML tags format.
 
Therefore, the application reads and transverses all the lsx nodes, while simultaneously builds the respective data structure - scene graph. After reading and loading the info, the scene is then displayed.

| [<img src="/res/P1View1.jpg" width="256" heigth="256">](/res/P1View1.jpg)                                                               | [<img src="/res/P1View2.jpg" width="256" heigth="256">](/res/P1View2.jpg)                                                               | [<img src="/res/P1View3.jpg" width="256" heigth="256">](/res/P1View3.jpg) |
|:---:|:---:|:---:|
| View 1 | View 2 | View 3 |

### Project 2
The goal of this project was to add new graphic functionalities to the work developed in the last project.

As such, by using the parser previously developed and extending the LSX language, we added the following features: 
* Animations (Linear, Circular and Bezier) 
* Shaders based in GLSL ES 1.0

| [<img src="/res/MainScene.jpg" width="256" heigth="256">](/res/MainScene.jpg)                                                           | [<img src="/res/Animations.gif" width="256" heigth="256">](/res/Animations.gif)                                                         | [<img src="/res/Boards.gif" width="256" heigth="256">](/res/Boards.gif) |
|:---:|:---:|:---:|
| Scene | Animations and Shaders | Boards |

### Project 3
The goal was to develop a graphical interface for a Prolog game developed in the [Logic Programming]() course, which in our case was the puzzle game GoRoGo.

#### Features
* Player Vs Player, [Player Vs AI](/res/PlayerVsAI.gif), AI Vs AI (with two difficulty modes)
* Undo last play
* Game Movie
* Switching between predefined scenarios
* Switching between predefined cameras
* Game statistics and player turn timer

| [<img src="/res/PlayerVsPlayer.gif" width="256" heigth="256">](/res/PlayerVsPlayer.gif)                                               | [<img src="/res/GameMovie.gif" width="256" heigth="256">](/res/GameMovie.gif) |
|:---:|:---:|
| Player Vs Player | Game Movie |

[How to Play](https://github.com/diogotorres97/LAIG-FEUP/blob/master/Project%203/docs/User%20Manual.pdf)

## Team 
[Bruno Piedade](https://github.com/Kubix20)

[Diogo Torres](https://github.com/diogotorres97)



