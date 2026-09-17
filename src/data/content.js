import {
  SiMysql,
  SiLaravel,
  SiFigma,
  SiPython,
  SiScikitlearn,
  SiOpencv,
  SiGit,
  SiGithub,
  SiJavascript,
  SiInstagram,
  SiGmail,
} from 'react-icons/si';
import { FaJava, FaLinkedin, FaRegFilePdf } from 'react-icons/fa6';

/* -----------------------------------------------------------------------------
 * PROFILE  [EDIT]
 * -------------------------------------------------------------------------- */
export const profile = {
  name: 'Darren Vincent',
  /* Hero: small intro, name, then the main statement (split per line). */
  heroIntro: 'Hello, I am',
  heroStatement: ['Building interfaces', 'that feel', 'like outer space.'],
  /* Robot mascot quote, shown beside the robot on hover or tap. */
  robotQuote: 'Every idea is a world waiting to be explored.',
  aboutParagraphs: [
    "Hi, I'm Darren Vincent, a Computer Science student at Bina Nusantara University with a growing interest in Artificial Intelligence, software development, and technology-driven solutions.",
    "I enjoy exploring how technology can turn ideas into something practical, whether through web development, machine learning, databases, or digital products. I'm always looking for opportunities to learn, experiment, and build things that solve real problems.",
    "Beyond technology, I'm also a Co-Founder of IMAJINA, where I work across business development, partnerships, event planning, and operations. These experiences have taught me how to combine technical thinking with communication, teamwork, and execution.",
  ],
  focus: [
    {
      title: 'Web Development',
      description: 'JavaScript, PHP, Laravel',
    },
    {
      title: 'Artificial Intelligence',
      description: 'Exploring ML, NLP, and Computer Vision.',
    },
    {
      title: 'Project Leadership',
      description: 'Bringing ideas to life.',
    },
  ],
  stats: [
    { value: '9', label: 'Core skills' },
    { value: '6+', label: 'Projects completed' },
    { value: '3', label: 'Areas of focus' },
  ],
};

/* -----------------------------------------------------------------------------
 * NAVIGATION
 * -------------------------------------------------------------------------- */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/* -----------------------------------------------------------------------------
 * SOCIAL LINKS  [EDIT]
 * -------------------------------------------------------------------------- */
export const socials = [
  {
    label: 'GitHub',
    handle: '@Maesticc',
    url: 'https://github.com/Maesticc',
    Icon: SiGithub,
  },
  {
    label: 'LinkedIn',
    handle: 'Darren Vincent',
    url: 'https://www.linkedin.com/in/darren-vincent-a22549326/',
    Icon: FaLinkedin,
  },
  {
    label: 'Instagram',
    handle: '@darren.vincent_',
    url: 'https://www.instagram.com/darren.vincent_/',
    Icon: SiInstagram,
  },
  {
    label: 'Curriculum Vitae',
    handle: 'View my CV',
    /* Taruh file CV di public/cv.pdf (atau ganti url ini ke tautan Google
       Drive/Dropbox milikmu). Dibuka di tab baru. */
    url: '/cv.pdf',
    Icon: FaRegFilePdf,
  },
];

