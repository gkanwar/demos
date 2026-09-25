# Exercise catalog

This catalog specifies the next set of menu exercises. Each table row is one
distinct exercise entry. An entry may generate small variations (coefficients,
orientation, or support location) from a seed, but those variations do not add
menu entries. The exercises use mathematical notation and geometric settings
throughout.

The existing app already supports equations, paragraphs, plot and geometry
widgets in a statement, followed by single-choice or multiple-selection
questions. Each exercise below can be built with that interface. When students
must choose a plot, show labeled plots **in the statement** and make the answer
options their labels; answer options do not contain widgets. Some rows name a
result to check; its incorrect choices should represent likely sign, factor,
direction, or coordinate errors.

## Shared conventions

- Use $\vec x=(x,y,z)$ in three dimensions and $(x,y)$ in two. State the
  dimensionality when it matters. Use $\hat e_1,\hat e_2,\hat e_3$ for Cartesian
  basis vectors.
- Cylindrical coordinates are $(\rho,\phi,z)$, with
  $x=\rho\cos\phi$, $y=\rho\sin\phi$. Spherical coordinates are
  $(r,\theta,\phi)$, with $\theta$ measured from $+z$ and $\phi$ the
  azimuth from $+x$. Give these conventions in coordinate questions.
- Closed surfaces have outward normals unless otherwise stated. A planar loop
  described as counterclockwise is viewed from $+z$. A *planar surface* means
  a disk or rectangle with a closed boundary, rather than a closed curve.
- Give any field, region, and differential element in coordinates useful for
  the requested integral. Coordinate conversion is practiced separately; an
  integration exercise should not depend on an unstated conversion trick.
- Exclude singular points from sampled plots and derivative questions when a
  field is undefined there. Place delta-function support strictly inside or
  outside region boundaries, avoiding boundary-value conventions. State that
  shape parameters and lengths are positive.
- Several exercises have more than one useful question part, such as identifying
  a normal before evaluating flux. All parts belong to the same menu entry.

## Group map and implementation order

| Group | Module ID | Implementation note |
| --- | ---: | --- |
| Visualizing fields | `visualization` | Move the existing `identify-radial-field` here when coding this group. |
| Fields and derivatives | `differential` | Expand the existing module. |
| Coordinate systems | `coordinates` | Use equations and simple geometry/field plots. |
| Units | `units` | Use symbolic length powers. |
| Line integrals | `line-integrals` | Start with segments and rectangles. |
| Surface integrals | `flux` | Expand the existing cube and sphere module. |
| Volume integrals | `volume-integrals` | Prefer elementary bounds and symmetry. |
| Delta functions | `delta-functions` | Test sifting, scaling, and region support. |
| Piecewise functions | `piecewise` | Build cumulative integrals with piecewise answers. |

The module IDs above are future code organization, not a request to rename
current modules now. The site has no live progress data to migrate. Six rows
below correspond to exercises already implemented; retain their exercise IDs
and behavior when extending or reorganizing the modules.

## Visualizing fields

Use consistent arrows or contours across the labeled plot choices. Distractor
answers should differ in direction, dependence on position, or symmetry. Plot samples
should avoid a singularity when one is present.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `uniform-vector-2d` | A uniform rightward 2D vector field; choose $\hat e_1$ from constant, radial, and rotating expressions. | Vector plot → equation; vary axis and sign. |
| `outward-radial-2d` | A field $(x,y)$; choose its equation rather than a constant or normalized radial field. | Vector plot → equation; use arrows with lengths increasing outward. |
| `inward-radial-2d` | A field $-(x,y)$; choose the inward expression. | Vector plot → equation; contrast the outward sign. |
| `planar-rotation` | A field $(-y,x)$; distinguish rotation from radial and saddle fields. | Vector plot → equation; vary rotation sense. |
| `saddle-vector-2d` | A field $(x,-y)$; identify opposing behavior along the axes. | Vector plot → equation; vary axis signs. |
| `uniform-vector-3d` | A constant field $\hat e_3$; select the matching expression. | Interactive 3D vector plot → equation; vary Cartesian direction. |
| `identify-radial-field` | The 3D field $\vec x$; distinguish it from $\lvert\vec x\rvert\hat e_1$ and normalized radial fields. | Existing exercise; 3D vector plot → equation. Move from `differential` later. |
| `inverse-square-radial-3d` | The field $\vec x/\lvert\vec x\rvert^3$; identify its radial direction and decreasing length away from the origin. | 3D vector plot → equation; omit the origin. |
| `scalar-ramp-contours` | Contours of $f(x,y)=x$; choose the scalar equation. | Scalar contour plot → equation; vary ramp direction. |
| `scalar-bowl-contours` | Concentric contours of $f(x,y)=x^2+y^2$; distinguish a bowl from a cone and a shifted bowl. | Scalar contour plot → equation; show level values. |
| `shear-equation-to-plot` | Given $\vec F=(y,0)$, choose the plot with horizontal arrows reversing across $y=0$. | Equation → four labeled 2D vector plots in statement. |
| `gaussian-equation-to-plot` | Given $f=e^{-(x^2+y^2)}$, choose the centered peak with decreasing circular contours. | Equation → four labeled scalar plots in statement. |

