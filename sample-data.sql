-- Sample Data for SkillMatch Database
-- Run this in your Supabase SQL Editor

-- Temporarily disable RLS for data insertion
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- Insert sample companies
INSERT INTO companies (name, description, industry, size, founded, headquarters, website, logo_url) VALUES
('TechCorp Solutions', 'Leading technology solutions provider specializing in cloud infrastructure and AI.', 'Technology', '100-500', 2018, 'San Francisco, CA', 'https://techcorp.example.com', 'https://via.placeholder.com/100x100/0066cc/ffffff?text=TC'),
('Green Energy Systems', 'Renewable energy company focused on sustainable solutions.', 'Energy', '50-100', 2020, 'Austin, TX', 'https://greenenergy.example.com', 'https://via.placeholder.com/100x100/009900/ffffff?text=GE'),
('Digital Marketing Hub', 'Full-service digital marketing agency helping businesses grow online.', 'Marketing', '20-50', 2019, 'New York, NY', 'https://digitalmarketing.example.com', 'https://via.placeholder.com/100x100/ff6600/ffffff?text=DM'),
('FinanceFirst Bank', 'Modern banking solutions with cutting-edge fintech innovations.', 'Finance', '500-1000', 2015, 'Chicago, IL', 'https://financefirst.example.com', 'https://via.placeholder.com/100x100/cc0066/ffffff?text=FF'),
('HealthTech Innovations', 'Digital healthcare solutions improving patient care.', 'Healthcare', '200-500', 2017, 'Boston, MA', 'https://healthtech.example.com', 'https://via.placeholder.com/100x100/cc3399/ffffff?text=HT'),
('EduLearn Platform', 'Online education platform revolutionizing learning.', 'Education', '100-200', 2019, 'Seattle, WA', 'https://edulearn.example.com', 'https://via.placeholder.com/100x100/3366cc/ffffff?text=EL');

-- Insert sample jobs
INSERT INTO jobs (title, description, company_id, location, job_type, experience_level, salary_min, salary_max, is_remote, responsibilities, requirements, benefits, status) VALUES
('Senior Frontend Developer', 
 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
 (SELECT id FROM companies WHERE name = 'TechCorp Solutions'),
 'San Francisco, CA', 'full-time', 'senior', 120000, 160000, true,
 ARRAY['Develop and maintain web applications using React and TypeScript', 'Collaborate with designers to implement pixel-perfect UIs', 'Optimize applications for maximum speed and scalability', 'Write clean, maintainable, and well-documented code'],
 ARRAY['5+ years of experience with React and JavaScript', 'Strong knowledge of TypeScript', 'Experience with modern CSS frameworks', 'Familiarity with Git and agile development'],
 ARRAY['Competitive salary and equity', 'Health, dental, and vision insurance', 'Flexible work schedule', '401(k) with company matching'],
 'active'),

('Product Manager',
 'Join our product team to drive the development of innovative energy solutions. Lead cross-functional teams and define product strategy.',
 (SELECT id FROM companies WHERE name = 'Green Energy Systems'),
 'Austin, TX', 'full-time', 'mid', 100000, 130000, false,
 ARRAY['Define and execute product roadmap', 'Work closely with engineering and design teams', 'Conduct market research and user interviews', 'Analyze product metrics and user feedback'],
 ARRAY['3+ years of product management experience', 'Experience with agile development methodologies', 'Strong analytical and communication skills', 'Bachelor''s degree in business or related field'],
 ARRAY['Stock options', 'Comprehensive health benefits', 'Professional development budget', 'Remote work flexibility'],
 'active'),

('Digital Marketing Specialist',
 'Drive growth through creative digital marketing campaigns. Manage social media, content creation, and paid advertising.',
 (SELECT id FROM companies WHERE name = 'Digital Marketing Hub'),
 'New York, NY', 'full-time', 'entry', 50000, 70000, true,
 ARRAY['Create and execute digital marketing campaigns', 'Manage social media accounts and content', 'Analyze campaign performance and ROI', 'Collaborate with creative team on content'],
 ARRAY['1-3 years of digital marketing experience', 'Knowledge of Google Ads and Facebook Ads', 'Strong writing and communication skills', 'Experience with analytics tools'],
 ARRAY['Growth opportunities', 'Creative work environment', 'Flexible schedule', 'Health insurance'],
 'active'),

('Backend Engineer',
 'Build and maintain scalable backend systems. Work with microservices, databases, and cloud infrastructure.',
 (SELECT id FROM companies WHERE name = 'FinanceFirst Bank'),
 'Chicago, IL', 'full-time', 'mid', 110000, 140000, true,
 ARRAY['Design and implement RESTful APIs', 'Optimize database queries and performance', 'Deploy and maintain cloud infrastructure', 'Write comprehensive tests and documentation'],
 ARRAY['3+ years of backend development experience', 'Proficiency in Python, Node.js, or Go', 'Experience with PostgreSQL and Redis', 'Knowledge of AWS or similar cloud platforms'],
 ARRAY['Competitive compensation', 'Learning and development budget', 'Flexible PTO policy', 'Top-tier equipment'],
 'active'),

