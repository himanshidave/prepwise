-- Seed data for PrepWise
-- Demo passwords: demo@prepwise.com / demo123, student@prepwise.com / 123456

INSERT INTO users (name, email, password_hash)
VALUES
    ('Demo User',    'demo@prepwise.com',    '$2a$10$j7.cRvCzePSHGI0e3yxNaebAT4pNfnuhW6gG6t1HhWMz.VUiCLqHu'),
    ('Student User', 'student@prepwise.com', '$2a$10$WTcy7eTxHKJ6TeGMCwfr2uPZWjIu3L0Gwk2QzzKXTvDPpbizKbJAW')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug, description, icon)
VALUES
    ('HTML',         'html',       'Structure and markup of the web',    'html5'),
    ('CSS',          'css',        'Styling and layout',                 'css3'),
    ('JavaScript',   'javascript', 'Core language & DOM',                'js'),
    ('React',        'react',      'Components, hooks and state',        'react'),
    ('DSA',          'dsa',        'Data structures and algorithms',     'dsa'),
    ('HR Questions', 'hr',         'Behavioural & interview soft-skills','hr')
ON CONFLICT (slug) DO NOTHING;

-- Questions carry both the written answer (Q&A reveal page) and MCQ options
-- (mock interview). correct_option is the zero-based index into options.
-- Dollar-quoting ($$...$$) avoids escaping the apostrophes/quotes in the text.
INSERT INTO questions (category_id, question, answer, options, correct_option, difficulty)
SELECT c.id, q.question, q.answer, q.options, q.correct_option, q.difficulty
FROM (VALUES
    ('html',
     $$What is the difference between block-level and inline elements in HTML?$$,
     $$Block-level elements (like <div>, <p>, <h1>) start on a new line and stretch to the full width of the container. Inline elements (like <span>, <a>, <strong>) do not start on a new line and only take up as much width as their content.$$,
     jsonb_build_array(
       $$Block elements always start on a new line and take full width; inline elements do not start on a new line and take up only content width.$$,
       $$Inline elements start on a new line; block elements do not.$$,
       $$Block elements can only contain text; inline elements can contain anything.$$,
       $$There is no difference between block and inline elements in HTML5.$$),
     0, 'easy'),

    ('html',
     $$What are semantic HTML tags and why are they used?$$,
     $$Semantic tags (like <header>, <nav>, <article>, <footer>) clearly describe their meaning to both the browser and the developer. They are used to improve website accessibility (for screen readers), help search engines crawl the site (SEO), and make the code cleaner and easier to maintain.$$,
     jsonb_build_array(
       $$Tags that have no meaning like <div> and <span>.$$,
       $$Tags that look fancy in modern browsers.$$,
       $$Tags that clearly describe their purpose and meaning (e.g., <header>, <article>) to improve accessibility and SEO.$$,
       $$Tags that are written in JavaScript instead of HTML.$$),
     2, 'easy'),

    ('html',
     $$What is the purpose of the 'alt' attribute on an <img> tag?$$,
     $$The 'alt' attribute provides alternative text for an image if it cannot be displayed (due to slow internet, broken URL, etc.). It is also critical for accessibility, as screen readers read the alt text aloud to visually impaired users.$$,
     jsonb_build_array(
       $$To set the alignment of the image.$$,
       $$To provide description text for screen readers and as a fallback if the image fails to load.$$,
       $$To load a high-definition version of the image.$$,
       $$To link the image to another website.$$),
     1, 'easy'),

    ('css',
     $$What is the CSS Box Model?$$,
     $$The CSS Box Model is a box that wraps around every HTML element. It consists of four parts, from inside to outside: Content (the text or image), Padding (space around content, inside border), Border (line around padding), and Margin (space outside border to separate elements).$$,
     jsonb_build_array(
       $$A layout technique used to create grids.$$,
       $$The four layers of every element: content, padding, border, and margin.$$,
       $$A way to define the shape of HTML elements as circles.$$,
       $$A modern version of CSS variables.$$),
     1, 'easy'),

    ('css',
     $$What is the difference between Flexbox and CSS Grid?$$,
     $$Flexbox is one-dimensional, designed for laying out items in a single row or column. CSS Grid is two-dimensional, designed for complex layouts with both rows and columns at the same time.$$,
     jsonb_build_array(
       $$Flexbox is 2D and CSS Grid is 1D.$$,
       $$Flexbox is only used for text; Grid is only used for images.$$,
       $$Flexbox is 1D (rows OR columns) and CSS Grid is 2D (rows AND columns).$$,
       $$Flexbox is older and not used in modern web design.$$),
     2, 'medium'),

    ('css',
     $$How do you make a website responsive in CSS?$$,
     $$You make a website responsive by using: (1) Media queries (@media) to apply styles based on screen width, (2) Relative units (like rem, em, %, vw, vh) instead of fixed pixels, and (3) Flexible layout tools like Flexbox and CSS Grid.$$,
     jsonb_build_array(
       $$By using absolute positioning for all elements.$$,
       $$By setting fixed widths in pixels (e.g., width: 1000px).$$,
       $$By using media queries, relative units (%, rem, vw), and flexible layouts like Flexbox/Grid.$$,
       $$By using the <responsive> tag in HTML.$$),
     2, 'medium'),

    ('javascript',
     $$What is the difference between 'let', 'const', and 'var'?$$,
     $$'var' is function-scoped and can be redeclared and reassigned. 'let' is block-scoped, can be reassigned but not redeclared. 'const' is block-scoped, cannot be reassigned or redeclared.$$,
     jsonb_build_array(
       $$'var' is block-scoped; 'let' and 'const' are function-scoped.$$,
       $$'var' is function-scoped; 'let' is block-scoped (reassignable); 'const' is block-scoped (constant/non-reassignable).$$,
       $$'const' can be reassigned at any time; 'let' cannot.$$,
       $$There is no difference; they are completely identical.$$),
     1, 'easy'),

    ('javascript',
     $$What is a Promise and why do we use async/await?$$,
     $$A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value. 'async/await' is syntactic sugar built on top of Promises, allowing us to write asynchronous code that looks and behaves like synchronous code, making it cleaner and easier to read.$$,
     jsonb_build_array(
       $$A Promise is a guarantee that code has no bugs, and async/await is used to run code faster.$$,
       $$A Promise is a placeholder for a future value, and async/await makes handling these asynchronous operations look synchronous and clean.$$,
       $$A Promise is a special loop, and async/await is a way to declare functions.$$,
       $$Promises are only used for security and encryption.$$),
     1, 'medium'),

    ('javascript',
     $$What is the difference between '==' and '===' operators?$$,
     $$'==' (loose equality) compares two values for equality after converting both values to a common type (coercion). '===' (strict equality) compares both the value and the type, returning true only if they are identical.$$,
     jsonb_build_array(
       $$'==' compares value and type; '===' compares value only.$$,
       $$'==' is used for assignment; '===' is used for comparison.$$,
       $$'==' compares value only (with type coercion); '===' compares both value and type strictly.$$,
       $$They do the exact same thing in all situations.$$),
     2, 'easy'),

    ('react',
     $$What are React Props and State?$$,
     $$Props are short for properties. They are read-only data passed down from a parent component to a child component to customize it. State is local, private data managed inside a component itself. When state changes, the component re-renders to reflect the new data.$$,
     jsonb_build_array(
       $$Props are local to a component; State is passed from parent to child.$$,
       $$Props are read-only data passed from parent to child; State is internal component data that triggers re-renders when modified.$$,
       $$Props and State are exactly the same thing.$$,
       $$Props are used for styling; State is used for routing.$$),
     1, 'medium'),

    ('react',
     $$What is the purpose of the 'useEffect' Hook?$$,
     $$The 'useEffect' hook is used to perform side effects in functional components. Examples of side effects include fetching data from an API, setting up subscriptions, and manually changing the DOM.$$,
     jsonb_build_array(
       $$To style components dynamically.$$,
       $$To handle form submission events.$$,
       $$To perform side effects in functional components, such as API fetching or subscribing to events.$$,
       $$To define state variables in a component.$$),
     2, 'medium'),

    ('react',
     $$Why do we need to pass a 'key' prop to list items in React?$$,
     $$React uses the 'key' prop to identify which items in a list have changed, been added, or been removed. This helps React optimize rendering performance by only updating the modified list elements instead of re-rendering the entire list.$$,
     jsonb_build_array(
       $$To apply CSS styles to the items.$$,
       $$To help React identify which items have changed, been added, or removed for efficient DOM updates.$$,
       $$To encrypt the data in the list items.$$,
       $$To make the list items clickable.$$),
     1, 'medium'),

    ('dsa',
     $$What is the difference between an Array and a Linked List?$$,
     $$An Array stores elements in contiguous memory locations, allowing fast index-based access (O(1)) but expensive insertion/deletion (O(n)). A Linked List stores elements as nodes containing data and references to the next node, offering slow access (O(n)) but fast insertion/deletion (O(1)).$$,
     jsonb_build_array(
       $$Arrays are slow to access; Linked Lists are fast.$$,
       $$Arrays store elements in contiguous memory (fast random access); Linked Lists store nodes linked by pointers (fast insertions/deletions).$$,
       $$Arrays can only store numbers; Linked Lists can store anything.$$,
       $$Arrays are dynamic in size; Linked Lists are static in size.$$),
     1, 'medium'),

    ('dsa',
     $$What is the Time Complexity of Binary Search and Linear Search?$$,
     $$Binary Search has a time complexity of O(log n) because it halves the search space in each step, but it requires the array to be sorted. Linear Search has a time complexity of O(n) because it checks elements one by one, working on both sorted and unsorted arrays.$$,
     jsonb_build_array(
       $$Linear Search is O(log n); Binary Search is O(n).$$,
       $$Both searches have a time complexity of O(1).$$,
       $$Binary Search is O(log n) (requires sorted array); Linear Search is O(n) (checks every element).$$,
       $$Binary Search is O(n^2); Linear Search is O(log n).$$),
     2, 'medium'),

    ('dsa',
     $$What is a Stack and a Queue, and what are their behaviors?$$,
     $$A Stack follows the Last-In-First-Out (LIFO) behavior, where the last item added is the first one removed (like a stack of plates). A Queue follows the First-In-First-Out (FIFO) behavior, where the first item added is the first one removed (like a line of people).$$,
     jsonb_build_array(
       $$Stack is FIFO; Queue is LIFO.$$,
       $$Stack is LIFO (Last-In-First-Out); Queue is FIFO (First-In-First-Out).$$,
       $$Both follow LIFO behavior.$$,
       $$Both follow FIFO behavior.$$),
     1, 'easy'),

    ('hr',
     $$How should you answer: 'Tell me about yourself'?$$,
     $$Use the Present-Past-Future formula: (1) Present: talk about your current role/studies and recent achievements, (2) Past: mention relevant experiences or projects that prepared you, and (3) Future: explain why you are excited about this specific opportunity.$$,
     jsonb_build_array(
       $$Talk about your hobbies, family background, and personal life in detail.$$,
       $$Explain your entire resume line by line starting from kindergarten.$$,
       $$Use the Present-Past-Future formula focusing on achievements, relevant projects, and interest in this role.$$,
       $$Just state your name and wait for the next question.$$),
     2, 'easy'),

    ('hr',
     $$How do you handle conflict or working in a team?$$,
     $$Use the STAR method (Situation, Task, Action, Result) to describe a real situation. Focus on active listening, keeping communication professional and respectful, finding common ground, and focusing on the shared goal rather than personal differences.$$,
     jsonb_build_array(
       $$Explain that you never have conflicts because you are always right.$$,
       $$Describe a conflict situation using the STAR method, highlighting active listening, logical compromise, and a positive team outcome.$$,
       $$Blame the other person for the conflict to show you are innocent.$$,
       $$Say you prefer to work alone to avoid conflicts altogether.$$),
     1, 'easy'),

    ('hr',
     $$What are your strengths and weaknesses?$$,
     $$For strengths, choose a professional quality relevant to the job (e.g., problem-solving) and back it with an example. For weaknesses, pick a real but minor work-related weakness and immediately explain the concrete steps you are taking to improve it.$$,
     jsonb_build_array(
       $$Say you have no weaknesses and your strength is perfectionism.$$,
       $$Share a personal weakness (e.g., waking up late) and state no strengths.$$,
       $$Choose a job-relevant strength with an example, and share a professional weakness that you are actively improving.$$,
       $$Refuse to answer because it is a trick question.$$),
     2, 'easy')
) AS q(cat_slug, question, answer, options, correct_option, difficulty)
JOIN categories c ON c.slug = q.cat_slug;