## Fields and derivatives

Give Cartesian fields and ask for a formula or a plot-level interpretation.
For plot questions, mark the point or region being judged. Seeded coefficients
should be small integers, including signs where useful.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `gradient-linear-scalar` | For $f=ax+by+cz$, choose $\nabla f=(a,b,c)$. | Equation → vector expression; vary coefficients. |
| `gradient-squared-norm` | For $f=\lvert\vec x\rvert^2$, identify $\nabla f=2\vec x$, then evaluate at a marked point. | Existing exercise; keep its two questions. |
| `gradient-xy-z2` | For $f=xy+z^2$, choose $(y,x,2z)$. | Equation → vector expression; distract with unswapped components. |
| `gradient-distance` | For $f=\lvert\vec x\rvert$, choose $\vec x/\lvert\vec x\rvert$ for $\vec x\ne0$. | Equation → vector expression; state the excluded origin. |
| `gradient-gaussian` | For $f=e^{-\lvert\vec x\rvert^2}$, choose $-2\vec x e^{-\lvert\vec x\rvert^2}$. | Equation → vector expression; test chain-rule sign and factor. |
| `gradient-from-contours` | At a marked point on increasing scalar contours, select the direction perpendicular to the contours toward larger values. | Scalar contour widget → direction choice. |
| `contours-to-gradient-plot` | A displayed scalar ramp or bowl; choose the corresponding constant or radial gradient field. | Scalar plot plus four labeled vector plots in statement. |
| `divergence-constant-field` | For a constant vector field, choose $\nabla\cdot\vec F=0$. | Equation → scalar expression; vary constant components. |
| `divergence-radial-field` | For $\vec F=\vec x$ in 3D, choose $\nabla\cdot\vec F=3$. | Existing exercise. |
| `linear-divergence` | For $\vec F=(ax,by,cz)$, choose $a+b+c$. | Existing seeded exercise; vary small integer coefficients. |
| `divergence-shear-field` | For $\vec F=(y,0,0)$, choose zero despite a changing field. | Equation → scalar expression; compare derivative directions. |
| `divergence-sign-from-plots` | Decide whether outward, inward, and pure-rotation plots have positive, negative, or zero divergence. | Three labeled 2D vector plots; one choice per plot. |
| `curl-planar-rotation` | For $\vec F=(-y,x,0)$, choose $\nabla\times\vec F=2\hat e_3$. | Equation → vector expression; vary rotation sign. |
| `curl-mixed-linear` | For $\vec F=(ay,bz,cx)$, choose $\nabla\times\vec F=(-b,-c,-a)$. | Equation → vector expression; vary coefficients. |
| `curl-direction-from-plot` | A planar rotation plot; identify curl along $+\hat e_3$ or $-\hat e_3$. | 2D vector plot → direction choice; vary rotation sense. |

## Coordinate systems