export const skills = [
//Row 1 : Languages & core web
  {
    id: 'javascript',
    name: 'JavaScript',
    key: 'J',
    row: 0,
    category: 'Web',
    Icon: SiJavascript,
    cap: '#f7df1e',
    ink: '#111111',
    tagline: 'Bringing the web to life',
    what: 'A programming language used to build interactive and dynamic web experiences.',
    usedFor: "I use it to build interactive interfaces and handle dynamic web functionality.",
  },
  {
    id: 'php',
    name: 'PHP / Laravel',
    key: 'P',
    row: 0,
    category: 'Web',
    Icon: SiLaravel,
    cap: '#f05340',
    ink: '#ffffff',
    tagline: 'Building powerful web backends',
    what: 'A backend technology used to build dynamic web applications and APIs.',
    usedFor: 'I use Laravel to build backend systems, manage databases, and develop API endpoints.',
  },
  {
    id: 'java',
    name: 'Java',
    key: 'A',
    row: 0,
    category: 'Language',
    Icon: FaJava,
    cap: '#c74634',
    ink: '#ffffff',
    tagline: 'Building with object-oriented principles',
    what: 'An object-oriented language that runs on the JVM. A strong foundation for learning OOP: classes, inheritance, and encapsulation.',
    usedFor: 'My main language for Object-Oriented Programming coursework, applying OOP principles to structured, reusable code.',
  },

 //  Row 2: AI with Python

{
  id: 'machine-learning',
  name: 'Machine Learning',
  key: 'M',
  row: 1,
  category: 'AI / ML',
  Icon: SiScikitlearn,
  cap: '#f7931e',
  ink: '#111111',
  tagline: 'Teaching computer to learn from data',
  what: 'A field of AI focused on building models that learn patterns from data and make predictions.',
  usedFor:'I use it to explore classification, prediction, and data-driven problem solving with Python.',
},

{
  id: 'nlp',
  name: 'NLP',
  key: 'N',
  row: 1,
  category: 'AI / ML',
  Icon: SiPython,
  cap: '#3776ab',
  ink: '#ffffff',
  tagline: 'Teaching computer to understand language',
  what: 'A field of AI focused on processing and understanding human language using computational methods.',
  usedFor: 'I use Python to work with text data and explore language-based machine learning solutions.',
},

{
  id: 'computer-vision',
  name: 'Computer Vision',
  key: 'V',
  row: 1,
  category: 'AI / ML',
  Icon: SiOpencv,
  cap: '#5c3ee8',
  ink: '#ffffff',
  tagline: 'Teaching computer to see',
  what: 'A field of AI focused on enabling computers to process and understand visual information.',
  usedFor: 'I use Python to explore image processing and computer vision-based solutions.',
},
  // Row 3 : Data, design & workflow 
  {
    id: 'sql',
    name: 'SQL',
    key: 'S',
    row: 2,
    category: 'Data',
    Icon: SiMysql,
    cap: '#00758f',
    ink: '#ffffff',
    tagline: 'Working with structured data',
    what: 'A language used to manage, query, and organize relational databases.',
    usedFor:'I use SQL to design databases, manage data, and work with relational structures.',
  },
  {
    id: 'figma',
    name: 'Figma',
    key: 'F',
    row: 2,
    category: 'Design',
    Icon: SiFigma,
    cap: '#a259ff',
    ink: '#ffffff',
    tagline: 'Designing before building',
    what: 'A collaborative design tool for creating interfaces and interactive prototypes.',
    usedFor: 'I use it to make prototype interfaces and explore product ideas before development.',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    key: 'G',
    row: 2,
    category: 'Tooling',
    Icon: SiGithub,
    cap: '#1f2328',
    ink: '#ffffff',
    tagline: 'Managing code and collaboration',
    what: 'Version control tools used to manage source code and collaborate on projects.',
    usedFor: 'I use them to manage projects, track changes, and collaborate with teams.',
  },
];

/* Skill categories + short descriptions, shown below the keyboard. */
export const skillCategories = [
  { name: 'AI / ML', description: 'Machine learning, NLP, and vision in Python.' },
  { name: 'Web', description: 'Languages and frameworks for the web.' },
  { name: 'Language', description: 'Programming fundamentals and OOP.' },
  { name: 'Data', description: 'Designing and querying databases.' },
  { name: 'Design', description: 'Prototyping before building.' },
  { name: 'Tooling', description: 'Version control and collaboration.' },
];

// PROJECTS  [EDIT]
export const projectCategories = [
  'All',
  'Software Engineering',
  'AI / Machine Learning',
  'LLM / RAG',
  'Computer Vision',
];

