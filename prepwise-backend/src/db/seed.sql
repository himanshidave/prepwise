-- Seed data for PrepWise
-- Demo passwords: demo@prepwise.com / demo123, student@prepwise.com / 123456

INSERT INTO users (name, email, password_hash)
VALUES
    ('Demo User',    'demo@prepwise.com',    '$2a$10$j7.cRvCzePSHGI0e3yxNaebAT4pNfnuhW6gG6t1HhWMz.VUiCLqHu'),
    ('Student User', 'student@prepwise.com', '$2a$10$WTcy7eTxHKJ6TeGMCwfr2uPZWjIu3L0Gwk2QzzKXTvDPpbizKbJAW')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug, description, icon)
VALUES
    ('HTML',       'html',       'Structure and markup of the web', 'html5'),
    ('CSS',        'css',        'Styling and layout',              'css3'),
    ('JavaScript', 'javascript', 'Core language & DOM',              'js'),
    ('React',      'react',      'Components, hooks and state',      'react'),
    ('Node.js',    'nodejs',     'Server-side JavaScript',           'nodejs'),
    ('SQL',        'sql',        'Databases and queries',            'database')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, question, answer, difficulty)
SELECT c.id, q.question, q.answer, q.difficulty
FROM (VALUES
    ('html', 'What does HTML stand for?', 'HyperText Markup Language', 'easy'),
    ('html', 'What is the purpose of the <head> tag?', 'It contains meta-information about the document such as title, links to stylesheets, and scripts, not shown directly in the page body.', 'easy'),
    ('html', 'What is semantic HTML and why does it matter?', 'HTML that uses tags reflecting the meaning of the content (e.g. <article>, <nav>), which improves accessibility and SEO.', 'medium'),
    ('css', 'What is the CSS box model?', 'A model describing content, padding, border, and margin that make up an element''s rendered size.', 'easy'),
    ('css', 'What is the difference between "position: relative" and "position: absolute"?', 'Relative positions an element relative to its normal position; absolute positions it relative to its nearest positioned ancestor.', 'medium'),
    ('css', 'What is Flexbox used for?', 'A one-dimensional layout method for arranging items in rows or columns with flexible sizing and alignment.', 'easy'),
    ('javascript', 'What is the difference between let, const, and var?', 'var is function-scoped and hoisted; let and const are block-scoped, with const disallowing reassignment.', 'easy'),
    ('javascript', 'What is a closure?', 'A function that retains access to variables from its enclosing scope even after that scope has finished executing.', 'medium'),
    ('javascript', 'What is the event loop?', 'The mechanism that lets JavaScript perform non-blocking operations by offloading tasks and processing the callback/microtask queues after the call stack is empty.', 'hard'),
    ('react', 'What is the useState hook used for?', 'It lets a functional component hold and update local state between renders.', 'easy'),
    ('react', 'What is the virtual DOM?', 'An in-memory representation of the real DOM that React uses to compute the minimal set of changes needed before updating the actual DOM.', 'medium'),
    ('react', 'When would you use useEffect?', 'To perform side effects such as data fetching, subscriptions, or manually changing the DOM after render.', 'medium'),
    ('nodejs', 'What is Node.js?', 'A JavaScript runtime built on Chrome''s V8 engine that lets JavaScript run outside the browser, commonly for servers.', 'easy'),
    ('nodejs', 'What is middleware in Express?', 'A function that has access to the request, response, and next function, used to run code, modify req/res, or end the request-response cycle.', 'medium'),
    ('sql', 'What is a primary key?', 'A column (or set of columns) that uniquely identifies each row in a table.', 'easy'),
    ('sql', 'What is the difference between INNER JOIN and LEFT JOIN?', 'INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matches from the right, with NULLs where there is no match.', 'medium')
) AS q(cat_slug, question, answer, difficulty)
JOIN categories c ON c.slug = q.cat_slug;
