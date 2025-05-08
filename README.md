# Upper Half Plane Visualizer

## Description
A tool for visualizing and exploring the [upper half-plane model of hyperbolic space](https://en.wikipedia.org/wiki/Poincar%C3%A9_half-plane_model), à la Microsoft Paint and/or Desmos. Try it out [here](https://nathancarllopez.github.io/upper-half-plane-visualizer/).

## Features
- Interactive visualizations of the upper half-plane.
- Support for translations and rotations.
- Includes zooming, panning, and dragging shapes.

## Planned Additions
1. ### Code
  - **State Management**: Currently the project uses React's Context+Reducer approach to handle state. After finishing the project, however, I learned that bundling all possible state into one context as I did here is not good practice and will lead to unnecessary rerenders. I plan to break my universal context up to increase performance, and eventually consider a state management library, e.g., Zustand or Redux.
  - **Exporting Images**: Visitors will be able to save and export images of their drawings.
2. ### UI/UX
  - **Mobile**: This project was designed on desktop and hence is not yet responsive. Some features are not yet available on mobile (zooming and panning, for example), and the UI is very cramped on small screens.
3. ### Math
  - **Additional Shapes**: I would like to add [laminations](https://encyclopediaofmath.org/index.php?title=Lamination&oldid=l120020), [fundamental domains](https://encyclopediaofmath.org/wiki/Fundamental_domain), and custom mobius transformations in addition to the rotations and translations already provided.
  - **Other Modles**: Being able to visualize the [disk model](https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model) and [other models](https://en.wikipedia.org/wiki/Hyperbolic_geometry#Models_of_the_hyperbolic_plane) would be fantastic. In particular, being able to preserve drawings while switching between models to see how the drawings change is a big goal of mine.

## Acknowledgments
- Thanks to Janis Lazovskis and Keaton Quinn for extensive feedback and willingess to test new features.
- Thanks to Tyler Berbert for being a tech mentor and sounding board.

## Contact
For questions or feedback, please contact me at nathancarllopez@gmail.com.