export const projects = [
{
  id: 'coinride',
  image: '/projects/coinride.jpeg',
  title: 'CoinRide',
  category: 'Software Engineering',
  course: 'Team Project',
  year: '2026',
  summary: 'An AI-powered personal finance tracker designed to make transaction management and financial tracking more intuitive.',
  detail: 'Developed the backend using Supabase, including authentication, PostgreSQL database design, transaction storage, and user access management. Integrated the Next.js application with Supabase and connected the platform with a Hugging Face AI model for automatic transaction classification.',
  stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Hugging Face'],
  url: 'https://coinride.vercel.app/',
},
{
  id: 'smart-triage',
  image: '/projects/smarttriage.jpeg',
  title: 'Smart Triage',
  category: 'AI / Machine Learning',
  course: 'AI Project',
  year: '2025',
  summary : 'An AI-powered healthcare system designed to support emergency triage and hospital allocation.',
  detail: 'Developed an NLP-based triage system using a fine-tuned Hugging Face Transformer model to classify patient symptoms into risk levels and recommend healthcare facilities based on risk and available capacity. The application also includes hospital dispatch simulation, interactive maps, and capacity monitoring.',
  stack: ['Python','Streamlit', 'Hugging Face Transformers','PyTorch', 'Folium'],
  url: 'https://optimization-healthcare-ai-vfgn3u28mpecacpxfii9dy.streamlit.app/',
},
{
  id: 'rps-battle-arena',
  image: '/projects/rps.jpeg',
  title: 'RPS Battle Arena',
  category: 'AI / Machine Learning',
  course: 'Personal Project',
  year: '2026',
  summary: 'An adaptive Rock Paper Scissors game that learns from the player and predicts their next move.',
  detail: 'Built with Python, HTML, CSS, and JavaScript, the system uses a variable-order Markov model with additive smoothing to learn player move sequences and generate predictions. The interface also provides real-time confidence, accuracy, move distribution, and gameplay analytics.',
  stack: ['Python', 'JavaScript', 'HTML', 'CSS'],
  url: 'https://github.com/Maesticc/RPS-Arena',
},
{
  id: 'symptom-disease-classification',
  image: '/projects/machine.jpeg',
  fit: 'contain',
  title: 'Symptom to Disease Classification',
  category: 'AI / Machine Learning',
  course: 'Team Project',
  year: '2026',
  summary:'A machine learning system that classifies diseases from textual symptom descriptions using multiple classification algorithms.',
  detail:'Built a multi-class text classification pipeline that preprocesses symptom descriptions using tokenization, stopword removal, POS tagging, and lemmatization. TF-IDF was then used to extract text features before comparing Random Forest, Logistic Regression, Decision Tree, and Multinomial Naive Bayes classifiers.',
  stack: ['Python','NLP','NLTK','Scikit-learn','TF-IDF','Machine Learning'],
  url: 'https://ml-finalproject-group-7-lf01.streamlit.app/',
},
{
  id: 'symptom-disease-classifier',
  image: '/projects/nlp.jpeg',
  title: 'Symptom to Disease Classifier',
  category: 'AI / Machine Learning',
  course: 'Team Project',
  year: '2026',
  summary: 'A Streamlit-based machine learning application that predicts diseases from symptom descriptions using a Naive Bayes classifier.',
  detail: 'Built an interactive NLP application that preprocesses symptom descriptions using tokenization, stopword removal, and lemmatization before using a Naive Bayes classifier to predict disease categories. The application provides prediction results and confidence scores through a Streamlit web interface.',
  stack: ['Python', 'Streamlit', 'NLP', 'NLTK', 'Naive Bayes', 'Machine Learning'],
  url: 'https://nlp-final-project-group-23-lc01.streamlit.app/'
},
{
  id: 'medical-rag-evaluation',
  image: '/projects/llm.png',
  title: 'Local LLM Medical RAG Evaluation System',
  category: 'LLM / RAG',
  course: 'Research Project',
  year: '2026',
  summary:'A research system that evaluates Retrieval-Augmented Generation against non-RAG approaches for medical question answering using local LLMs.',
  detail:'Built an evaluation pipeline comparing RAG and No-RAG approaches using local Gemma models and Indonesian pharmaceutical data. The RAG pipeline combines dense semantic retrieval, BM25 keyword search, ensemble retrieval, and cross-encoder reranking before generating answers. Both approaches are evaluated using RAGAS-based metrics including answer correctness, answer relevancy, faithfulness, context precision, and context recall.',
  stack: ['Python','RAG','LLM','Gemma','Ollama','ChromaDB','BAAI BGE-M3','BM25','RAGAS'],
  url: 'https://github.com/Maesticc/crosslingual-medical-rag',
},
{
  id: 'bukacv',
  image: '/projects/bukacv.png',
  title: 'BukaCV Document Scanner',
  category: 'Computer Vision',
  course: 'Team Project',
  year: '2026',
  summary:'A document scanning application that uses computer vision to detect, transform, and enhance documents from images.',
  detail:'Built a Flask backend that provides image processing APIs for grayscale conversion, contour detection, perspective transformation, image enhancement, and PDF export. The scanning pipeline detects document boundaries using contour analysis and applies perspective transformation to produce a scanned document. The frontend is built with Flutter to provide the user interface for interacting with the scanning features.',
  stack: ['Python','Flask','OpenCV','Flutter','Computer Vision'],
  url: 'https://github.com/Maesticc/bukacv',
}
];

