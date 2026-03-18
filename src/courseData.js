// courseData.js — All 6 units for Force and Laws of Motion

const courseData = {
  title: "Force and Laws of Motion",
  subtitle: "Explore the fundamental principles that govern how objects move and interact",
  units: [
    // ── UNIT 1 ──────────────────────────────────────────
    {
      id: "unit-1",
      number: 1,
      title: "Introduction to Force",
      color: "#00D4FF",
      colorSoft: "rgba(0,212,255,0.12)",
      icon: "🚀",
      videos: [],
      sections: [
        {
          heading: "1.1 The Quest for the Cause of Motion",
          content: `<p>In our previous study of motion, we focused on <i>describing</i> how objects move, tracking their position, velocity, and acceleration. Now, we shift our focus to the "why." This unit explores the underlying cause of motion and the evolution of how we understand it.</p>
<p>For centuries, the mystery of what causes motion puzzled the greatest minds. Early observations, like a ball eventually stopping after being hit, led to the long-held belief that <b>rest</b> was the "natural state" of an object. This perspective changed only when <b>Galileo Galilei</b> and <b>Isaac Newton</b> introduced a revolutionary approach to physics.</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120459-23.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><b><i>Pushing, pulling, or hitting objects change their state of motion</i></b></p>`
        },
        {
          heading: "1.2 Defining Force",
          content: `<p>We cannot see, taste, or smell a force, but we constantly experience its effects. It can only be explained by describing what happens when a force is applied to an object. Pushing, hitting and pulling of objects are all ways of bringing objects in motion. They move because we make a force act on them. In everyday life, we encounter force as a <b>muscular effort</b> used to:</p>
<ul class="rich-list">
	<li><b>Push</b> a trolley.</li>
	<li><b>Pull</b> a drawer.</li>
	<li><b>Hit</b> a ball with a hockey stick.</li>
</ul>
<p>Essentially, a <b>force</b> is a push, hit, or pull that acts upon an object to change its state of motion.</p>`
        },
        {
          heading: "1.3 Effects of Force",
          content: `<p>A force is best explained by what it <i>does</i> to an object. Beyond just starting or stopping motion, a force can:</p>
<ol class="rich-list">
	<li><b>Change Magnitude:</b> Make an object move faster (acceleration) or slower (deceleration).</li>
	<li><b>Change Direction:</b> Alter the path an object is traveling.</li>
	<li><b>Change Shape and Size:</b> For example, stretching a spring or compressing a rubber ball.</li>
</ol>
<p>A force can be used to change the magnitude of velocity of an object (that is, to make the object move faster or slower) or to change its direction of motion. We also know that a force can change the shape and size of objects.</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120459-24.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p>(a) A spring expands on application of force;<br>(b) A spherical rubber ball becomes oblong as we apply force on it.</p>`
        }
      ]
    },

    // ── UNIT 2 ──────────────────────────────────────────
    {
      id: "unit-2",
      number: 2,
      title: "Balanced & Unbalanced Forces",
      color: "#FFB800",
      colorSoft: "rgba(255,184,0,0.12)",
      icon: "⚖️",
      videos: [],
      sections: [
        {
          heading: "Balanced Forces",
          content: `<ul class="rich-list">
	<li><b>Definition:</b> When equal forces act on an object in opposite directions, the net force is zero.</li>
	<li><b>Effect:</b> These forces <b>do not change</b> the state of rest or the state of motion of an object.</li>
	<li><b>Example (Strings):</b> If a wooden block is pulled from both sides (String X and String Y) with equal force, it will not move.</li>
	<li><b>Example (Box):</b> When children push a box with a small force and it doesn't move, the friction force perfectly balances the pushing force.</li>
</ul>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120814-25.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><i>Two forces acting on a wooden block</i></p>`
        },
        {
          heading: "Unbalanced Forces",
          content: `<ul class="rich-list">
	<li><b>Definition:</b> When two opposite forces of different magnitudes act on an object, a net force exists in the direction of the greater force.</li>
	<li><b>Effect:</b> An unbalanced force is <b>required to accelerate</b> an object (change its speed or direction). If an unbalanced force is removed completely, the object will continue to move at the velocity it has already acquired.</li>
	<li><b>Example (Box):</b> If children push hard enough that the pushing force becomes bigger than the friction force, the box starts moving.</li>
</ul>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120814-26.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>`
        },
        {
          heading: "Activity 4: Ramp Forces and Motion",
          type: "activity",
          content: `<p>Explore how unbalanced forces affect motion on an inclined plane. Try adjusting the ramp and observe the interaction of forces like gravity and friction.</p>
<div style="width: 100%; height: 500px; border: 3px solid #FFB800; margin-top: 1rem;">
    <iframe src="https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=ramp-forces-and-motion" width="100%" height="100%" style="border: none;" allowfullscreen title="PhET Motion Series (Ramp Forces and Motion)"></iframe>
</div>`
        },
        {
          heading: "Friction & Key Insights",
          content: `<h3>Friction</h3>
<ul class="rich-list">
	<li><b>Definition:</b> A force that arises between two surfaces in contact (e.g., the bottom of a box and a rough floor).</li>
	<li><b>Direction:</b> It always acts in a direction <b>opposite</b> to the push or the direction of motion.</li>
	<li><b>The Bicycle Example:</b> When you stop pedaling, a bicycle slows down because friction acts against the motion. To keep it moving at a <b>uniform velocity</b>, you only need to balance the frictional force so there is no net external force.</li>
</ul>
<h3>Key Insights (The "Extra" Details)</h3>
<ul class="rich-list">
	<li><b>Uniform Velocity:</b> Contrary to popular belief, you don't need a net unbalanced force to keep something moving. If the pushing force and frictional force are perfectly <b>balanced</b>, the object moves at a constant (uniform) velocity.</li>
	<li><b>Acceleration:</b> To change the speed or direction of an object, an <b>unbalanced force</b> must be applied. This change continues as long as that unbalanced force is present.</li>
</ul>`
        }
      ]
    },

    // ── UNIT 3 ──────────────────────────────────────────
    {
      id: "unit-3",
      number: 3,
      title: "First Law of Motion",
      color: "#FF3D71",
      colorSoft: "rgba(255,61,113,0.12)",
      icon: "📐",
      videos: [
        { id: "3cvtVVrl5bk", title: "Galileo's Concept of Inertia — Arbor Scientific" },
        { id: "adLj6kygwds", title: "What Is Newton's First Law Of Motion? — Dr. Binocs Show" }
      ],
      sections: [
        {
          heading: "The First Law of Motion (Law of Inertia)",
          content: `<p>Often called the <b>Law of Inertia</b>, this unit introduces Galileo's key observations and Newton's formal statement.</p>
<h3>Galileo's Foundation</h3>
<p><a href="https://youtu.be/3cvtVVrl5bk?rel=0" style="color:#00d4ff; text-decoration:underline">Galileo's Concept of Inertia | Arbor Scientific</a></p>
<p>Before Newton, it was commonly thought that a constant force was required to keep an object moving. Galileo challenged this by using <b>inclined planes</b>:</p>
<ul class="rich-list">
	<li><b>The Experiment:</b> He observed that a marble rolling down one plane would climb up an opposing plane to almost the same height.</li>
	<li><b>The Deduction:</b> He reasoned that if the second plane were perfectly horizontal and frictionless, the marble would continue to move <b>forever</b> at a constant speed, as it would never reach its original height.</li>
	<li><b>The Conclusion:</b> No net force is needed to sustain uniform motion; a force is only needed to <i>change</i> that motion.</li>
</ul>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120848-27.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><i>(a) the downward motion; (b) the upward motion of a marble on an inclined plane; and (c) on a double inclined plane.</i></p>`
        },
        {
          heading: "Newton's Formalization",
          content: `<p>Newton refined these ideas into his <b>First Law of Motion</b>:</p>
<p><a href="https://youtu.be/adLj6kygwds?rel=0" style="color:#00d4ff; text-decoration:underline">What Is Newton's First Law Of Motion?</a></p>
<p><i>"An object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied force."</i></p>
<p>This means objects have a "built-in" resistance to any change in their motion. This qualitative property is called <b>Inertia</b>.</p>
<h3>Inertia in Daily Life</h3>
<p>We experience inertia every time we travel. Because our bodies have mass, they "want" to keep doing whatever they were already doing.</p>
<div class="table-wrapper">
<table class="Table">
	<tbody>
		<tr>
			<th>Scenario</th>
			<th>What Happens</th>
			<th>Why (The Physics)</th>
		</tr>
		<tr>
			<td><b>Sudden Braking</b></td>
			<td>You jerk <b>forward</b>.</td>
			<td>Your body was moving at the car's speed. When the car stops, your upper body tries to continue moving forward due to inertia.</td>
		</tr>
		<tr>
			<td><b>Sudden Start</b></td>
			<td>You jerk <b>backward</b>.</td>
			<td>Your feet move forward with the floor of the vehicle, but your upper body tends to remain at rest.</td>
		</tr>
		<tr>
			<td><b>Sharp Turns</b></td>
			<td>You lean to the <b>side</b>.</td>
			<td>Your body tries to continue traveling in a straight line while the car's frame forces a change in direction.</td>
		</tr>
	</tbody>
</table>
</div>
<h3>Key "Extra" Insights from the Text</h3>
<ul class="rich-list">
	<li><b>The Role of Friction:</b> In the real world, objects eventually stop because of <b>frictional forces</b> acting opposite to motion. To see "pure" inertia, we must minimize friction using lubricants or smooth surfaces.</li>
	<li><b>Safety Gear:</b> Safety belts are specifically designed to provide the <b>unbalanced force</b> needed to slow your body down safely, countering your inertia during a collision.</li>
	<li><b>Defining Inertia:</b> It is the tendency of "undisturbed" objects to stay exactly as they are—whether that is sitting still or gliding at 100 km/h.</li>
</ul>`
        },
        {
          heading: "Activities & Fun Facts",
          content: `<h3>Activity: Carom Coins</h3>
<p>Make a pile of similar carom coins on a table. Attempt a sharp horizontal hit at the bottom of the pile using another carom coin or the striker. If the hit is strong enough, the bottom coin moves out quickly. Once the lowest coin is removed, the inertia of the other coins makes them 'fall' vertically on the table.</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120848-28.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><i>Only the carom coin at the bottom of a pile is removed when a fast moving carom coin (or striker) hits it.</i></p>
<h3>Activity: Card & Coin</h3>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120848-29.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><b><i>When the card is flicked with the finger the coin placed over it falls in the tumbler.</i></b></p>
<ul class="rich-list">
<li>Set a five-rupee coin on a stiff card covering an empty glass tumbler standing on a table.</li>
<li>Give the card a sharp horizontal flick with a finger. If we do it fast then the card shoots away, allowing the coin to fall vertically into the glass tumbler due to its inertia.</li>
<li>The inertia of the coin tries to maintain its state.</li>
</ul>
<h3>Activity: Water Tray</h3>
<ul class="rich-list">
<li>Place a water-filled tumbler on a tray.</li>
<li>Hold the tray and turn around as fast as you can.</li>
<li>We observe that the water spills. Why?</li>
</ul>
<p><b>Fun Fact:</b> Observe that a groove is provided in a saucer for placing the tea cup. It prevents the cup from toppling over in case of sudden jerks.</p>`
        },
        {
          heading: "History Snapshot: Galileo Galilei",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307120848-30.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p>Galileo Galilei (1564-1642) was an Italian scientist whose studies of motion helped prepare the way for Newton's laws. By observing inclined planes and falling bodies, he argued that an object can keep moving unless a force such as friction changes its motion.</p>
<ul class="rich-list">
<li><b>Motion Studies:</b> He used inclined planes to understand acceleration and the motion of falling objects.</li>
<li><b>Scientific Contributions:</b> He also improved telescopes and made important observations of the Moon, Jupiter, Venus, and the Sun.</li>
<li><b>Why He Matters Here:</b> His ideas about inertia became the foundation for Newton's First Law of Motion.</li>
</ul><div style="clear:both;"></div>`
        }
      ]
    },

    // ── UNIT 4 ──────────────────────────────────────────
    {
      id: "unit-4",
      number: 4,
      title: "Inertia and Mass",
      color: "#A855F7",
      colorSoft: "rgba(168,85,247,0.12)",
      icon: "⚡",
      videos: [
        { id: "fJMVWzSl2_0", title: "Inertia | What is Inertia?" }
      ],
      sections: [
        {
          heading: "Defining Inertia",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121000-33.png" style="max-width:100%;height:auto;border:3px solid #e63946;margin:1rem auto;display:block;" /></p>
<p><a href="https://youtu.be/fJMVWzSl2_0?rel=0" style="color:#00d4ff; text-decoration:underline">Inertia | What is Inertia ?</a></p>
<ul class="rich-list">
	<li><b>The Concept:</b> All objects offer <b>resistance</b> to changing their state of motion. If an object is at rest, it tends to stay at rest; if it is moving, it tends to keep moving. This inherent property is called <b>Inertia</b>.</li>
	<li><b>Universal Property:</b> Every object has inertia, but the "strength" of that resistance varies from one object to another.</li>
</ul>`
        },
        {
          heading: "The Quantitative Measure: Mass",
          content: `<p>While inertia is the <i>tendency</i> to resist change, <b>mass</b> is the quantitative measure of that inertia.</p>
<ul class="rich-list">
	<li><b>Heavier (More Massive) Objects:</b> Offer larger inertia. They are much harder to start moving if at rest and harder to stop if in motion.</li>
	<li><b>Lighter Objects:</b> Offer less inertia and require less force to change their state.</li>
</ul>`
        },
        {
          heading: "Key Comparisons from the Text",
          content: `<p>The text uses several everyday examples to illustrate why mass and inertia are directly proportional:</p>
<div class="table-wrapper">
<table class="Table">
	<tbody>
		<tr>
			<th>Light Object (Low Inertia)</th>
			<th>Heavy Object (High Inertia)</th>
			<th>Observation</th>
		</tr>
		<tr>
			<td><b>Empty Box</b></td>
			<td><b>Box full of books</b></td>
			<td>It is much easier to push the empty box than the full one.</td>
		</tr>
		<tr>
			<td><b>Football</b></td>
			<td><b>Stone of same size</b></td>
			<td>Kicking a football makes it fly away; kicking the same-sized stone hardly moves it (and may cause injury).</td>
		</tr>
		<tr>
			<td><b>One-rupee coin</b></td>
			<td><b>Five-rupees coin</b></td>
			<td>A lesser force is required to move the lighter one-rupee coin.</td>
		</tr>
		<tr>
			<td><b>Small Cart</b></td>
			<td><b>Train</b></td>
			<td>A force that makes a cart move fast will produce almost no change in the motion of a train.</td>
		</tr>
	</tbody>
</table>
</div>
<h3>Summary Definition</h3>
<p><b>Inertia</b> is the natural tendency of an object to resist a change in its state of motion or of rest. The <b>mass</b> of an object is a measure of its inertia.</p>`
        },
        {
          heading: "Questions to Consider",
          content: `<ol class="rich-list">
	<li>Which of the following has more inertia:<br>
    (a) a rubber ball and a stone of the same size?<br>
    (b) a bicycle and a train?<br>
    (c) a five-rupees coin and a one-rupee coin?</li>
	<li>In the following example, try to identify the number of times the velocity of the ball changes: “A football player kicks a football to another player of his team who kicks the football towards the goal. The goalkeeper of the opposite team collects the football and kicks it towards a player of his own team”. Also identify the agent supplying the force in each case.</li>
	<li>Explain why some of the leaves may get detached from a tree if we vigorously shake its branch.</li>
	<li>Why do you fall in the forward direction when a moving bus brakes to a stop and fall backwards when it accelerates from rest?</li>
</ol>`
        }
      ]
    },

    // ── UNIT 5 ──────────────────────────────────────────
    {
      id: "unit-5",
      number: 5,
      title: "Second Law of Motion",
      color: "#10B981",
      colorSoft: "rgba(16,185,129,0.12)",
      icon: "📊",
      videos: [
        { id: "8o3j1wpabes", title: "What is Newton's 2nd Law? F = MA — Dr. Binocs" },
        { id: "-NJ_mvIvzx8", title: "Understanding Force & Motion — Physics Guide" }
      ],
      sections: [
        {
          heading: "Second Law of Motion",
          content: `<p><a href="https://youtu.be/8o3j1wpabes" style="color:#00d4ff; text-decoration:underline">What is Newton's 2nd Law Of Motion? | F = MA | Newton's Laws of Motion | Physics Laws | Dr. Binocs</a></p>
<p>This unit transitions from the concept of inertia to the actual measurement of force by introducing <b>Momentum</b> and the <b>Second Law of Motion</b>.</p>
<p>The "impact" an object makes depends on its mass and velocity combined. Newton defined this as <b>momentum</b>.</p>
<ul class="rich-list">
	<li><b>Definition:</b> The product of an object's mass (m) and its velocity (v).</li>
	<li><b>Formula:</b> p = mv</li>
	<li><b>Vector Nature:</b> Momentum has both magnitude and direction. Its direction is the same as the velocity.</li>
	<li><b>SI Unit:</b> kilogram-metre per second (<b>kg m s⁻¹</b>).</li>
</ul>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-34.png" style="max-width:100%;height:auto;border:3px solid #10B981;margin:1rem auto;display:block;" /></p>
<p><a href="https://youtu.be/-NJ_mvIvzx8?rel=0" style="color:#00d4ff; text-decoration:underline">Understanding Charging by Induction: A Physics Guide for Class 10 & 12 Students!</a></p>
<p>While the First Law explains that a force is needed to change motion, the Second Law defines exactly how that force works:</p>
<p><i>"The rate of change of momentum of an object is proportional to the applied unbalanced force in the direction of force."</i></p>`
        },
        {
          heading: "Observations & Insights",
          content: `<h3>1. The Factors of "Impact"</h3>
<p>The text provides everyday examples to show why mass and velocity are inseparable when discussing force:</p>
<ul class="rich-list">
	<li><b>Mass Impact:</b> A table tennis ball vs. a cricket ball. Even at similar speeds, the cricket ball hurts more due to its higher mass.</li>
	<li><b>Velocity Impact:</b> A parked truck is safe, but a truck moving at just <b>5 m s⁻¹</b> can be fatal. Similarly, a tiny bullet is only lethal because of its high velocity.</li>
</ul>
<h3>2. The Importance of Time</h3>
<p>A crucial addition to this law is the <b>time</b> over which a force is exerted.</p>
<ul class="rich-list">
	<li><b>The Car Example:</b> If a car has a dead battery, a "sudden push" by two people might not start it. However, a <b>continuous push</b> over time gradually accelerates the car to the required speed.</li>
	<li><b>Conclusion:</b> The force required depends on the <b>time rate</b> at which the momentum is changed.</li>
</ul>
<div class="table-wrapper">
<table class="Table">
	<tbody>
		<tr>
			<th>Concept</th>
			<th>Key Takeaway</th>
		</tr>
		<tr>
			<td><b>Momentum</b></td>
			<td>Higher mass or higher velocity results in higher momentum (p).</td>
		</tr>
		<tr>
			<td><b>Force & Velocity</b></td>
			<td>An unbalanced force produces a change in velocity, which in turn produces a change in momentum.</td>
		</tr>
		<tr>
			<td><b>The Second Law</b></td>
			<td>Force is not just about the change in momentum, but how <b>fast</b> that change happens.</td>
		</tr>
	</tbody>
</table>
</div>`
        },
        {
          heading: "Mathematical Formulation of the Second Law",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-35.png" style="max-width:100%;height:auto;border:3px solid #10B981;margin:1rem auto;display:block;" /></p>
<p><b>Figure:</b> A person pulls on a cart of mass <i>m</i> with force <i>F</i> and, as a result, the car accelerates in the direction of the pulling force. If twice the force is applied, the acceleration of the cart is multiplied by two. If the mass of the cart being pulled is multiplied by a factor of two, its acceleration is divided by a factor of two.</p>
<p>To measure force, we look at how much the <b>momentum</b> of an object of mass m changes over a specific time t.</p>
<h3>The Derivation</h3>
<ol class="rich-list">
	<li><b>Initial Momentum (p<sub>1</sub>):</b> mu (where u is initial velocity).</li>
	<li><b>Final Momentum (p<sub>2</sub>):</b> mv (where v is final velocity).</li>
	<li><b>Change in Momentum:</b> p<sub>2</sub> - p<sub>1</sub> = m(v - u)</li>
	<li><b>Rate of Change of Momentum:</b></li>
</ol>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-36.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /></p>
<p>According to the law, the applied force F is proportional to this rate:</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-37.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /></p>
<p>Since acceleration is,</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-38.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /></p>
<p>we can write: F = kma</p>
<p>By defining one unit of force as the amount that accelerates 1kg at 1m s<sup>-2</sup>, the constant k becomes 1. Thus:</p>
<p><b>F = ma</b></p>
<ul class="rich-list">
	<li><b>SI Unit of Force:</b> Newton (N) or kg m s<sup>-2</sup>.</li>
</ul>`
        },
        {
          heading: "Applications in Everyday Life",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-39.png" style="max-width:100%;height:auto;border:3px solid #10B981;margin:1rem auto;display:block;" /></p>
<p>The Second Law shows that force is inversely proportional to time.</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121353-40.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /></p>
<p>If you increase the time it takes to stop, the resulting force decreases.</p>
<h3>1. Catching a Cricket Ball</h3>
<p><img src="https://login.skillizee.io/s/articles/69b116c260e5aaf041d25863/images/ChatGPT Image Mar 11, 2026, 12_46_02 PM.png" style="max-width:100%;height:auto;border:3px solid #10B981;margin:1rem auto;display:block;" /></p>
<p>A fielder pulls their hands backward while catching a fast ball.</p>
<ul class="rich-list">
	<li><b>Reason:</b> This increases the <b>time (t)</b> taken to reduce the ball's velocity to zero.</li>
	<li>In doing so, the fielder increases the time during which the high velocity of the moving ball decreases to zero. Thus, the acceleration of the ball is decreased and therefore the impact of catching the fast moving ball is also reduced. If the ball is stopped suddenly then its high velocity decreases to zero in a very short interval of time. Thus, the rate of change of momentum of the ball will be large. Therefore, a large force would have to be applied for holding the catch that may hurt the palm of the fielder.</li>
	<li><b>Result:</b> The rate of change of momentum is lower, resulting in a smaller force on the fielder's palms.</li>
</ul><div style="clear:both;"></div>
<h3>2. High Jump Athletes</h3>
<p>Athletes land on cushioned beds or sand.</p>
<ul class="rich-list">
	<li><b>Reason:</b> The "give" in the cushion or sand increases the time of the fall after impact.</li>
	<li><b>Result:</b> This decreases the rate of change of momentum and prevents injury by reducing the impact force.</li>
</ul>
<h3>3. Karate Slab Breaking</h3>
<p>A karate player strikes a slab of ice with a very fast blow.</p>
<ul class="rich-list">
	<li><b>Reason:</b> The high velocity is reduced to zero in a <b>very short time interval</b>.</li>
	<li><b>Result:</b> This creates an enormous rate of change of momentum, exerting a massive force sufficient to break the slab.</li>
</ul>
<h3>Connecting the Laws</h3>
<p>The First Law is actually a special case of the Second Law (F = ma). If the force F = 0, then v = u.</p>
<ul class="rich-list">
	<li>If the object was at rest (u = 0), it stays at rest (v = 0).</li>
	<li>If the object was moving, it continues moving with the same velocity (v = u).</li>
</ul>`
        }
      ]
    },

    // ── UNIT 6 ──────────────────────────────────────────
    {
      id: "unit-6",
      number: 6,
      title: "Third Law of Motion",
      color: "#F97316",
      colorSoft: "rgba(249,115,22,0.12)",
      icon: "🔄",
      videos: [
        { id: "DjtWxj0sq3M", title: "Newton's 3rd Law — Action and Reaction Forces — Dr. Binocs" },
        { id: "TVAxASr0iUY", title: "Third Law of Motion — Forces and Motion — Infinity Learn" }
      ],
      sections: [
        {
          heading: "Third Law of Motion",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121507-47.png" style="max-width:100%;height:auto;border:3px solid #F97316;margin:1rem auto;display:block;" /></p>
<p><a href="https://youtu.be/DjtWxj0sq3M?rel=0" style="color:#00d4ff; text-decoration:underline">Newton's 3rd Law of Motion | Action and Reaction Forces with Examples | Physics Laws | Dr. Binocs</a></p>
<p>This unit explores the fundamental principle that forces never exist in isolation; they always occur as simultaneous pairs.</p>
<h3>The Law</h3>
<p>Newton’s Third Law states that when one object exerts a force on another object, the second object instantaneously exerts a force back on the first. These two forces are <b>equal in magnitude</b> but <b>opposite in direction</b>.</p>
<p><b>Simplified Statement:</b> To every action, there is an equal and opposite reaction.</p>
<p>Let us consider two spring balances connected together as shown in Fig. The fixed end of balance B is attached with a rigid support, like a wall. When a force is applied through the free end of spring balance A, it is observed that both the spring balances show the same readings on their scales. It means that the force exerted by spring balance A on balance B is equal but opposite in direction to the force exerted by the balance B on balance A. Any of these two forces can be called as action and the other as reaction. This gives us an alternative statement of the third law of motion i.e., to every action there is an equal and opposite reaction. However, it must be remembered that the action and reaction always act on two different objects, simultaneously.</p>
<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121507-48.png" style="max-width:100%;height:auto;border:3px solid #F97316;margin:1rem auto;display:block;" /></p>
<p><b><i>Action and reaction forces are equal and opposite.</i></b></p>`
        },
        {
          heading: "Key Characteristics",
          content: `<ul class="rich-list">
	<li><b>Action-Reaction Pairs:</b> There is no such thing as a single, isolated force. Forces always exist in pairs.</li>
	<li><b>Different Objects:</b> Action and reaction forces <b>never act on the same object</b>. They act on two different bodies, which is why they do not cancel each other out.</li>
	<li><b>Simultaneity:</b> These forces occur at the exact same time.</li>
	<li><b>Unequal Accelerations:</b> While the forces are equal, the resulting acceleration may not be. According to F = ma, an object with a much larger mass (like a gun) will accelerate much less than an object with a small mass (like a bullet), even though the force applied to both is identical.</li>
</ul>`
        },
        {
          heading: "Activity 4: Ramp Forces and Motion",
          type: "activity",
          content: `<p>Use this embedded Activity 4 to explore how gravity, friction, and applied force affect motion on a ramp. Try changing the ramp conditions and observe how the object responds.</p>
<div style="width: 100%; height: 500px; border: 3px solid #F97316; margin-top: 1rem;">
    <iframe src="https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=ramp-forces-and-motion" width="100%" height="100%" style="border: none;" allowfullscreen title="PhET Motion Series (Ramp Forces and Motion)"></iframe>
</div>`
        },
        {
          heading: "Practical Examples and Applications",
          content: `<p><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121507-49.png" style="max-width:100%;height:auto;border:3px solid #F97316;margin:1rem auto;display:block;" /></p>
<p>A classic example of Newton’s Third Law is the action of a rocket launching. As the rocket burns fuel, it expels exhaust gases downward (action), and in response, the rocket is propelled upwards (reaction). This demonstrates the principle of action and reaction forces working in tandem, a vivid illustration of the law in a real-world context.</p>
<h3>Practical examples</h3>
<p><a href="https://youtu.be/TVAxASr0iUY" style="color:#00d4ff; text-decoration:underline">Newton's Third Law of Motion | Forces and Motion | Physics | Infinity Learn</a></p>
<div class="table-wrapper">
<table class="Table">
	<tbody>
		<tr>
			<th>Example</th>
			<th>Action</th>
			<th>Reaction</th>
		</tr>
		<tr>
			<td><b>Walking</b></td>
			<td>Your feet push the road <b>downward and backward</b>.</td>
			<td>The road exerts an equal force <b>forward</b> on your feet, moving you ahead.</td>
		</tr>
		<tr>
			<td><b>Firing a Gun</b></td>
			<td>The gun exerts a <b>forward force</b> on the bullet.</td>
			<td>The bullet exerts an equal <b>backward force</b> on the gun (known as <b>recoil</b>).</td>
		</tr>
		<tr>
			<td colspan="3"><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121507-50.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /><br/><b><i>A forward force on the bullet and recoil of the gun.</i></b></td>
		</tr>
		<tr>
			<td><b>Spring Balances</b></td>
			<td>Spring A pulls on Spring B.</td>
			<td>Spring B pulls back on Spring A with the same scale reading.</td>
		</tr>
		<tr>
			<td><b>Rowing a Boat</b></td>
			<td>A sailor jumps <b>forward</b> out of the boat.</td>
			<td>The force of the jump pushes the boat <b>backwards</b>.</td>
		</tr>
		<tr>
			<td colspan="3"><img src="https://login.skillizee.io/s/articles/69abc6e6ac530fe5e902eca0/images/image-20260307121507-51.png" style="max-width:100%;height:auto;margin:1rem auto;display:block;" /><br/><b><i>As the sailor jumps in forward direction, the boat moves backwards.</i></b></td>
		</tr>
		<tr>
			<td><b>Sports Collisions</b></td>
			<td>A football player collides with an opponent.</td>
			<td>Both feel hurt because each applies an equal force to the other.</td>
		</tr>
	</tbody>
</table>
</div>`
        },
        {
          heading: "Activities & Observations",
          content: `<h3>Activity: The Two-Cart Throw</h3>
<ul class="rich-list">
	<li>Request two children to stand on two separate carts.</li>
	<li>Give them a bag full of sand or some other heavy object. Ask them to play a game of catch with the bag.</li>
	<li>Does each of them experience an instantaneous force as a result of throwing the sand bag?</li>
	<li>You can paint a white line on cartwheels to observe the motion of the two carts when the children throw the bag towards each other.</li>
</ul>
<h3>Experimental Observation: The Two-Cart Activity</h3>
<p>To see the relationship between force, mass, and acceleration (<i>F=ma</i>):</p>
<ul class="rich-list">
	<li>Place <b>two children</b> on one cart and <b>one child</b> on another.</li>
	<li>When a force is exchanged between them, the cart with the higher mass (two children) will show a <b>lower acceleration</b> than the cart with the lower mass, illustrating that equal forces affect different masses differently.</li>
</ul>`
        }
      ]
    }
  ],

  // ── SUMMARY ──────────────────────────────────────────
  summary: {
    heading: "What You Have Learnt",
    points: [
      "First law of motion: An object continues to be in a state of rest or of uniform motion along a straight line unless acted upon by an unbalanced force.",
      "The natural tendency of objects to resist a change in their state of rest or of uniform motion is called inertia.",
      "The mass of an object is a measure of its inertia. Its SI unit is kilogram (kg).",
      "Force of friction always opposes motion of objects.",
      "Second law of motion: The rate of change of momentum of an object is proportional to the applied unbalanced force in the direction of the force.",
      "The SI unit of force is kg·m·s⁻². This is also known as Newton (N). A force of one Newton produces an acceleration of 1 m·s⁻² on an object of mass 1 kg.",
      "The momentum of an object is the product of its mass and velocity and has the same direction as that of the velocity. Its SI unit is kg·m·s⁻¹.",
      "Third law of motion: To every action, there is an equal and opposite reaction and they act on two different bodies."
    ],
    questionnaire: {
      heading: "Revision MCQ Challenge",
      intro: "Use the tabs below to practice one multiple-choice question at a time.",
      tabs: [
        {
          id: "units-1-2",
          label: "Units 1-2",
          title: "Force and Balanced Forces",
          prompt: "Revise push, pull, friction, and net force with these quick MCQs.",
          questions: [
            {
              tag: "Define",
              question: "Which statement best defines force?",
              options: [
                "A force is only the speed of a moving object.",
                "A force is a push or pull that can change the state of motion of an object.",
                "A force is the mass present inside an object.",
                "A force is the time taken by an object to move."
              ],
              correctIndex: 1,
              explanation: "Force is described as a push or pull that can change an object's state of rest or motion."
            },
            {
              tag: "Effects",
              question: "Which of the following is NOT an effect of force?",
              options: [
                "Changing the speed of an object",
                "Changing the direction of motion",
                "Changing the shape or size of an object",
                "Changing the chemical formula of a substance"
              ],
              correctIndex: 3,
              explanation: "A force can change speed, direction, shape, or size, but it does not change a substance's chemical formula."
            },
            {
              tag: "Compare",
              question: "When balanced forces act on an object, the net force is:",
              options: [
                "Zero",
                "Always upward",
                "Equal to the larger force",
                "Always enough to produce acceleration"
              ],
              correctIndex: 0,
              explanation: "Balanced forces cancel each other, so the net force becomes zero."
            },
            {
              tag: "Reason",
              question: "A bicycle slows down after you stop pedalling mainly because of:",
              options: [
                "Inertia pushing it forward",
                "Balanced forces increasing speed",
                "Friction acting opposite to motion",
                "Mass becoming smaller"
              ],
              correctIndex: 2,
              explanation: "Friction opposes motion, so the bicycle slows once you stop applying force."
            }
          ]
        },
        {
          id: "units-3-4",
          label: "Units 3-4",
          title: "First Law, Inertia and Mass",
          prompt: "Focus on inertia, Galileo's idea, and the link between mass and resistance to change.",
          questions: [
            {
              tag: "Law",
              question: "Newton's First Law says that an object will remain at rest or in uniform straight-line motion unless:",
              options: [
                "its colour changes",
                "an unbalanced force acts on it",
                "its shape becomes round",
                "it is always touching the ground"
              ],
              correctIndex: 1,
              explanation: "The First Law states that only an unbalanced external force can change the state of rest or uniform motion."
            },
            {
              tag: "Galileo",
              question: "What did Galileo conclude from the inclined plane experiment?",
              options: [
                "Moving objects always need a constant force to keep moving.",
                "Heavier bodies never move on smooth surfaces.",
                "If friction were absent, an object could keep moving for a very long time.",
                "Only round objects can show inertia."
              ],
              correctIndex: 2,
              explanation: "Galileo reasoned that without friction, a moving body would continue in motion."
            },
            {
              tag: "Inertia",
              question: "Passengers in a bus jerk forward when the bus stops suddenly because of:",
              options: [
                "friction in the road",
                "their inertia of motion",
                "balanced forces in the bus",
                "the engine pushing them ahead"
              ],
              correctIndex: 1,
              explanation: "Their bodies tend to keep moving forward due to inertia of motion."
            },
            {
              tag: "Mass",
              question: "Which statement about mass and inertia is correct?",
              options: [
                "Mass and inertia are unrelated.",
                "An object with more mass has less inertia.",
                "Mass is a measure of inertia.",
                "Only moving objects have inertia."
              ],
              correctIndex: 2,
              explanation: "Mass measures how strongly an object resists changes in its state of motion."
            }
          ]
        },
        {
          id: "units-5-6",
          label: "Units 5-6",
          title: "Second Law and Third Law",
          prompt: "Connect momentum, force, and action-reaction pairs with these MCQs.",
          questions: [
            {
              tag: "Momentum",
              question: "The momentum of an object is given by:",
              options: [
                "p = m / v",
                "p = mv",
                "p = ma",
                "p = F / a"
              ],
              correctIndex: 1,
              explanation: "Momentum equals mass multiplied by velocity."
            },
            {
              tag: "Second Law",
              question: "According to Newton's Second Law, if the same force acts on two objects, the object with smaller mass will have:",
              options: [
                "smaller acceleration",
                "the same acceleration",
                "greater acceleration",
                "zero acceleration"
              ],
              correctIndex: 2,
              explanation: "From F = ma, acceleration is inversely proportional to mass for the same force."
            },
            {
              tag: "Application",
              question: "A fielder pulls their hands backward while catching a ball to:",
              options: [
                "increase the force on the hands",
                "decrease the time of impact",
                "increase the time of impact and reduce the force",
                "stop the ball from having momentum"
              ],
              correctIndex: 2,
              explanation: "Increasing the stopping time decreases the rate of change of momentum, which reduces the force."
            },
            {
              tag: "Third Law",
              question: "Why do action and reaction forces not cancel each other?",
              options: [
                "Because they act on different objects",
                "Because one is always bigger than the other",
                "Because one acts only after a delay",
                "Because they act in the same direction"
              ],
              correctIndex: 0,
              explanation: "Action and reaction are equal and opposite, but they act on two different bodies."
            }
          ]
        }
      ]
    }
  }
};

export default courseData;