Supply the coordinate convention above in each relevant statement. Use simple
points and angles so choices can be exact. For vector questions, state both
the point and the vector; components depend on position.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `cartesian-to-cylindrical-point` | Convert a point such as $(1,1,2)$ to $(\sqrt2,\pi/4,2)$. | Equation choices; vary quadrant away from the axis. |
| `cylindrical-to-cartesian-point` | Convert $(\rho,\phi,z)=(2,\pi/2,1)$ to $(0,2,1)$. | Equation choices; vary standard angles. |
| `cartesian-to-spherical-point` | Convert $(1,1,\sqrt2)$ to $(r,\theta,\phi)=(2,\pi/4,\pi/4)$. | Equation choices; vary exact-angle points away from the axis. |
| `spherical-to-cartesian-point` | Convert a simple $(r,\theta,\phi)$, such as $(2,\pi/2,\pi/4)$, to Cartesian coordinates. | Equation choices; vary standard angles. |
| `cartesian-to-cylindrical-vector` | At $\phi=\pi/2$, express $\hat e_1$ as $-\hat e_\phi$. | Show the point/angle and basis diagram or equation. |
| `cylindrical-to-cartesian-vector` | At $\phi=\pi/4$, convert a simple $\hat e_\rho$ or $\hat e_\phi$ vector. | Equation choices with distractor answers that use the wrong sign or basis. |
| `cartesian-to-spherical-vector` | At $(\theta,\phi)=(\pi/2,0)$, express $\hat e_3=-\hat e_\theta$. | State the point explicitly; equation choices. |
| `spherical-basis-directions` | At a simple off-axis point, identify radial, polar, and azimuthal unit-vector directions. | Geometry widget with marked point; multiple questions. |
| `cylindrical-line-element` | Identify $d\vec\ell=\hat e_\rho d\rho+\hat e_\phi\rho d\phi+\hat e_3 dz$, or the length along a fixed-$\rho,z$ arc. | Equation choices; emphasize the $\rho$ factor. |
| `cylinder-area-element` | On $\rho=R$, identify outward $d\vec A=\hat e_\rho R\,d\phi\,dz$. | Cylinder geometry widget; normal and area-element questions. |
| `sphere-area-element` | On $r=R$, identify outward $d\vec A=\hat e_r R^2\sin\theta\,d\theta\,d\phi$. | Sphere geometry widget; test $\sin\theta$ factor. |
| `coordinate-volume-elements` | Match $dV=\rho\,d\rho\,d\phi\,dz$ and $dV=r^2\sin\theta\,dr\,d\theta\,d\phi$ to cylindrical/spherical coordinates. | Two questions or multiple selection; exact equation choices. |

## Units

Every statement declares $[f]=L^p$ or $[\vec F]=L^p$, with $p$ an
integer; only powers of length matter. Ask for the resulting power of $L$,
not a named physical unit.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `ordinary-derivative-units` | Given $[f]=L^p$, find $[df/dx]=L^{p-1}$. | Equation choices; vary $p$. |
| `gradient-units` | Given $[f]=L^p$, find $[\nabla f]=L^{p-1}$. | Equation choices; vary $p$. |
| `divergence-curl-units` | Given $[\vec F]=L^p$, find both $[\nabla\cdot\vec F]$ and $[\nabla\times\vec F]=L^{p-1}$. | Two questions in one entry. |
| `line-integral-units` | Given $[\vec F]=L^p$, find $[\int_C\vec F\cdot d\vec\ell]=L^{p+1}$. | Equation choices. |
| `surface-integral-units` | Given $[\vec F]=L^p$, find $[\int_S\vec F\cdot d\vec A]=L^{p+2}$. | Equation choices. |
| `volume-integral-units` | Given $[f]=L^p$, find $[\int_V f\,dV]=L^{p+3}$. | Equation choices. |
| `delta-units-by-dimension` | Find the length powers of $\delta(x)$, $\delta^{(2)}(\vec x)$, and $\delta^{(3)}(\vec x)$: $L^{-1},L^{-2},L^{-3}$. | Three linked questions or one matching choice. |
| `delta-weighted-integral-units` | Given $[f]=L^p$, find $[\int f(\vec x)\delta^{(3)}(\vec x-\vec a)\,dV]=L^p$. | Equation choices; show cancellation of measure and delta powers in explanation. |

## Line integrals