/* ------------------------------------------------------------
   EXPERIENCE  [EDIT]
------------------------------------------------------------ */

export const experiences = [
{
  id: 'exp-imajina',
  org: 'IMAJINA',
  role: 'Co-Founder',
  period: 'March 2025 - Present',
  location: 'Jakarta, Indonesia',
  description:
    'Co-founded and managed an event organizer focused on exhibitions and community events, overseeing business development, partnerships, event planning, marketing, and on-site operations.',
  skills: [
    'Business Development',
    'Event Management',
    'Marketing',
    'Partnerships',
    'Operations',
    'Leadership',
  ],

  timeline: [
    {
      date: 'June 2026',
      title: 'IMAJINA Virtual Run 2026',
      subtitle: 'Co-Founder · Event Management',
      description:
        'Co-founded and managed the execution of a virtual running event, overseeing operations, marketing, participant engagement, logistics, communications, and race result coordination.',
      skills: [
        'Event Management',
        'Marketing',
        'Operations',
        'Partnerships',
      ],
    },
    {
      date: 'April 2026',
      title: 'Alor Food Festival by IMAJINA',
      subtitle: 'Co-Founder · Event Management',
      description:
        'Co-founded and managed a large-scale food festival, overseeing business strategy, operations, marketing, stakeholder relations, tenant acquisition, logistics, and visitor engagement.',
      skills: [
        'Business Strategy',
        'Event Management',
        'Marketing',
        'Stakeholder Relations',
      ],
    },
    {
      date: 'August 2025',
      title: 'The Taste of SINGKAWANG by IMAJINA',
      subtitle: 'Co-Founder · Event Management',
      description:
        "Co-founded and led a cultural food festival showcasing Singkawang's culinary traditions, coordinating event planning, stakeholder relations, vendor partnerships, marketing, and community engagement.",
      skills: [
        'Event Planning',
        'Partnerships',
        'Marketing',
        'Community',
      ],
    },
  ],
},
  {
    id: 'exp-2',
    org: 'PT Dos Pictures Creative',
    role: 'Production Assistant',
    period: 'October 2024 - March 2025',
    location: 'Jakarta, Indonesia',
    description:
      'Assisted in preparing production equipment for photo and video shoots, ensuring equipment readiness and providing on-site operational support. Collaborated with production teams to facilitate smooth shooting operations.',
    skills: [
      'Production Support',
      'Teamwork',
      'Operations',
    ],
    timeline: [
      {
        date: 'March 2025',
        title: 'Completed the Role',
        subtitle: 'Production Assistant · Wrap-up',
        description:
          'Concluded the role after consistently supporting productions, having grown more confident handling equipment, on-site coordination, and fast-paced shooting schedules.',
        skills: ['Operations', 'Reliability'],
      },
      {
        date: 'Nov 2024 - Feb 2025',
        title: 'On-Set Production Support',
        subtitle: 'Production Assistant · Shoots',
        description:
          'Supported photo and video shoots by preparing and maintaining equipment, assisting the crew during production, and helping keep shooting operations running smoothly on set.',
        skills: ['Production Support', 'Teamwork', 'Equipment Handling'],
      },
      {
        date: 'October 2024',
        title: 'Joined as Production Assistant',
        subtitle: 'Production Assistant · Onboarding',
        description:
          'Started at PT Dos Pictures Creative, learning the production workflow and the equipment used for photo and video shoots.',
        skills: ['Onboarding', 'Learning'],
      },
    ],
  },
];