('UX Designer',
 'Create intuitive and beautiful user experiences. Work closely with product and engineering teams to design user-centered solutions.',
 (SELECT id FROM companies WHERE name = 'TechCorp Solutions'),
 'San Francisco, CA', 'full-time', 'mid', 90000, 120000, true,
 ARRAY['Conduct user research and usability testing', 'Create wireframes, prototypes, and design systems', 'Collaborate with product managers and developers', 'Present design concepts to stakeholders'],
 ARRAY['3+ years of UX design experience', 'Proficiency in Figma and design tools', 'Strong portfolio showcasing design process', 'Understanding of frontend development'],
 ARRAY['Design tool stipend', 'Conference attendance budget', 'Flexible working hours', 'Stock options'],
 'active'),

('Data Scientist',
 'Analyze complex datasets to drive business insights. Build machine learning models and create data visualizations.',
 (SELECT id FROM companies WHERE name = 'Green Energy Systems'),
 'Austin, TX', 'full-time', 'senior', 130000, 170000, false,
 ARRAY['Develop predictive models and algorithms', 'Analyze large datasets to identify trends', 'Create dashboards and visualizations', 'Present findings to executive team'],
 ARRAY['5+ years of data science experience', 'PhD or Master''s in Statistics, Math, or related field', 'Proficiency in Python and R', 'Experience with machine learning frameworks'],
 ARRAY['Research budget', 'Conference presentations', 'Flexible schedule', 'Top-tier benefits package'],
 'active'),

('Healthcare Software Engineer',
 'Develop secure, HIPAA-compliant healthcare applications. Work on patient management systems and medical data analytics.',
 (SELECT id FROM companies WHERE name = 'HealthTech Innovations'),
 'Boston, MA', 'full-time', 'mid', 105000, 135000, true,
 ARRAY['Build healthcare management software', 'Ensure HIPAA compliance and security', 'Integrate with medical device APIs', 'Collaborate with healthcare professionals'],
 ARRAY['3+ years of software development experience', 'Knowledge of healthcare regulations', 'Experience with secure coding practices', 'Familiarity with medical systems'],
 ARRAY['Health and wellness benefits', 'Impact-driven work', 'Professional development', 'Equity participation'],
 'active'),

('Curriculum Developer',
 'Design engaging online courses and educational content. Work with subject matter experts to create world-class learning experiences.',
 (SELECT id FROM companies WHERE name = 'EduLearn Platform'),
 'Seattle, WA', 'full-time', 'mid', 75000, 95000, true,
 ARRAY['Develop course curricula and learning objectives', 'Create interactive educational content', 'Collaborate with instructors and designers', 'Analyze learning outcomes and student feedback'],
 ARRAY['3+ years of curriculum development experience', 'Background in instructional design', 'Experience with e-learning platforms', 'Strong writing and communication skills'],
 ARRAY['Education reimbursement', 'Creative work environment', 'Flexible remote work', 'Professional development budget'],
 'active'),

('DevOps Engineer',
 'Manage cloud infrastructure and deployment pipelines. Ensure high availability and security of our platforms.',
 (SELECT id FROM companies WHERE name = 'FinanceFirst Bank'),
 'Chicago, IL', 'full-time', 'senior', 125000, 155000, false,
 ARRAY['Design and maintain CI/CD pipelines', 'Manage AWS/Azure cloud infrastructure', 'Monitor system performance and security', 'Automate deployment and scaling processes'],
 ARRAY['5+ years of DevOps experience', 'Expertise in containerization (Docker, Kubernetes)', 'Experience with infrastructure as code', 'Strong security and compliance knowledge'],
 ARRAY['Stock options', 'Premium health benefits', 'Technical conference budget', 'Cutting-edge technology stack'],
 'active'),

('Junior Web Developer',
 'Start your career building modern web applications. Learn from senior developers while contributing to real projects.',
 (SELECT id FROM companies WHERE name = 'Digital Marketing Hub'),
 'New York, NY', 'full-time', 'entry', 60000, 75000, true,
 ARRAY['Build responsive web applications', 'Learn modern development frameworks', 'Write clean, well-documented code', 'Participate in code reviews and team meetings'],
 ARRAY['Computer Science degree or equivalent experience', 'Basic knowledge of HTML, CSS, JavaScript', 'Familiarity with React or similar frameworks', 'Passion for learning and growth'],
 ARRAY['Mentorship program', 'Learning and development budget', 'Modern tech stack', 'Career growth opportunities'],
 'active');

-- Create skill associations for jobs
INSERT INTO job_skills (job_id, skill_id, is_required) 
SELECT j.id, s.id, true
FROM jobs j, skills s
WHERE (j.title = 'Senior Frontend Developer' AND s.name IN ('React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'))
   OR (j.title = 'Backend Engineer' AND s.name IN ('Node.js', 'Python', 'SQL', 'PostgreSQL', 'REST API'))
   OR (j.title = 'UX Designer' AND s.name IN ('UI/UX Design', 'Figma'))
   OR (j.title = 'Data Scientist' AND s.name IN ('Python', 'Machine Learning', 'Data Analysis'))
   OR (j.title = 'DevOps Engineer' AND s.name IN ('AWS', 'Docker', 'Kubernetes'))
   OR (j.title = 'Junior Web Developer' AND s.name IN ('JavaScript', 'React', 'HTML', 'CSS'));

-- Re-enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Verify data was inserted
SELECT 'Companies created:' as info, count(*) as count FROM companies
UNION ALL
SELECT 'Jobs created:', count(*) FROM jobs
UNION ALL
SELECT 'Skills available:', count(*) FROM skills;