Give a parametrization or simple endpoints whenever it removes ambiguity.
Orient every closed curve explicitly. A plot of a path or field can accompany
the equations, but the calculation must remain solvable from the statement.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `constant-scalar-on-segment` | Integrate a constant scalar $c$ over a straight segment of length $a$: $\int_C c\,ds=ca$. | Segment geometry widget; vary $c,a>0$. |
| `linear-scalar-on-segment` | Along $(x,0)$, $0\le x\le a$, evaluate $\int_C x\,ds=a^2/2$. | Segment plot plus equation choices. |
| `constant-vector-parallel-segment` | For $\vec F=c\hat e_1$ and a segment directed from $(0,0)$ to $(a,0)$, evaluate $\int_C\vec F\cdot d\vec\ell=ca$. | Field/path plot; vary traversal direction. |
| `constant-vector-perpendicular-segment` | For $\vec F=c\hat e_1$ and a vertical segment, choose zero. | Field/path plot; distract with field magnitude times length. |
| `rectangular-path-contributing-legs` | For $\vec F=y\hat e_1$ on the counterclockwise rectangle $[0,a]\times[1,2]$, select the two horizontal legs with nonzero $\vec F\cdot d\vec\ell$. | Labeled path; multiple selection over four legs. |
| `constant-field-square-circulation` | For constant $\vec F$, sum the four oriented side integrals of a square and choose zero. | Labeled square and field arrows; optionally ask paired-leg cancellation. |
| `rotation-field-circle-circulation` | On a counterclockwise radius-$R$ circle, $\vec F=(-y,x)$ gives $\oint_C\vec F\cdot d\vec\ell=2\pi R^2$. | Circle/field plot; vary $R$ and orientation. |
| `shear-field-square-circulation` | For $\vec F=(y,0)$ on the counterclockwise unit square $[0,1]^2$, choose circulation $-1$. | Labeled square; show segment contributions in explanation. |
| `gradient-field-endpoints` | Given $f=x^2+y^2$ and $\vec F=\nabla f$, use endpoints $P,Q$ to choose $\int_P^Q\vec F\cdot d\vec\ell=f(Q)-f(P)$. | Path plot with endpoints; vary simple coordinates and path shape. |
| `stokes-simple-check` | For $\vec F=(-y/2,x/2,0)$, compare counterclockwise circulation around the unit square with $\int_S(\nabla\times\vec F)\cdot\hat e_3\,dA$; both equal $1$. | Planar square with oriented boundary; ask for curl and equal integral values. |

## Surface integrals

Use labeled faces for selection questions and state each orientation. A disk
or rectangle is a planar patch even though its boundary is a closed curve.
For the cube rows, use the existing unit cube centered at the origin and its
face labels $A,\ldots,F$.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `constant-field-cube` | For $\vec F=\alpha\hat e_1$, select the two cube faces with nonzero flux. | Existing exercise; labeled cube and 3D field plot; multiple selection. |
| `cube-face-flux-signs` | With the same field and cube, identify positive flux on the $+x$ face and negative flux on the $-x$ face. | Labeled cube; separate sign questions or one matching choice. |
| `constant-field-cube-total` | Sum fluxes of a constant field through all six cube faces; choose zero. | Labeled cube; vary field axis. |
| `linear-field-cube-flux` | For $\vec F=x\hat e_1$ on the centered unit cube, each $x$-face contributes $1/2$; total flux is $1$. | Labeled cube and field plot; ask face contributions then total. |
| `sphere-flux` | For $\vec F=\vec x$ on the outward unit sphere, identify the normal at $(1,0,0)$ and total flux $4\pi$. | Existing exercise; sphere and vector field plot. |
| `constant-field-sphere-flux` | A constant field through an outward sphere has zero total flux by opposite-point cancellation. | Sphere and field plot; choose zero. |
| `inward-field-sphere-flux` | For $\vec F=-\vec x$ on the outward radius-$R$ sphere, choose $-4\pi R^3$. | Sphere and field plot; vary $R$. |
| `axial-field-cylinder-parts` | For $\vec F=\hat e_3$ on a closed vertical cylinder, select the two caps as nonzero, with opposite signs; side contributes zero. | Labeled cylinder geometry and vector plot; multiple selection then signs. |
| `radial-field-cylinder-flux` | For $\vec F=(x,y,0)$ on a radius-$R$, height-$h$ closed cylinder, side flux is $2\pi R^2h$ and cap fluxes are zero. | Cylinder plot; ask contributing pieces and total. |
| `oriented-disk-flux` | For $\vec F=c\hat e_3$ on a radius-$R$ disk oriented toward $+z$, choose $c\pi R^2$. | Planar disk widget with normal; vary orientation. |
| `tilted-rectangle-flux` | For $\vec r(u,v)=(u,v,u)$, $0\le u,v\le1$, oriented by $\partial_u\vec r\times\partial_v\vec r=(-1,0,1)$, flux of $\hat e_3$ is $1$. | Geometry plot; give parametrization and orientation; ask normal then flux. |
| `divergence-theorem-check` | For $\vec F=\vec x$ on the unit cube, compare total outward flux $3$ with $\int_V\nabla\cdot\vec F\,dV=3$. | Cube and field plot; ask divergence and equal values. |

