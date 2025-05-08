import { useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

import CollapsibleCard from "../CollapsibleCard/CollapsibleCard";
import ToLatex from "./ToLatex";
import HyperLink from "./HyperLink";
import OffcanvasDrawer from "./OffcanvasDrawer";
import SuggestionForm from "../Suggestions/SuggestionForm";

import coordDiagram from "../../assets/coord-diagram.png";

export default function Information() {
  const [openCard, setOpenCard] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {

  })

  const GoToSectionText = (cardName) => (
    <strong onClick={() => toggleIsOpen(cardName)} style={{cursor: "pointer"}}>
      {cardName}
    </strong>
  );

  const line = <ToLatex tex={"L"}/>;
  const point = <ToLatex tex={"p"}/>;
  const mathX = <ToLatex tex={"m_x"}/>;
  const mathY = <ToLatex tex={"m_y"}/>;
  const canvasX = <ToLatex tex={"c_x"}/>;
  const canvasY = <ToLatex tex={"c_y"}/>;

  return (
    <OffcanvasDrawer fabName={"Information"}>
      <Stack gap={3}>
        <CollapsibleCard
          title={"Hyperbolic Paint"}
          isOpen={openCard === "Hyperbolic Paint"}
          toggleIsOpen={toggleIsOpen}
        >
          <Card.Text>
            The story of this tool begins when, as a graduate student, I spent many hours and filled many notebooks drawing geometric figures in the hyperbolic plane. I wanted a way to produce the pictures faster, with more accuracy, and, ideally, to be interactive. Inspired by <HyperLink urlCode={'geogebra'}>Geogebra</HyperLink> and <HyperLink urlCode={'desmos'}>Desmos</HyperLink> (and after commandeering the name from a famous Microsoft product), Hyperbolic Paint was born.
          </Card.Text>

          <Card.Text>
            If you're a person who learns by doing, explore the toolbar in the top right corner of the screen and see what you can draw. However, if you prefer more details, check out the following sections below:
          </Card.Text>

          <ul>
            <li>The {GoToSectionText("User Manual")} section will explain the features of Hyperbolic Paint.</li>
            <li>Check out the {GoToSectionText("Learn")} section if you are unfamiliar with hyperbolic geometry and want to know more.</li>
            <li>You'll find information about both the computations and project structure in the {GoToSectionText("Documentation")} section.</li>
            <li>Finally, in the {GoToSectionText("Give Feedback")} section, you'll find a link to this project's GitHub and a form to submit feedback.</li>
          </ul>
        </CollapsibleCard>

        <CollapsibleCard
          title={"User Manual"}
          isOpen={openCard === "User Manual"}
          toggleIsOpen={toggleIsOpen}
        >
          <strong>Contents</strong>
          <ul>
            <li>The Toolbar</li>
            <li>Drawings</li>
            <li>Animations</li>
            <li>Styles</li>
            <li>Undo, Redo, and Clear</li>
            <li>Settings</li>
            <li>Panning and Zooming</li>
          </ul>

          <Card.Text>
            <strong>Note:</strong> Throughout this guide I say "click" to refer to clicking on a desktop or tapping on a mobile device.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>The Toolbar</strong>
            <br/>
            The toolbar is located at the top right corner of the viewport and is where all the action starts. It consists of several dropdown menus for creating images (Drawings, Animations, and Styles), some buttons to control what has been drawn (Undo, Redo, and Clear), and a final dropdown to configure the tool (Settings). Read the following sections on each part to learn more details.
          </Card.Text>

          <Card.Text>
            Upon selecting a drawing tool or animation tool, a toast message will appear at the bottom right corner of the screen with instructions for the tool's use. The duration until these messages dismiss themselves (or whether they appear at all) can be chosen in the Settings dropdown.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Drawings</strong>
            <br/>
            Once a drawing is placed, you will notice it has "anchor" points that allow you to change the drawings placement and size via dragging the anchor. In particular, the red anchor always moves the entire shape while the blue anchors move only part of the shape (experiment to make this vague description more clear).
          </Card.Text>

          <Card.Text>
            If you click on any anchor, then the Styles panel will open in the bottom left hand corner of your screen. Here you can change the color and size (width of the edges and radius of the anchors) of the selected drawing or delete the drawing (via the button or, on a desktop, pressing your delete key). This panel is draggable so it doesn't obscure the view.
          </Card.Text>
          
          <Card.Text>
            Finally, note that some shapes only require a single click (e.g., Points and Horocycles) while others take multiple clicks (e.g., Lines or Polygons).
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Animations</strong>
            <br/>
            There are currently two animations available, rotations and translations, and working with them is similar to the drawing tools in the previous section.
          </Card.Text>
          
          <Card.Text>
            A rotation is determined by choosing a point about which the rotation is centered, while a translation is determined by choosing a two points and hence a direction that the translation will follow.
          </Card.Text>
          
          <Card.Text>
            When either animation shape is placed, the Animations panel will open in the bottom left hand corner of your screen. The panel allows you to start and stop the animation as well as control its speed and direction.
          </Card.Text>
          
          <Card.Text>
            Like the Styles panel in the previous section, the Animations panel is draggable. Moreover, the animation shape itself is draggable, even while the animations are playing.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Styles</strong>
            <br/>
            The Styles dropdown allows you to choose the color and size (width of edges and radius of anchor points) of your drawings. All new drawings you make will have their styles set to the current values in the dropdown.
          </Card.Text>
          
          <Card.Text>
            If you wish to change the style of an already placed drawing, you can click any anchor of the drawing and make your desired changes via the Styles panel (see the Drawings section).
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Undo, Redo, and Clear</strong>
            <br/>
            The undo and redo buttons function similarly to how they do in any text editor. They can be used via clicking them in the toolbar or, if you're on a desktop, via the standard keyboard shortcuts for your operating system.
          </Card.Text>
          
          <Card.Text>
            The clear button will remove all drawings, but will not change the styles in the Styles dropdown.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Settings</strong>
            <br/>
            The configurables in the Settings dropdown are mostly self explanatory, especially via adventurous fiddling, with the only one real exception explained here.
          </Card.Text>
          
          <Card.Text>
            In order to draw polygons with an unlimited amount of vertices, the code must be able to distinguish when the user has placed their last vertex. This is done by clicking and holding, and the Polygon Hold Duration setting specifies how long the user must hold for the click action to register as the last vertex. By default, this duration is set to one half of a second.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Panning and Zooming</strong>
            <br/>
            The drawing surface itself can be manipulated via panning or zooming; to pan, simply click and drag anywhere where there isn't already something drawn. Panning can only be done horizontally so that the horizontal axis is always visible (to understand this design choice, check out the "Learn" section).
          </Card.Text>
          
          <Card.Text>
            Zooming is handled on desktop and mobile devices similarly but with some differences. On a desktop, zooming is performed by scrolling via a mouse wheel or a track pad -- scrolling up and down corresponds to zooming in and out, respectively. If the mouse has coordinates <ToLatex tex={`(x,y)`}/> while zooming, then the center of dilation will be located at <ToLatex tex={`(x,0)`}/> so that the horizontal axis maintains its vertical position (to understand this design choice, check out the "Learn" section).
          </Card.Text>
          
          <Card.Text>
            On a mobile device, pinching outward zooms in, while pinching inward zooms out. When a pinch gesture begins, the coordinates of the midpoint between the two touch points is calculated, and those coordinates determine the location of the center of dilation analogously to how it is determined on a desktop.
          </Card.Text>
        </CollapsibleCard>

        <CollapsibleCard
          title={"History"}
          isOpen={openCard === "History"}
          toggleIsOpen={toggleIsOpen}
        >
          <Card.Text>
            <strong>Introduction</strong>
            <br/>
            The intended audience of this section is non-mathematicians who want to understand the history and basics of hyperbolic geometry. If you are already familiar with the upper half plane model and instead are interested in the implementation details, see the "Documentation" section.
          </Card.Text>
          
          <Card.Text>
            In no way should this section be interpreted as a complete treatment of the subject. I learned hyperbolic geometry while pursuing a PhD from many resources, none of which stood out from the rest, and any bits of history I know have been picked up sporadically over the years. My aim in including this section is to give the reader enough background to understand the design choices I've made. I do link to some resources I used while writing this section, and those resources and their citations should be consulted for a more complete explication.
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>History</strong>
            <br/>
            Around 300 BCE, the Greek mathematician Euclid published what he understood to be a complete treatment of geometry in his book, the <HyperLink urlCode={"elementsWiki"}>Elements</HyperLink>. The book begins with a series of statements (labeled "Definitions", "Postulates", and "Common Notions") all of which are assumed to be true and serve as the foundation upon which all of Euclid's theorems would be deduced. (See this <HyperLink urlCode={"elements"}>web page</HyperLink> from David E. Joyce of Clark University for a complete exploration of the Elements with context and comments.)
          </Card.Text>
          
          <Card.Text>
            The first kind of these axioms simply define what the terminology of the text (e.g., Definition 10 states: "When a straight line standing on a straight line makes the adjacent angles equal to one another, each of the equal angles is right, and the straight line standing on the other is called a perpendicular to that on which it stands."). 
          </Card.Text>
          
          <Card.Text>
            On the other hand, the Postulates and Common Notions assert truths about geometry and its objects. For example, the first postulate states the familiar idea that two points determine a line ("To draw a straight line from any point to any point"), while the last common notion asserts the uncontestable "The whole is greater than the part".
          </Card.Text>
          
          <Card.Text>
            One postulate stood out from the rest, however. The fifth postulate, which came to be known as the parallel postulate states: 
          </Card.Text>

          <blockquote style={{margin: "auto 1em", fontStyle: "italic"}}>
            "If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles, the two straight lines, if extended indefinitely, meet on that side on which are the angles less than the two right angles."
          </blockquote>
          <br/>

          <Card.Text>
            The parallel postulate is equivalent to the statement that, given a line {line} and a point {point} not on {line}, there is precisely one other line <ToLatex tex={"L'"}/> that intersects {point} but does not intersect {line}.
          </Card.Text>

          <Card.Text>
            Many mathematicians, including Euclid himself, found this postulate to be less natural than the others and suspected it could removed from the list of axioms and proved. For centuries, many tried to do produce a direct proof, while others tried to prove it indirectly via a proof by contradiction. That is, they would assume that the parallel postulate was false (i.e., that there were no lines or multiple parallel lines through {point} that did not intersect {line}) and then show that this assumption led to a logical contradiction. 
          </Card.Text>

          <Card.Text>
            Eventually, the mathematical community realized that these efforts were in vain. At least partially, this was due to the discovery of so-called models of these non-Euclidean geometries (i.e., geometries that assume all the other axioms of Euclid along with a variant of the parallel postulate). Informally, a model in this sense is a concrete mathematical description of a space with well-defined notions of all the essential elements of geometry, e.g., points, lines, and so forth, in which the axioms held.
          </Card.Text>

          <Card.Text>
            For example, if you assume that there are no parallel lines, you can construct a model as follows. The space itself is the surface of a sphere while a "point" corresponds to the points of the sphere. A "line" is a great circle on the sphere (i.e., the intersection of the sphere with a plane that passes through the center of the sphere), since this is the path you would follow if you were walking on a sphere and trying to walk completely straight. Notice that, as we expect, any two "points" determine a unique "line". In this model, there are no parallel lines since any two great circles intersect at two points. (Indeed, imagine the equator and the North Pole -- any line of longitude must intersect the equator at some point!)
          </Card.Text>

          <Card.Text>
            The next section describes the model of hyperbolic geometry (i.e., the geometry that assumes there are infinitely many parallel lines through {point} that do not intersect {line}) known as the <HyperLink urlCode="halfPlane">Poincare Upper Half Plane</HyperLink>.
          </Card.Text>

          <hr/>
          
          <Card.Text>
            <strong>The Upper Half Plane</strong>
            <br/>
            To define the upper half plane model, we need to specify the space of "points" as well as the notion of "line". The former are constituted by those points in the Cartesian coordinate system with a positive <ToLatex tex={"y"}/> coordinate, i.e., <ToLatex displayMode tex={"\\{ (x,y) \\in \\mathbb{R}^2 : y > 0 \\}."} />
          </Card.Text>

          <Card.Text>
            The lines in this model fall into one of two camps. If we have two points of our space <ToLatex tex={"p_1=(x_1,y_1)"} /> and <ToLatex tex={"p_2=(x_2,y_2)"}/>, then the line connecting them is either
          </Card.Text>

          <ol>
            <li>the vertical line <ToLatex tex={"x = x_1"}/> if <ToLatex tex={"x_1 = x_2"}/>; or,</li>
            <li>the half-circle going through <ToLatex tex={"p_1"}/> and <ToLatex tex={"p_2"}/> that intersects the <ToLatex tex={"x"}/> axis perpendicularly.</li>
          </ol>

          <Card.Text>
            Notice that in both cases the line determined by two points is unique. This is obvious in the first case, and in the second can be seen by the fact that the center of the prescribed half-circle, and hence the radius, is uniquely determined by the two points. Indeed, you can construct the center by (1) drawing the (Euclidean) line segment connecting <ToLatex tex={"p_1"}/> and <ToLatex tex={"p_2"}/>, (2) drawing the perpendicular bisector of this segment, and then (3) finding the intersection of this bisector with the <ToLatex tex={"x"}/> axis.
          </Card.Text>

          <Card.Text>
            To finish this section, we'll note three interesting features of the upper half plane model (and hyperbolic geometry in general).
          </Card.Text>

          <Card.Text>
            I. As promised, given a line and a point not on that line, there are infinitely many lines through the point that do not intersect the starting line. For example, the <ToLatex tex={"y"}/>-axis is a line of the first type, and the point <ToLatex tex={"(1,1)"}/> does not lie on the <ToLatex tex={"y"}/>-axis. Then, the line <ToLatex tex={"L_\\theta"}/> through <ToLatex tex={"(1,1)"}/> and any point of the form <ToLatex displayMode tex={"(1 + \\cos(\\theta), 1 + \\sin(\\theta)),\\quad0 \\leq \\theta \\leq \\frac{\\pi}{2}"}/> is a line that does not intersect the <ToLatex tex={"y"}/> axis.
          </Card.Text>

          <Card.Text>
            <em>Exercise:</em> if <ToLatex tex={"\\theta >\\frac{\\pi}{2}"}/>, then <ToLatex tex={"L_\\theta"}/> does intersect the <ToLatex tex={"y"}/> axis. However, there are values of <ToLatex tex={"\\theta < 0"}/> where <ToLatex tex={"L_\\theta"}/> still does not intersect the <ToLatex tex={"y"}/> axis. What is the minimal such value of <ToLatex tex={"\\theta"}/>?
          </Card.Text>

          <Card.Text>
            II. The distance between two points <ToLatex tex={"p_1=(x_1,y_1)"} /> and <ToLatex tex={"p_2=(x_2,y_2)"}/> is given by the formula 
            
            <ToLatex displayMode tex={"2\\,arcsinh\\left(\\frac{||p_2 - p_1||}{2\\sqrt{y_1y_2}}\\right)"}/>

            where <ToLatex tex={"||p_2 - p_1||"} /> denotes the (Euclidean) distance between the two points, and

            <ToLatex displayMode tex={"arcsinh(t) = \\ln\\left(t + \\sqrt{t^2 + 1}\\right)"} />
          </Card.Text>

          <Card.Text>
            If we accept this formula without proof, then we can notice some interesting consequences. If we fix one of the points and let the other points <ToLatex tex={"y"}/> coordinate get closer and closer to 0, then the distance between our points gets larger and larger. Qualitatively, this means we should interpret the <ToLatex tex={"x"}/> axis as being infinitely far away in the hyperbolic sense; incidentally, this is why in this tool the horizontal axis is fixed during panning and zooming.
          </Card.Text>

          <Card.Text>
            III. The strangeness of hyperbolic geometry extends to polygons as well. It is a well known fact that, in Euclidean geometry, the sum of the angles of a triangle add up to <ToLatex tex={"180^{\\circ}"}/>. However, this is <em>never</em> the case in hyperbolic geometry: the sum of the angles is always strictly less than <ToLatex tex={"180^{\\circ}"}/>. A rigorous explanation of why this is the case is too large to fit in this small margin, but it can be verified for any example one draws. (Note that, to measure the angle of intersection of two (differentiable) curves, we measure the angle of their tangent lines at the intersection point.)
          </Card.Text>

          <Card.Text>
            In fact, if we allow our vertices to go all the way to the boundary of hyperbolic space (i.e., the <ToLatex tex={"x"}/> axis, see the previous subsection), then we can draw triangles where every one of its angles is 0 degrees! Try drawing one for yourself with this tool: you can draw any triangle to start, and then drag all of the vertices as close as you can to the horizontal axis. You'll notice that the angles of intersection get very small; although, they never actually get to zero as you can see by zooming in.
          </Card.Text>

          <Card.Text>
            It turns out that the area of any hyperbolic triangle with angles labeled by <ToLatex tex={"A, B,"}/> and <ToLatex tex={"C"}/> is given by <ToLatex displayMode tex={"\\text{Area}=\\pi - (A+B+C)."}/>
          </Card.Text>

          <Card.Text>
            In particular, the area of an ideal triangle is exactly <ToLatex tex={"\\pi"}/>.
          </Card.Text>
        </CollapsibleCard>

        <CollapsibleCard
          title={"Documentation"}
          isOpen={openCard === "Documentation"}
          toggleIsOpen={toggleIsOpen}
        >
          <Card.Text>
            This section has been included at the request of some very helpful reviewers who were interested in how various mathematical aspects of this tool were achieved. It will cover
          </Card.Text>

          <ul>
            <li>The canvas and math coordinate systems</li>
            <li>Geometric constructions</li>
            <li>Panning and zooming</li>
            <li>Animations via Möbius Transformations</li>
          </ul>

          <hr/>
          
          <div>
            <Card.Text>
              <strong>Coordinates</strong>
              <br/>
              We will use two coordinate systems for rendering drawings on the screen: <em>canvas</em>-coordinates and <em>math</em>-coordinates. 
            </Card.Text>

            <Card.Text>
              In the canvas coordinate system, the origin is at top left corner of the screen. The horizontal coordinate {canvasX} increases from left to right, while the vertical coordinate {canvasY} increases from top to bottom. So, for example, the bottom right corner has canvas coordinates <ToLatex tex={"(W, H)"}/> if the screen has width <ToLatex tex={"W"}/> and height <ToLatex tex={"H"}/>.
            </Card.Text>

            <Card.Text>
              On the other hand, the math coordinates are essentially Cartesian coordinates. The origin has canvas coordinates <ToLatex tex={"\\left(\\frac{W}{2}, \\frac{9H}{10}\\right)"}/>, the horizontal coordinate {mathX} increases from left to right, and the vertical coordinate {mathY} increases from bottom to top.
            </Card.Text>

            <Card.Text>
              When the page is first loaded, the ratio <ToLatex tex={"u"}/> of pixels in the canvas coordinates to length in the math coordinates is 1. Zooming will change this value, but the important thing to notice now is that <ToLatex tex={"u"}/> allows us to tie canvas and math coordinates together. In the figure below, the coordinates <ToLatex tex={"(o_x, o_y)"}/> denote the canvas coordinates of the math coordinate system's origin (after some panning and/or zooming).
            </Card.Text>

            <Image src={coordDiagram} fluid className="mb-3"/>

            <Card.Text>
              To derive a change of coordinates from this picture, we want to compare the lengths (in pixels) of the dashed and colored edges. For example, the vertical axis is <ToLatex tex={"o_y"}/> pixels tall, and is the same height as the sum of the green and blue vertical dashed edges. This leads to:

              <ToLatex displayMode tex={"c_y + \\frac{m_y}{u} = o_y\\quad\\text{(Y)}"}/>
            </Card.Text>

            <Card.Text>
              Similar considerations in the horizontal direction gives:

              <ToLatex displayMode tex={"o_x + \\frac{m_x}{u} = c_x\\quad\\text{(X)}"}/>
            </Card.Text>

            <Card.Text>
              Solving equations <ToLatex tex={"(X)"}/> and <ToLatex tex={"(Y)"}/> lead to our change of coordinates:

              <ToLatex displayMode tex={"m_x = u (c_x - o_x)"}/>
              <ToLatex displayMode tex={"m_y = u (o_y - c_y)"}/>

              and

              <ToLatex displayMode tex={"c_x = o_x + \\frac{m_x}{u}"}/>
              <ToLatex displayMode tex={"c_y = o_y - \\frac{m_y}{u}"}/>
            </Card.Text>
          </div>

          <hr/>

          <div>
            <Card.Text>
              <strong>Geometric Constructions</strong>
              <br/>
              All drawings are placed when the user clicks (or "taps", but I'll just say clicks for convenience) on their screen the appropriate amount of times, e.g., a circle requires a first click to specify the center and then a second click to specify the radius. Each click's location in canvas coordinates is detected, collected for multi-click shapes, and then it/they is/are used to calculate the position of the drawing.
            </Card.Text>

            <Card.Text>
              We'll consider the example of a geodesic segment, as it is one of the more complicated, and hence illustrative, examples. In what follows, a "line segment" should be understood to be a Euclidean line segment.
            </Card.Text>

            <Card.Text>
              Suppose we are given a pair of points <ToLatex tex={"p"}/> and <ToLatex tex={"q"}/> expressed in canvas coordinates as <ToLatex tex={"p=(p_{c_x}, p_{c_y})"}/> and <ToLatex tex={"q=(q_{c_x}, q_{c_y})"}/>. If, for some predetermined tolerance <ToLatex tex={"T > 0"}/>, we have <ToLatex tex={"|p_{c_x} - q_{c_x}| < T"}/>, then the geodesic segment connecting <ToLatex tex={"p"}/> and <ToLatex tex={"q"}/> is simply a vertical line segment (<ToLatex tex={"T"}/> should be chosen based on the inner workings of the various JavaScript libraries that were used in this process, but I admit I'm not sure how to choose it effectively).
            </Card.Text>

            <Card.Text>
              On the other hand, if <ToLatex tex={"|p_{c_x} - q_{c_x}| \\geq T"}/>, then the line segment connecting <ToLatex tex={"p"}/> to <ToLatex tex={"q"}/> has finite slope. Thus, its perpendicular bisector intersects the <ToLatex tex={"x"}/> axis at some point <ToLatex tex={"\\gamma = (\\gamma_{c_x}, \\gamma_{c_y})"}/>. This point is equidistant from <ToLatex tex={"p"}/> and <ToLatex tex={"q"}/> and hence is the center of the circle determining the geodesic line through <ToLatex tex={"p"}/> and <ToLatex tex={"q"}/>. We can then determine the radius of this circle with the Pythagorean Theorem.
            </Card.Text>

            <Card.Text>
              Finally, we need to determine the angles that <ToLatex tex={"p"}/> and <ToLatex tex={"q"}/> make with respect to the center <ToLatex tex={"\\gamma"}/> to know which portion of the circle to draw. This can be accomplished, in either canvas or math coordinates, using the inverse tangent.
            </Card.Text>

            <Card.Text>
              The position of all other drawings can be computed similarly, with easy to follow descriptions existing on <HyperLink urlCode={"halfPlane"}>Wikipedia</HyperLink>.
            </Card.Text>
          </div>

          <hr/>

          <Card.Text>
            <strong>Panning and Zooming</strong>
            <br/>
          </Card.Text>

          <Card.Text className="text-danger">
            COMING SOON!
          </Card.Text>

          <hr/>

          <Card.Text>
            <strong>Animations</strong>
            <br/>
          </Card.Text>

          <Card.Text className="text-danger">
            COMING SOON...
          </Card.Text>
        </CollapsibleCard>

        <CollapsibleCard
          title={"Give Feedback"}
          isOpen={openCard === "Give Feedback"}
          toggleIsOpen={toggleIsOpen}
        >
          <Card.Text>
            I am very interested in your feedback and would be deeply appreciative if you took the time to send it!
          </Card.Text>

          <Card.Text>
            The source code can be found in the project's <HyperLink urlCode={"github"}>GitHub</HyperLink> repository; moreover, in the README, you can find a list of suggestions I've already received.
          </Card.Text>

          <Card.Text>
            Thanks for trying out Hyperbolic Paint! Tell your friends!
          </Card.Text>

          <hr/>

          <SuggestionForm/>
        </CollapsibleCard>
      </Stack>
    </OffcanvasDrawer>
  );

  function toggleIsOpen(cardName) {
    setOpenCard(openCard === cardName ? null : cardName);
  }
}