## Volume integrals

Use exact choices. In radial examples, provide the suitable volume element
and simple radial bounds. The all-space Gaussian entry supplies its one-dimensional
integral identity, so no special-function knowledge is required.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `constant-box-integral` | Integrate constant $c$ over a box of side lengths $a,b,h$: $cabh$. | Box geometry widget; vary positive lengths. |
| `odd-centered-box-integral` | Integrate $x$ over $[-a,a]\times[-b,b]\times[-h,h]$: zero by odd symmetry. | Box widget; ask symmetry reason as optional second question. |
| `linear-positive-box-integral` | Integrate $x$ over $[0,a]\times[0,b]\times[0,h]$: $a^2bh/2$. | Box widget; exact equation choices. |
| `quadratic-unit-cube-integral` | Integrate $x^2+y^2+z^2$ over $[0,1]^3$: $1$. | Cube widget; distract with one-component integral $1/3$. |
| `constant-ball-integral` | Integrate $c$ over a radius-$R$ ball: $4\pi cR^3/3$. | Ball widget; supply spherical $dV$. |
| `squared-radius-ball-integral` | Integrate $r^2$ over a radius-$R$ ball: $4\pi R^5/5$. | Ball widget; supply spherical $dV$. |
| `constant-shell-integral` | Integrate $c$ over spherical shell $a<r<b$: $4\pi c(b^3-a^3)/3$. | Shell geometry widget; state $0<a<b$. |
| `constant-cylinder-integral` | Integrate $c$ over $0\le\rho\le R$, $0\le z\le h$, full azimuth: $c\pi R^2h$. | Cylinder widget; supply cylindrical $dV$. |
| `separable-all-space-integral` | Integrate $e^{-\lvert x\rvert-\lvert y\rvert-\lvert z\rvert}$ over $\mathbb R^3$: $8$, using three one-dimensional factors. | Equation choices; give $\int_{-\infty}^{\infty}e^{-\lvert t\rvert}dt=2$ if needed. |
| `gaussian-all-space-integral` | Integrate $e^{-(x^2+y^2+z^2)}$ over $\mathbb R^3$: $\pi^{3/2}$. | Equation choices; supply $\int_{-\infty}^{\infty}e^{-t^2}dt=\sqrt\pi$. |

## Delta functions

Use $\delta^{(2)}(\vec x-\vec a)=\delta(x-a_x)\delta(y-a_y)$ and its
three-dimensional counterpart. State this product convention in multi-dimensional
questions. Shape parameters are positive, and support points never lie on
boundaries. Region widgets mark both the domain and support point.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `delta-1d-sifting` | Evaluate $\int_{-\infty}^{\infty}f(x)\delta(x-a)\,dx=f(a)$ for a polynomial $f$. | Equation choices; vary $a$ and simple polynomial. |
| `delta-1d-inside-interval` | A delta centered strictly inside $(u,v)$ contributes $f(a)$ to $\int_u^v f(x)\delta(x-a)\,dx$. | Number-line graphic; vary support and interval. |
| `delta-1d-outside-interval` | A delta centered strictly outside $[u,v]$ contributes zero. | Number-line graphic; avoid endpoint cases. |
| `scaled-delta-1d` | Evaluate $\int f(x)\delta(2x-a)\,dx=f(a/2)/2$. | Equation choices; vary $a$, test scale factor. |
| `two-shifted-deltas` | Evaluate $\int f(x)[\delta(x-a)+\delta(x-b)]\,dx=f(a)+f(b)$. | Number line with two support marks; vary simple $f,a,b$. |
| `delta-2d-sifting` | Evaluate $\int_{\mathbb R^2}f(x,y)\delta(x-a)\delta(y-b)\,dA=f(a,b)$. | Scalar equation; vary simple linear/quadratic $f$. |
| `delta-2d-disk-support` | Decide whether support $(a,b)$ lies inside $x^2+y^2<R^2$, then choose $f(a,b)$ or zero. | Disk and support-point plot; vary strictly inside/outside. |
| `delta-2d-rectangle-support` | A support point strictly outside an axis-aligned rectangle gives zero integral; inside gives $f(a,b)$. | Rectangle and point plot; use seeded cases. |
| `delta-3d-sifting` | Evaluate $\int_{\mathbb R^3}f(\vec x)\delta^{(3)}(\vec x-\vec a)\,dV=f(\vec a)$. | Equation choices; simple polynomial and point. |
| `delta-3d-ball-support` | Test $\lvert\vec a\rvert<R$ for a ball, then choose $f(\vec a)$ or zero. | Ball and support-point geometry widget; vary position. |
| `delta-3d-ellipsoid-support` | Test $a_x^2/A^2+a_y^2/B^2+a_z^2/C^2<1$ for an ellipsoid, then choose the delta integral. | Ellipsoid equation and marked support point; small exact parameters. |
| `delta-3d-cylinder-support` | Test $a_x^2+a_y^2<R^2$ and $0<a_z<h$ for a finite cylinder, then choose the delta integral. | Cylinder and marked support point; include outside-side and outside-cap cases. |

## Piecewise functions

Every entry asks for the *whole function* of a moving upper bound or radius,
with multiple-choice answers written as piecewise equations. Use two or three
branches per choice. At transition values the formulas agree, so use a clear
$\le$/$>$ convention and avoid questions about endpoint values. Show a
plot of the source function or integration region where it helps.

| Exercise ID | Setup and checked answer | Presentation / variation |
| --- | --- | --- |
| `one-sided-top-hat-cumulative` | For $f(t)=1$ on $0<t<a$, zero elsewhere, $G(x)=\int_0^x f(t)\,dt$ for $x\ge0$ is $x$ for $x\le a$, then $a$. | Step-function plot; vary $a>0$. |
| `symmetric-slab-cumulative` | For $f(z)=c$ on $\lvert z\rvert<a$, zero elsewhere, $G(s)=\int_{-s}^{s}f(z)\,dz$ for $s\ge0$ is $2cs$ for $s\le a$, then $2ca$. | Slab plot and moving limits; vary $c,a$. |
| `weighted-slab-cumulative` | For $f(z)=z$ on $0<z<a$, zero elsewhere, $G(s)=\int_0^s f(z)\,dz$ is $s^2/2$ then $a^2/2$. | Function plot; test integration before/after support ends. |
| `nested-slab-layers` | For $f(z)=c_1$ on $\lvert z\rvert<a$, $c_2$ on $a<\lvert z\rvert<b$, zero beyond, $\int_{-s}^s f(z)\,dz$ is $2c_1s$, then $2c_1a+2c_2(s-a)$, then $2c_1a+2c_2(b-a)$. | Layer plot; ranges $s\le a$, $a<s\le b$, $s>b$ with $0<a<b$. |
| `one-sided-step-cumulative` | For $f(t)=0$ when $t<a$, $c$ when $t>a$, $G(x)=\int_0^x f(t)\,dt$ for $x\ge0$ is zero then $c(x-a)$. | Step plot; $a>0$. |
| `uniform-disk-cumulative` | Integrate constant $c$ over the intersection of a radius-$s$ disk and a concentric radius-$R$ disk: $c\pi s^2$ for $s\le R$, then $c\pi R^2$. | Two concentric disk outlines; supply polar area element. |
| `uniform-ball-cumulative` | Integrate constant $c$ over the intersection of radius-$s$ and radius-$R$ concentric balls: $4\pi cs^3/3$ then $4\pi cR^3/3$. | Concentric ball geometry; supply spherical volume element. |
| `hollow-shell-cumulative` | Integrate unit density over $a<r<b$ inside a growing radius-$s$ ball: zero for $s\le a$, $4\pi(s^3-a^3)/3$ for $a<s<b$, then $4\pi(b^3-a^3)/3$. | Shell and moving-ball geometry; $0<a<b$. |
| `quadratic-ball-cumulative` | Integrate $f(r)=r^2$ for $r<R$, zero outside, over a growing radius-$s$ ball: $4\pi s^5/5$ for $s\le R$, then $4\pi R^5/5$. | Ball geometry; supply spherical volume element. |

## Authoring notes

Use one reusable generator per exercise ID where coefficients or geometry vary.
Seeded variants must preserve an unambiguous correct answer and keep support
points away from region boundaries. For multiple-selection questions, make the
available labels correspond exactly to the marked faces or path pieces.

The existing widgets cover vector fields, scalar fields, and basic geometry.
Additional geometry presets (paths, disks, cylinders, shells, ellipsoids,
marked support points) can be introduced incrementally. A text or equation
statement is sufficient until a preset exists; the mathematical question and
answer options above do not depend on a new renderer. Keep explanations focused
on the single key operation or geometric observation in each entry.
