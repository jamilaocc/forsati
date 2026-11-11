import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpLeft,
  Award,
  Bookmark,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  CircleHelp,
  Cloud,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Languages,
  Layers3,
  MapPin,
  Menu,
  Pencil,
  Play,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Section = "home" | "jobs" | "learn" | "languages" | "cv" | "profile";

type Lesson = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  fit: string;
  icon: typeof Cloud;
  tone: string;
};

type CourseQuestion = { question: string; options: string[]; answer: number; explanation: string };
type CatalogLesson = {
  id: number;
  title: string;
  orderIndex: number;
  durationMinutes: number;
  objectives: string;
  prerequisites: string;
  explanation: string;
  example: string;
  exercise: string;
  questions: CourseQuestion[];
};
type CatalogCourse = {
  id: number;
  field: string;
  title: string;
  description: string;
  level: string;
  contentLanguage: string;
  durationMinutes: number;
  lessons: CatalogLesson[];
};

const opportunities = [
  {
    id: "cloud-junior",
    title: "Junior Cloud Engineer",
    company: "Atlas Digital",
    location: "الدار البيضاء · هجين",
    type: "وظيفة",
    field: "Cloud",
    deadline: "باقي 8 أيام",
    description: "بداية قوية في عالم السحابة مع فريق كيبني حلول AWS وAzure للشركات الناشئة.",
    tags: ["AWS", "Linux", "Terraform"],
    featured: true,
  },
  {
    id: "devops-intern",
    title: "تدريب DevOps لمدة 6 أشهر",
    company: "CloudNest Morocco",
    location: "عن بعد · المغرب",
    type: "تدريب",
    field: "DevOps",
    deadline: "باقي 14 يوم",
    description: "تعلم CI/CD وDocker وKubernetes مع mentoring أسبوعي ومشروع حقيقي في النهاية.",
    tags: ["Docker", "CI/CD", "Git"],
    featured: false,
  },
  {
    id: "support-cloud",
    title: "Cloud Support Associate",
    company: "Nova Systems",
    location: "الرباط · حضوري",
    type: "وظيفة",
    field: "Support",
    deadline: "باقي 21 يوم",
    description: "ساعد العملاء يحلو مشاكلهم التقنية وطور مهاراتك في الشبكات والبنية التحتية.",
    tags: ["Networking", "Azure", "English"],
    featured: false,
  },
  {
    id: "design-trainee",
    title: "مصمم/ة محتوى مبتدئ",
    company: "Mosaic Studio",
    location: "مراكش · هجين",
    type: "تدريب",
    field: "Design",
    deadline: "باقي 5 أيام",
    description: "فرصة عملية باش تبني portfolio ديالك وتخدم مع فريق إبداعي متنوع.",
    tags: ["Figma", "Canva", "Portfolio"],
    featured: false,
  },
];

const lessons: Lesson[] = [
  {
    id: "cloud-basics",
    title: "Cloud من الصفر: شنو خاصك تعرف؟",
    category: "Cloud & DevOps",
    duration: "12 دقيقة",
    level: "مبتدئ",
    fit: "Junior Cloud Engineer",
    icon: Cloud,
    tone: "mint",
  },
  {
    id: "git-first-steps",
    title: "أول خطواتك مع Git وGitHub",
    category: "البرمجة",
    duration: "18 دقيقة",
    level: "مبتدئ",
    fit: "كل الفرص التقنية",
    icon: Code2,
    tone: "lavender",
  },
  {
    id: "english-interview",
    title: "عبارات مهمة لمقابلة العمل بالإنجليزية",
    category: "اللغات",
    duration: "9 دقيقة",
    level: "كل المستويات",
    fit: "Cloud Support",
    icon: GraduationCap,
    tone: "yellow",
  },
  {
    id: "digital-marketing",
    title: "بدايات عملية في التسويق الرقمي",
    category: "التسويق",
    duration: "15 دقيقة",
    level: "مبتدئ",
    fit: "مصمم/ة محتوى",
    icon: Rocket,
    tone: "peach",
  },
  {
    id: "linux-cloud",
    title: "Linux اللي خاصك فـ Cloud",
    category: "Cloud & DevOps",
    duration: "16 دقيقة",
    level: "مبتدئ",
    fit: "Junior Cloud Engineer",
    icon: Layers3,
    tone: "mint",
  },
  {
    id: "aws-foundations",
    title: "AWS: أول خدمة وVirtual Machine",
    category: "Cloud",
    duration: "21 دقيقة",
    level: "مبتدئ",
    fit: "Junior Cloud Engineer",
    icon: Cloud,
    tone: "yellow",
  },
  {
    id: "docker-cicd",
    title: "Docker وCI/CD من الصفر",
    category: "DevOps",
    duration: "22 دقيقة",
    level: "متوسط",
    fit: "تدريب DevOps",
    icon: Code2,
    tone: "lavender",
  },
  {
    id: "networking-azure",
    title: "الشبكات وAzure للدعم التقني",
    category: "Cloud Support",
    duration: "14 دقيقة",
    level: "مبتدئ",
    fit: "Cloud Support Associate",
    icon: Layers3,
    tone: "peach",
  },
];

type LanguageLesson = { title: string; exercise: string; question: string; options: string[]; answer: number };
type LanguageAchievement = { languageId: string; score: number; badgeId: string; completedAt?: string };
type ExamQuestion = { question: string; options: string[]; answer: number };

const languageCourses: { id: string; name: string; native: string; level: string; progress: number; tone: string; flag: string; lessons: LanguageLesson[] }[] = [
  { id: "english", name: "English", native: "الإنجليزية", level: "مبتدئ", progress: 35, tone: "mint", flag: "EN", lessons: [
    { title: "التعريف بالنفس", exercise: "كتب جملة كتقدم بها راسك بالإنجليزية.", question: "شنو هي الجملة الصحيحة؟", options: ["My name is Yassine.", "My name are Yassine.", "I name Yassine."], answer: 0 },
    { title: "عبارات مقابلة العمل", exercise: "اختار العبارة المناسبة باش تقول أنك فرحان بالفرصة.", question: "كيفاش نقولو: أنا متحمس لهاد الفرصة؟", options: ["I am late for this opportunity.", "I am excited about this opportunity.", "I am closed about this opportunity."], answer: 1 },
    { title: "كلمات الخدمة والعمل", exercise: "ربط كلمة skill بالمعنى الصحيح.", question: "شنو كتعني skill؟", options: ["مهارة", "مدينة", "موعد"], answer: 0 },
    { title: "كتابة إيميل مهني", exercise: "اختار بداية مناسبة لإيميل بالإنجليزية.", question: "شنو هي البداية المهنية؟", options: ["Hi bro", "Dear Hiring Manager,", "Yo!"], answer: 1 },
    { title: "التواصل مع الفريق", exercise: "اختار الجملة اللي كتطلب المساعدة باحترام.", question: "كيفاش نطلب توضيح؟", options: ["Could you please clarify this task?", "Explain now!", "I don't care."], answer: 0 },
    { title: "المواعيد والمهام", exercise: "فهم كلمة deadline واستعملها فالسياق.", question: "شنو كتعني deadline؟", options: ["آخر أجل", "استراحة", "مقابلة"], answer: 0 },
  ] },
  { id: "french", name: "Français", native: "الفرنسية", level: "مبتدئ", progress: 20, tone: "lavender", flag: "FR", lessons: [
    { title: "Se présenter", exercise: "كمل الجملة ديال التعريف بالنفس.", question: "Je ___ Yassine.", options: ["suis", "es", "sont"], answer: 0 },
    { title: "فهم إعلان العمل", exercise: "قلب على الكلمة اللي كتدل على المهارات.", question: "شنو كتعني compétences؟", options: ["الشركة", "المهارات", "المدينة"], answer: 1 },
    { title: "رسالة مهنية قصيرة", exercise: "اختار التحية المناسبة فإيميل مهني.", question: "كيفاش نبداو رسالة رسمية؟", options: ["Salut frère", "Bonjour Madame, Monsieur", "À demain"], answer: 1 },
    { title: "مكالمة مهنية", exercise: "اختار العبارة المناسبة فالرد على مكالمة.", question: "شنو نقولو فبداية مكالمة؟", options: ["Bonjour, comment puis-je vous aider?", "Quoi?", "Parle vite."], answer: 0 },
    { title: "تأكيد موعد", exercise: "صايب جملة كتأكد بها الموعد.", question: "شنو كتعني Je confirme notre rendez-vous؟", options: ["كنلغي الموعد", "كنأكد الموعد ديالنا", "كنبدل الخدمة"], answer: 1 },
    { title: "وصف المهام", exercise: "قلب على الكلمة اللي كتدل على المسؤوليات.", question: "شنو كتعني responsabilités؟", options: ["المسؤوليات", "العطلة", "الراتب"], answer: 0 },
  ] },
  { id: "arabic", name: "العربية", native: "العربية", level: "متوسط", progress: 60, tone: "yellow", flag: "ع", lessons: [
    { title: "كتابة CV بالعربية", exercise: "كتب نبذة قصيرة على المهارات ديالك.", question: "شنو خاص النبذة المهنية تكون؟", options: ["واضحة ومختصرة", "طويلة بلا معلومات", "غير بالإيموجي"], answer: 0 },
    { title: "التواصل المهني", exercise: "اختار العبارة الأكثر مهنية.", question: "شنو نقولو فطلب معلومات؟", options: ["عافاك واش ممكن توضح ليا؟", "جاوبني دابا", "ما فهمت والو"], answer: 0 },
    { title: "التعبير على المهارات", exercise: "حول مهارة إلى جملة مفيدة.", question: "أي جملة مناسبة للـ CV؟", options: ["كنعرف نخدم مع الفريق", "الفريق", "خدمة بزاف"], answer: 0 },
    { title: "كتابة إيميل مهني", exercise: "اختار افتتاحية محترمة لإيميل.", question: "شنو البداية المناسبة؟", options: ["السلام عليكم، أتمنى أن تكونوا بخير", "جاوبني", "عندي سؤال"], answer: 0 },
    { title: "التعاون مع الفريق", exercise: "اختار جملة كتبيّن التعاون.", question: "أي جملة مهنية؟", options: ["أقترح أن نقسم المهام بيننا", "ديرها بوحدك", "ماشي شغلي"], answer: 0 },
    { title: "تنظيم الوقت", exercise: "رتب المهام حسب الأولوية.", question: "شنو الأولوية؟", options: ["المهمة المستعجلة والمهمة", "أي حاجة سهلة", "التأجيل ديما"], answer: 0 },
  ] },
  { id: "german", name: "Deutsch", native: "الألمانية", level: "مبتدئ", progress: 10, tone: "peach", flag: "DE", lessons: [
    { title: "Hallo und Vorstellung", exercise: "تعلم كيفاش تقول سميتك بالألمانية.", question: "Ich ___ Yassine.", options: ["bin", "bist", "sind"], answer: 0 },
    { title: "كلمات المهنة", exercise: "اختار معنى كلمة Arbeit.", question: "شنو كتعني Arbeit؟", options: ["العمل", "المدينة", "الدرس"], answer: 0 },
    { title: "أول إيميل مهني", exercise: "اختار بداية مناسبة لإيميل مهني.", question: "شنو هي التحية المناسبة؟", options: ["Guten Tag", "Tschüss Arbeit", "Hallo gestern"], answer: 0 },
    { title: "مكالمة بسيطة", exercise: "تعلم كيفاش تجاوب على مكالمة بالألمانية.", question: "شنو كتعني Wie kann ich helfen؟", options: ["كيف يمكنني المساعدة؟", "أين المدينة؟", "إلى اللقاء أمس"], answer: 0 },
    { title: "فهم المهام", exercise: "اختار معنى كلمة Aufgabe.", question: "شنو كتعني Aufgabe؟", options: ["مهمة", "مقابلة", "شهادة"], answer: 0 },
    { title: "تأكيد موعد", exercise: "اختار العبارة اللي كتأكد الموعد.", question: "شنو كتعني Ich bestätige den Termin؟", options: ["كنأكد الموعد", "كنلغي الموعد", "كنقلب على عمل"], answer: 0 },
  ] },
];

const finalExamQuestions: Record<string, ExamQuestion[]> = {
  english: [
    { question: "Choose the correct introduction.", options: ["My name is Yassine.", "My name are Yassine.", "I name Yassine."], answer: 0 },
    { question: "How do you say: أنا متحمس لهذه الفرصة؟", options: ["I am excited about this opportunity.", "I am closed about this opportunity.", "I am late this opportunity."], answer: 0 },
    { question: "What does skill mean?", options: ["مهارة", "مدينة", "موعد"], answer: 0 },
    { question: "Choose the professional sentence.", options: ["I can work well with a team.", "Team work me can.", "I working team yesterday."], answer: 0 },
    { question: "Complete: I ___ looking for a job.", options: ["am", "is", "are"], answer: 0 },
  ],
  french: [
    { question: "Je ___ Yassine.", options: ["suis", "es", "sont"], answer: 0 },
    { question: "Que signifie compétences?", options: ["المهارات", "الشركة", "المدينة"], answer: 0 },
    { question: "Quelle formule est professionnelle?", options: ["Bonjour Madame, Monsieur", "Salut frère", "À demain travail"], answer: 0 },
    { question: "Complétez: Je ___ motivé.", options: ["suis", "est", "sommes"], answer: 0 },
    { question: "Que signifie travail?", options: ["العمل", "السفر", "الدرس"], answer: 0 },
  ],
  arabic: [
    { question: "كيف تكون النبذة المهنية الجيدة؟", options: ["واضحة ومختصرة", "طويلة بلا معلومات", "غير بالإيموجي"], answer: 0 },
    { question: "شنو العبارة الأكثر مهنية؟", options: ["عافاك واش ممكن توضح ليا؟", "جاوبني دابا", "ما فهمت والو"], answer: 0 },
    { question: "أي جملة مناسبة للـCV؟", options: ["كنعرف نخدم مع الفريق", "الفريق", "خدمة بزاف"], answer: 0 },
    { question: "ما هو الأسلوب المناسب في رسالة عمل؟", options: ["محترم وواضح", "غاضب ومختصر بزاف", "بلا تحية"], answer: 0 },
    { question: "شنو خاصك تذكر فالتعريف بالنفس؟", options: ["الاسم والمهارات والهدف", "الأسرار الشخصية", "معلومات ما عندها علاقة"], answer: 0 },
  ],
  german: [
    { question: "Ich ___ Yassine.", options: ["bin", "bist", "sind"], answer: 0 },
    { question: "Was bedeutet Arbeit?", options: ["العمل", "المدينة", "الدرس"], answer: 0 },
    { question: "Welche Begrüßung ist professionell?", options: ["Guten Tag", "Tschüss Arbeit", "Hallo gestern"], answer: 0 },
    { question: "Ich ___ motiviert.", options: ["bin", "bist", "sind"], answer: 0 },
    { question: "Was bedeutet Bewerbung?", options: ["طلب عمل", "عطلة", "اجتماع"], answer: 0 },
  ],
};

type LessonContent = { objective: string; explanation: string; vocabulary: string[]; example: string };
const languageLessonContent: Record<string, LessonContent> = {
  "english-0": { objective: "تقدر تقدم راسك بثقة فبداية مقابلة أو اجتماع.", explanation: "فالتعريف بالنفس، بدا بالاسم، الدور أو الدراسة، ومن بعد الهدف ديالك. استعمل جمل قصيرة وواضحة.", vocabulary: ["My name is = سميتي هي", "I am = أنا", "I work as = كنخدم كـ", "I am interested in = مهتم بـ"], example: "Hello, my name is Yassine. I am a junior DevOps enthusiast." },
  "english-1": { objective: "تستعمل عبارات مهنية فمقابلة العمل.", explanation: "جاوب بهدوء، استعمل because باش تشرح، وكن إيجابي فالتعبير على المهارات والتجارب.", vocabulary: ["opportunity = فرصة", "experience = تجربة", "strength = نقطة قوة", "excited = متحمس"], example: "I am excited about this opportunity because I enjoy learning." },
  "english-2": { objective: "تفهم كلمات أساسية مرتبطة بالخدمة والمهارات.", explanation: "فرق بين skill (مهارة)، task (مهمة)، team (فريق)، وdeadline (آخر أجل). هاد الكلمات كتعاود بزاف فإعلانات العمل.", vocabulary: ["skill = مهارة", "task = مهمة", "team = فريق", "deadline = آخر أجل"], example: "My main skill is communication, and I work well with a team." },
  "english-3": { objective: "تكتب إيميل مهني قصير وواضح.", explanation: "بدا بتحية، وضح السبب فالسطر الأول، طلب المعلومة أو الفعل المطلوب، وسالي بالشكر والاسم.", vocabulary: ["Dear = عزيزي/عزيزتي", "regarding = بخصوص", "attached = مرفق", "Best regards = مع التحية"], example: "Dear Hiring Manager, I am writing regarding the internship opportunity." },
  "english-4": { objective: "تتواصل مع الفريق وتطلب التوضيح بطريقة إيجابية.", explanation: "طلب المساعدة ماشي ضعف. استعمل Could you please... ووضح بالضبط شنو ما فهمتيش.", vocabulary: ["clarify = يوضح", "team member = عضو الفريق", "support = مساعدة", "understand = يفهم"], example: "Could you please clarify this task? I want to make sure I understand it." },
  "english-5": { objective: "تفهم المواعيد والمهام فبيئة العمل.", explanation: "deadline هو آخر أجل، due date هو تاريخ التسليم، وpriority هي الأولوية. هاد الكلمات كتعاونك تنظم خدمتك.", vocabulary: ["deadline = آخر أجل", "due date = تاريخ التسليم", "priority = أولوية", "schedule = برنامج"], example: "The deadline is Friday, so this task is my priority today." },
  "french-0": { objective: "تقدم راسك بالفرنسية بطريقة بسيطة.", explanation: "استعمل Je m'appelle للاسم، Je suis للدور أو الصفة، وJ'habite فالمكان.", vocabulary: ["Je m'appelle = سميتي", "Je suis = أنا", "J'habite = ساكن فـ", "enchanté = متشرف"], example: "Bonjour, je m'appelle Yassine. Je suis étudiant en informatique." },
  "french-1": { objective: "تفهم الكلمات الأساسية فإعلان العمل الفرنسي.", explanation: "قلب على poste (المنصب)، compétences (المهارات)، expérience (التجربة)، وcandidature (الترشح).", vocabulary: ["poste = منصب", "compétences = مهارات", "expérience = تجربة", "candidature = ترشح"], example: "Le poste demande des compétences en communication." },
  "french-2": { objective: "تكتب بداية رسالة مهنية قصيرة.", explanation: "بدا بـ Bonjour Madame, Monsieur، وضح علاش كتكتب، وسالي بـ Cordialement.", vocabulary: ["objet = الموضوع", "demande = طلب", "disponible = متاح", "Cordialement = مع التحية"], example: "Bonjour Madame, Monsieur, je vous contacte au sujet du poste." },
  "french-3": { objective: "تجاوب على مكالمة مهنية بأدب.", explanation: "جاوب بالتحية، عرف براسك، وسول كيفاش تقدر تساعد. الصوت الهادئ والواضح مهم.", vocabulary: ["appel = مكالمة", "aider = يساعد", "service = مصلحة", "un instant = لحظة"], example: "Bonjour, vous êtes bien au service support. Comment puis-je vous aider?" },
  "french-4": { objective: "تأكد موعد أو اجتماع بالفرنسية.", explanation: "استعمل Je confirme باش تأكد، وnotre rendez-vous للموعد ديالنا. زيد التاريخ والساعة بوضوح.", vocabulary: ["confirmer = يؤكد", "rendez-vous = موعد", "demain = غدا", "heure = ساعة"], example: "Je confirme notre rendez-vous demain à dix heures." },
  "french-5": { objective: "تفهم المسؤوليات فإعلان العمل.", explanation: "responsabilités كتشرح شنو غادي تدير، وmissions كتجمع المهام الأساسية ديال المنصب.", vocabulary: ["responsabilités = مسؤوليات", "missions = مهام", "équipe = فريق", "objectif = هدف"], example: "Mes responsabilités seront de soutenir l'équipe et suivre les demandes." },
  "arabic-0": { objective: "تكتب نبذة مهنية واضحة فـCV ديالك.", explanation: "النبذة الجيدة فيها شكون نتا، شنو كتقدر تدير، وشنو الهدف المهني ديالك. خليها بين جوج وثلاثة سطور.", vocabulary: ["نبذة مهنية", "المهارات", "الخبرة", "الهدف المهني"], example: "طالب شغوف بالسحابة، أمتلك أساسيات Linux وGit وأبحث عن تدريب عملي." },
  "arabic-1": { objective: "تتواصل باحترام ووضوح فالمواقف المهنية.", explanation: "استعمل عبارات الطلب المؤدب، سمع مزيان، وأكد المعلومة قبل ما تجاوب.", vocabulary: ["من فضلك", "هل يمكنك التوضيح؟", "أشكرك على وقتك", "سأعود إليك"], example: "من فضلك، هل يمكنك توضيح المهلة المطلوبة لإنجاز المهمة؟" },
  "arabic-2": { objective: "تعبر على المهارات ديالك بأمثلة عملية.", explanation: "ما تقولش غير كنحسن التواصل؛ عط مثال: خدمت مع فريق، قسمت المهام، ووصلنا للنتيجة.", vocabulary: ["أجيد", "أساهم", "أطور", "أحل المشكلات"], example: "أجيد العمل ضمن فريق وأساهم في حل المشكلات بسرعة." },
  "arabic-3": { objective: "تكتب إيميل مهني محترم.", explanation: "استعمل تحية واضحة، اذكر الموضوع، اطلب ما تحتاجه، واشكر القارئ، ثم اكتب اسمك.", vocabulary: ["الموضوع", "أرجو", "مرفق", "مع خالص التحية"], example: "السلام عليكم، أرجو تزويدي بمعلومات إضافية حول التدريب. مع خالص التحية." },
  "arabic-4": { objective: "تتعاون مع الفريق وتقسم المهام.", explanation: "التعاون كيبدا باقتراح واضح وسؤال الزملاء على التقدم، بلا أوامر أو لوم.", vocabulary: ["أقترح", "نقسم المهام", "نتابع", "مساعدة"], example: "أقترح أن نقسم المهام بيننا ونتابع التقدم في نهاية اليوم." },
  "arabic-5": { objective: "تنظم الوقت حسب الأولوية.", explanation: "بدا بالمهمة المستعجلة والمهمة، قسم المشاريع الكبيرة لخطوات صغيرة، وحدد وقت لكل خطوة.", vocabulary: ["الأولوية", "المهلة", "مستعجل", "الجدولة"], example: "سأبدأ بالمهمة المستعجلة قبل نهاية المهلة، ثم أتابع باقي الخطوات." },
  "german-0": { objective: "تقدم راسك بجمل ألمانية بسيطة.", explanation: "استعمل Ich heiße للاسم، Ich bin للصفة أو الدور، وIch komme aus للبلد.", vocabulary: ["Hallo = مرحبا", "Ich heiße = سميتي", "Ich bin = أنا", "Danke = شكرا"], example: "Hallo, ich heiße Yassine. Ich bin Student." },
  "german-1": { objective: "تفهم كلمات ألمانية مرتبطة بالمهنة.", explanation: "Arbeit هي العمل، Beruf هي المهنة، Erfahrung هي التجربة، وFähigkeiten هي المهارات.", vocabulary: ["Arbeit = العمل", "Beruf = المهنة", "Erfahrung = تجربة", "Fähigkeiten = مهارات"], example: "Ich habe Erfahrung in Linux und gute Kommunikationsfähigkeiten." },
  "german-2": { objective: "تبدا إيميل مهني بالألمانية.", explanation: "فالإيميل الرسمي استعمل Guten Tag أو Sehr geehrte Damen und Herren، وختم بـ Mit freundlichen Grüßen.", vocabulary: ["Betreff = الموضوع", "Anfrage = استفسار", "Bewerbung = طلب عمل", "Grüße = تحيات"], example: "Guten Tag, ich schreibe Ihnen bezüglich der Stelle." },
  "german-3": { objective: "تجاوب على مكالمة مهنية بسيطة.", explanation: "استعمل Guten Tag فالتحية، Wie kann ich helfen للسؤال، وEinen Moment bitte لطلب لحظة.", vocabulary: ["Anruf = مكالمة", "helfen = يساعد", "Moment = لحظة", "Support = دعم"], example: "Guten Tag, wie kann ich Ihnen helfen?" },
  "german-4": { objective: "تفهم كلمات المهام اليومية.", explanation: "Aufgabe هي المهمة، wichtig يعني مهم، وfertig يعني جاهز أو مكتمل. استعملهم باش توصف خدمتك.", vocabulary: ["Aufgabe = مهمة", "wichtig = مهم", "fertig = مكتمل", "heute = اليوم"], example: "Diese Aufgabe ist wichtig. Ich bin heute fertig." },
  "german-5": { objective: "تأكد موعد بالألمانية.", explanation: "Ich bestätige كتقول كنأكد، وden Termin هو الموعد. زيد اليوم والساعة إذا احتجتي.", vocabulary: ["bestätigen = يؤكد", "Termin = موعد", "morgen = غدا", "Uhr = الساعة"], example: "Ich bestätige den Termin morgen um zehn Uhr." },
};

const navItems: { id: Section; label: string; icon: typeof Target }[] = [
  { id: "home", label: "الرئيسية", icon: Layers3 },
  { id: "jobs", label: "الفرص", icon: BriefcaseBusiness },
  { id: "learn", label: "تعلم", icon: GraduationCap },
  { id: "languages", label: "اللغات", icon: Languages },
  { id: "cv", label: "CV ديالي", icon: FileText },
  { id: "profile", label: "ملفي", icon: UserRound },
];

const initialProfile = {
  name: "ياسين العلوي",
  role: "طالب Cloud & DevOps",
  city: "الدار البيضاء، المغرب",
  email: "yassine@example.com",
  about: "كنقلب على أول فرصة باش نطبق اللي تعلمت ونكبر وسط فريق كيشجع التعلم.",
  skills: "AWS, Linux, Git, Docker, HTML, التواصل",
};

const initialCv = {
  name: "ياسين العلوي",
  headline: "Junior Cloud & DevOps enthusiast",
  email: "yassine@example.com",
  city: "الدار البيضاء، المغرب",
  summary: "طالب شغوف بالسحابة والبنية التحتية، كنحب نتعلم بسرعة ونحوّل المعرفة لمشاريع عملية.",
  experience: "مشروع شخصي · نشر تطبيق React باستعمال Docker وGitHub Actions · 2025",
};

const LANGUAGE_PROGRESS_STORAGE_KEY = "forsati-language-progress";
const LANGUAGE_ACHIEVEMENTS_STORAGE_KEY = "forsati-language-achievements";
const COURSE_PROGRESS_STORAGE_KEY = "forsati-course-progress";

export default function Home() {
  const authQuery = trpc.auth.me.useQuery();
  const languageProgressQuery = trpc.languageProgress.list.useQuery(undefined, { enabled: Boolean(authQuery.data) });
  const languageAchievementsQuery = trpc.languageAchievements.list.useQuery(undefined, { enabled: Boolean(authQuery.data) });
  const courseCatalogQuery = trpc.courseCatalog.list.useQuery();
  const courseProgressQuery = trpc.courseCatalog.progress.useQuery(undefined, { enabled: Boolean(authQuery.data) });
  const setLanguageProgress = trpc.languageProgress.set.useMutation();
  const saveLanguageAchievement = trpc.languageAchievements.save.useMutation();
  const setCourseProgress = trpc.courseCatalog.setProgress.useMutation();
  const [section, setSection] = useState<Section>("home");
  const [jobFilter, setJobFilter] = useState("الكل");
  const [jobSearch, setJobSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [completedCourseLessons, setCompletedCourseLessons] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>(["git-first-steps"]);
  const [completedLanguageLessons, setCompletedLanguageLessons] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_PROGRESS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ["english-0", "arabic-0"];
    } catch {
      return ["english-0", "arabic-0"];
    }
  });
  const [languageAchievements, setLanguageAchievements] = useState<LanguageAchievement[]>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_ACHIEVEMENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [cv, setCv] = useState(initialCv);
  const [profileEditing, setProfileEditing] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (authQuery.data && languageProgressQuery.data) {
      setCompletedLanguageLessons(languageProgressQuery.data);
    }
  }, [authQuery.data, languageProgressQuery.data]);

  useEffect(() => {
    if (authQuery.data && languageAchievementsQuery.data) {
      setLanguageAchievements(languageAchievementsQuery.data.map((achievement) => ({ ...achievement, completedAt: achievement.completedAt?.toString() })));
    }
  }, [authQuery.data, languageAchievementsQuery.data]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_PROGRESS_STORAGE_KEY, JSON.stringify(completedLanguageLessons));
  }, [completedLanguageLessons]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(languageAchievements));
  }, [languageAchievements]);

  useEffect(() => {
    if (authQuery.data && courseProgressQuery.data) setCompletedCourseLessons(courseProgressQuery.data);
  }, [authQuery.data, courseProgressQuery.data]);

  useEffect(() => {
    localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify(completedCourseLessons));
  }, [completedCourseLessons]);

  const filteredJobs = useMemo(() => {
    const search = jobSearch.trim().toLowerCase();
    return opportunities.filter((job) => {
      const matchesFilter = jobFilter === "الكل" || job.type === jobFilter || job.field === jobFilter;
      const matchesSearch = !search || `${job.title} ${job.company} ${job.field} ${job.tags.join(" ")}`.toLowerCase().includes(search);
      return matchesFilter && matchesSearch && (!savedOnly || savedJobs.includes(job.id));
    });
  }, [jobFilter, jobSearch, savedOnly, savedJobs]);

  const publishedLessonCount = courseCatalogQuery.data?.reduce((total, course) => total + course.lessons.length, 0) ?? lessons.length;
  const progress = Math.round((completedLessons.length / lessons.length) * 100);

  const goTo = (next: Section) => {
    setSection(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    try {
      startLogin();
    } catch {
      toast.info("تسجيل الدخول غادي يتفعل ملي نربطو Authentication.");
    }
  };

  const toggleSavedJob = (id: string) => {
    setSavedJobs((current) => {
      const exists = current.includes(id);
      toast.success(exists ? "تحيدات من المحفوظات" : "تحفظات الفرصة عندك");
      return exists ? current.filter((jobId) => jobId !== id) : [...current, id];
    });
  };

  const toggleLesson = (lesson: Lesson) => {
    setCompletedLessons((current) => {
      const exists = current.includes(lesson.id);
      toast.success(exists ? "رجعنا الدرس لقائمة التعلم" : "برافو! كملتي درس جديد");
      return exists ? current.filter((id) => id !== lesson.id) : [...current, lesson.id];
    });
  };

  const toggleCourseLesson = (lessonId: number) => {
    setCompletedCourseLessons((current) => {
      const completed = !current.includes(lessonId);
      const next = completed ? [...current, lessonId] : current.filter((id) => id !== lessonId);
      if (authQuery.data) setCourseProgress.mutate({ lessonId, completed });
      toast.success(completed ? "برافو! كمّلتي الدرس وتسجل التقدم" : "تحيد الدرس من التقدم");
      return next;
    });
  };

  const toggleLanguageLesson = (lessonId: string) => {
    setCompletedLanguageLessons((current) => {
      const completed = !current.includes(lessonId);
      const next = completed ? [...current, lessonId] : current.filter((id) => id !== lessonId);
      if (authQuery.data) {
        setLanguageProgress.mutate({ lessonId, completed });
      }
      toast.success(completed ? "برافو! تسجل تقدم اللغة ديالك" : "تحيد الدرس من التقدم");
      return next;
    });
  };

  const passFinalExam = (languageId: string, score: number) => {
    const achievement = { languageId, score, badgeId: `${languageId}-master`, completedAt: new Date().toISOString() };
    setLanguageAchievements((current) => [...current.filter((item) => item.languageId !== languageId), achievement]);
    if (authQuery.data) saveLanguageAchievement.mutate(achievement);
    toast.success("مبروك! خديتي Badge وشهادة رقمية جديدة");
  };

  const downloadCertificate = (languageId: string, score: number) => {
    const course = languageCourses.find((item) => item.id === languageId);
    if (!course) return;
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>شهادة فرصتي - ${course.name}</title><style>body{font-family:Arial,sans-serif;background:#eef8f4;color:#193f42;text-align:center;padding:70px 20px}main{max-width:700px;margin:auto;background:white;border:8px solid #b5eddf;border-radius:24px;padding:60px 30px}h1{color:#27776f;font-size:38px}h2{font-size:30px;margin:25px 0 8px}p{color:#66817b;font-size:18px;line-height:1.8}.badge{display:inline-block;background:#e9e2fa;color:#7458b8;padding:12px 24px;border-radius:30px;font-weight:bold}</style></head><body><main><div class="badge">Badge ديال الإتقان</div><h1>شهادة إتمام رقمية</h1><p>كنشهدوا أن المستخدم أكمل بنجاح الاختبار النهائي لمسار</p><h2>${course.name}</h2><p>بنقطة نجاح: <strong>${score}%</strong></p><p>منصة فرصتي · ${new Date().toLocaleDateString("ar-MA")}</p></main></body></html>`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    link.download = `forsati-${languageId}-certificate.html`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("تهبطات الشهادة الرقمية ديالك");
  };

  const downloadCv = () => {
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${cv.name} - CV</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#172f31;line-height:1.8}h1{margin-bottom:4px;color:#145e59}h2{border-bottom:2px solid #b9e8dc;padding-bottom:6px;margin-top:32px}p{margin:6px 0}.meta{color:#5f7475}</style></head><body><h1>${cv.name}</h1><p><strong>${cv.headline}</strong></p><p class="meta">${cv.email} · ${cv.city}</p><h2>نبذة</h2><p>${cv.summary}</p><h2>التجربة والمشاريع</h2><p>${cv.experience}</p><h2>المهارات</h2><p>${profile.skills}</p></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cv.name.replace(/\s+/g, "-")}-CV.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تهبط CV ديالك بنجاح");
  };

  return (
    <div className="forsati-app" dir="rtl">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => goTo("home")} aria-label="العودة للرئيسية">
            <span className="brand-mark"><Sparkles size={18} /></span>
            <span><strong>فرصتي</strong><small>طريقك كيبدا هنا</small></span>
          </button>

          <nav className={`desktop-nav ${mobileMenu ? "mobile-open" : ""}`} aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => goTo(item.id)}><Icon size={17} />{item.label}</button>;
            })}
          </nav>

          <div className="topbar-actions">
            <button className="notification-button" aria-label="الإشعارات" onClick={() => toast.info("ما كايناش إشعارات جديدة دابا")}><CircleHelp size={19} /></button>
            <button className="login-button" onClick={handleLogin}>دخول</button>
            <button className="menu-button" onClick={() => setMobileMenu((value) => !value)} aria-label="فتح القائمة"><Menu size={21} /></button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        {section === "home" && <HomeSection goTo={goTo} onOpenSaved={() => { setSavedOnly(true); goTo("jobs"); }} progress={progress} savedJobs={savedJobs.length} profile={profile} suggestedLessons={publishedLessonCount} />}
        {section === "jobs" && <JobsSection filteredJobs={filteredJobs} jobFilter={jobFilter} setJobFilter={setJobFilter} jobSearch={jobSearch} setJobSearch={setJobSearch} savedJobs={savedJobs} toggleSavedJob={toggleSavedJob} savedOnly={savedOnly} setSavedOnly={setSavedOnly} />}
        {section === "learn" && <LearnSection courses={(courseCatalogQuery.data ?? []) as CatalogCourse[]} completedLessons={completedCourseLessons} onToggle={toggleCourseLesson} loading={courseCatalogQuery.isLoading} />}
        {section === "languages" && <LanguagesSection completedLessons={completedLanguageLessons} achievements={languageAchievements} onToggle={toggleLanguageLesson} onPassExam={passFinalExam} onDownloadCertificate={downloadCertificate} />}
        {section === "cv" && <CvSection cv={cv} setCv={setCv} skills={profile.skills} onDownload={downloadCv} />}
        {section === "profile" && <ProfileSection profile={profile} setProfile={setProfile} editing={profileEditing} setEditing={setProfileEditing} onSave={() => { setProfileEditing(false); toast.success("تسجلات التغييرات ديالك"); }} />}
      </main>

      <footer className="mobile-nav" aria-label="تنقل الهاتف">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => goTo(item.id)} className={section === item.id ? "active" : ""}><Icon size={19} /><span>{item.label}</span></button>;
        })}
      </footer>

      {selectedLesson && <LessonModal lesson={selectedLesson} completed={completedLessons.includes(selectedLesson.id)} onClose={() => setSelectedLesson(null)} onToggle={() => toggleLesson(selectedLesson)} />}
    </div>
  );
}

function HomeSection({ goTo, onOpenSaved, progress, savedJobs, profile, suggestedLessons }: { goTo: (section: Section) => void; onOpenSaved: () => void; progress: number; savedJobs: number; profile: typeof initialProfile; suggestedLessons: number }) {
  return <>
    <section className="hero-card">
      <div className="hero-copy">
        <h1>المستقبل ديالك<br /><em>كيستناك.</em></h1>
        <p>تعلم مهارة جديدة، وجد CV ديالك، ولقا الفرصة اللي غادي تطلع بيك للقدّام.</p>
        <div className="hero-buttons"><button className="primary-cta" onClick={() => goTo("jobs")}>شوف الفرص <ArrowLeft size={18} /></button><button className="ghost-cta" onClick={() => goTo("learn")}>بدا تتعلم <Play size={16} fill="currentColor" /></button></div>
        <div className="hero-trust"><UsersRound size={16} /><span>أكثر من <strong>2,400</strong> شاب بداو المسار ديالهم معنا</span></div>
      </div>
      <div className="hero-visual" aria-label="مسار فرصتي">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="floating-card cloud-card"><Cloud size={23} /><span>Cloud<br /><strong>Skills</strong></span></div>
        <div className="floating-card cv-mini"><FileText size={20} /><span>CV واجد<br /><strong>{progress}% مكمل</strong></span></div>
        <div className="hero-orb"><Sparkles size={34} /><span>فرصتي</span></div>
        <div className="floating-card goal-card"><Target size={18} /><span>خطوة بخطوة</span></div>
      </div>
    </section>

    <section className="section-heading"><div><p className="section-kicker">خليها عادة يومية</p><h2>شنو بغيتي تدير اليوم؟</h2></div><button className="text-link" onClick={() => goTo("profile")}>شوف الملف ديالي <ChevronLeft size={16} /></button></section>
    <section className="action-grid">
      <ActionCard icon={<BriefcaseBusiness />} tone="green" title="قلب على فرصة" text="فرص عمل وتداريب مختارة للشباب" action="شوف الفرص" onClick={() => goTo("jobs")} badge="12 فرصة جديدة" />
      <ActionCard icon={<GraduationCap />} tone="purple" title="طوّر مهاراتك" text="كورسات قصيرة ومجانية فمجالات مطلوبة" action="تعلّم دابا" onClick={() => goTo("learn")} badge={`${suggestedLessons} دروس مقترحة`} />
      <ActionCard icon={<FileText />} tone="orange" title="وجد CV ديالك" text="سيرة ذاتية احترافية فـ 5 دقايق" action="صايب CV" onClick={() => goTo("cv")} badge={progress >= 50 ? "قريب واجد" : "جديد عليك"} />
    </section>

    <section className="dashboard-grid">
      <div className="section-panel progress-panel"><div className="panel-heading"><div><p className="section-kicker">المسار ديالك</p><h2>Cloud & DevOps</h2></div><span className="panel-icon mint-icon"><Cloud size={20} /></span></div><div className="progress-row"><div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><div><strong>{progress}%</strong><small>مكمل</small></div></div><div><h3>كل درس كيقربك للفرصة</h3><p>اختار الدرس اللي كيطابق المهارة المطلوبة فالإعلان اللي عجبك.</p><button className="text-link" onClick={() => goTo("learn")}>كمل المسار <ArrowLeft size={15} /></button></div></div><div className="skill-line"><span>المهارات المكتسبة</span><div><span className="skill-pill">Git</span><span className="skill-pill">Linux</span><span className="skill-pill">+2</span></div></div></div>
      <div className="section-panel saved-panel"><div className="panel-heading"><div><p className="section-kicker">مراجعة سريعة</p><h2>الفرص المحفوظة</h2></div><span className="panel-icon yellow-icon"><Bookmark size={19} /></span></div><div className="saved-empty"><div className="saved-number">{savedJobs}</div><p>{savedJobs ? "فرص محفوظة كتسناك" : "باقي ما حفظتي حتى فرصة"}</p><button className="outline-button" onClick={savedJobs ? onOpenSaved : () => goTo("jobs")}>{savedJobs ? "شوف المحفوظات" : "اكتشف الفرص"} <ArrowLeft size={15} /></button></div></div>
    </section>

    <section className="cloud-banner"><div className="cloud-banner-icon"><Zap size={22} fill="currentColor" /></div><div><p className="section-kicker">مسار مقترح ليك</p><h2>دخل لعالم Cloud بثقة</h2><p>خطة عملية من الأساسيات حتى أول مشروع تقدر تحطو فـ CV ديالك.</p></div><button onClick={() => goTo("learn")} className="banner-button">بدا المسار <ArrowLeft size={16} /></button></section>
  </>;
}

function ActionCard({ icon, tone, title, text, action, onClick, badge }: { icon: React.ReactNode; tone: string; title: string; text: string; action: string; onClick: () => void; badge: string }) {
  return <article className={`action-card ${tone}`}><div className="card-top"><span className="action-icon">{icon}</span><span className="card-badge">{badge}</span></div><h3>{title}</h3><p>{text}</p><button onClick={onClick}>{action} <ArrowLeft size={15} /></button></article>;
}

function JobsSection({ filteredJobs, jobFilter, setJobFilter, jobSearch, setJobSearch, savedJobs, toggleSavedJob, savedOnly, setSavedOnly }: { filteredJobs: typeof opportunities; jobFilter: string; setJobFilter: (value: string) => void; jobSearch: string; setJobSearch: (value: string) => void; savedJobs: string[]; toggleSavedJob: (id: string) => void; savedOnly: boolean; setSavedOnly: (value: boolean) => void }) {
  return <section className="content-section"><div className="page-heading"><div><p className="section-kicker">الخطوة الجاية</p><h1>{savedOnly ? "الفرص اللي حفظتي" : "الفرص اللي كتستاهل تشوف"}</h1><p>مختارينها باش تلقا بداية مناسبة للمهارات ديالك.</p></div><span className="heading-illustration"><Rocket size={30} /></span></div><div className="jobs-toolbar"><div className="search-box"><Search size={18} /><input value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder="قلب على فرصة، شركة، أو مهارة..." /></div><div className="filter-row">{["الكل", "وظيفة", "تدريب", "Cloud", "DevOps"].map((filter) => <button key={filter} className={jobFilter === filter ? "selected" : ""} onClick={() => setJobFilter(filter)}>{filter}</button>)}<button className={savedOnly ? "selected" : ""} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={13} /> محفوظة</button></div></div><div className="jobs-list">{filteredJobs.map((job) => <article className={`job-card ${job.featured ? "featured-job" : ""}`} key={job.id}><div className="job-logo"><Cloud size={20} /></div><div className="job-main"><div className="job-title-row"><div><span className="job-type">{job.type} · {job.field}</span><h2>{job.title}</h2><p className="job-company">{job.company} <span>•</span> <MapPin size={14} /> {job.location}</p></div><button className={`save-button ${savedJobs.includes(job.id) ? "saved" : ""}`} onClick={() => toggleSavedJob(job.id)} aria-label="حفظ الفرصة"><Bookmark size={18} fill={savedJobs.includes(job.id) ? "currentColor" : "none"} /></button></div><p className="job-description">{job.description}</p><div className="tag-row">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}<span className="deadline">{job.deadline}</span></div></div><button className="apply-button" onClick={() => toast.success("غادي نمشيو لصفحة التقديم منين نربطو الروابط")} >شوف التفاصيل <ArrowLeft size={16} /></button></article>)}</div>{filteredJobs.length === 0 && <div className="empty-state"><Search size={28} /><h3>{savedOnly ? "ما حفظتي حتى فرصة بهاد الفلاتر" : "ما لقيناش فرص بهاد البحث"}</h3><p>جرّب كلمة أخرى أو رجّع الفلتر للكل.</p></div>}</section>;
}

function LearnSection({ courses, completedLessons, onToggle, loading }: { courses: CatalogCourse[]; completedLessons: number[]; onToggle: (lessonId: number) => void; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [field, setField] = useState("الكل");
  const [level, setLevel] = useState("الكل");
  const [language, setLanguage] = useState("الكل");
  const [duration, setDuration] = useState("الكل");
  const [activeCourse, setActiveCourse] = useState<CatalogCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<CatalogLesson | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredCourses = courses.filter((course) => {
    const haystack = `${course.title} ${course.description} ${course.field}`.toLowerCase();
    const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase());
    const matchesField = field === "الكل" || course.field === field;
    const matchesLevel = level === "الكل" || course.level === level;
    const matchesLanguage = language === "الكل" || course.contentLanguage === language;
    const matchesDuration = duration === "الكل" || (duration === "قصير" ? course.durationMinutes <= 60 : course.durationMinutes > 60);
    return matchesSearch && matchesField && matchesLevel && matchesLanguage && matchesDuration;
  });
  const continueLesson = courses.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson }))).find(({ lesson }) => !completedLessons.includes(lesson.id));
  const totalCompleted = completedLessons.length;

  if (activeCourse && activeLesson) {
    return <CourseLessonView course={activeCourse} lesson={activeLesson} completed={completedLessons.includes(activeLesson.id)} onToggle={onToggle} onBack={() => setActiveLesson(null)} onPrevious={() => setActiveLesson(activeCourse.lessons[activeLesson.orderIndex - 2] ?? null)} onNext={() => setActiveLesson(activeCourse.lessons[activeLesson.orderIndex] ?? null)} />;
  }
  if (activeCourse) {
    const courseProgress = Math.round((activeCourse.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length / activeCourse.lessons.length) * 100);
    return <CourseDetailView course={activeCourse} completedLessons={completedLessons} progress={courseProgress} onBack={() => setActiveCourse(null)} onOpenLesson={setActiveLesson} />;
  }

  return <section className="content-section course-library"><div className="page-heading learn-heading"><div><p className="section-kicker">تعلم بلا تعقيد</p><h1>مكتبة الكورسات</h1><p>اختار مجال، تعلم خطوة بخطوة، وبني مهارة كتفتح لك فرصة جديدة.</p></div><div className="learn-progress"><span>{totalCompleted}</span><small>دروس مكملة</small><div className="line-progress"><i style={{ width: `${Math.min(100, (totalCompleted / Math.max(1, courses.reduce((sum, course) => sum + course.lessons.length, 0))) * 100)}%` }} /></div></div></div>
    {continueLesson && <button className="continue-course-card" onClick={() => { setActiveCourse(continueLesson.course); setActiveLesson(continueLesson.lesson); }}><span className="continue-icon"><Play size={18} fill="currentColor" /></span><span><small>كمّل منين وقفتي</small><strong>{continueLesson.course.title}</strong><em>الدرس {continueLesson.lesson.orderIndex}: {continueLesson.lesson.title}</em></span><ArrowLeft size={19} /></button>}
    <div className="course-filters"><div className="course-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="قلب على كورس أو مهارة..." /></div><select value={field} onChange={(event) => setField(event.target.value)}><option value="الكل">جميع المجالات</option>{Array.from(new Set(courses.map((course) => course.field))).map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="الكل">جميع المستويات</option><option value="مبتدئ">مبتدئ</option><option value="متوسط">متوسط</option></select><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="الكل">جميع اللغات</option>{Array.from(new Set(courses.map((course) => course.contentLanguage))).map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="الكل">أي مدة</option><option value="قصير">أقل من ساعة</option><option value="طويل">أكثر من ساعة</option></select></div>
    <div className="course-section-heading"><div><span className="section-kicker">مقترحة ليك</span><h2>للمبتدئين</h2></div><span>{filteredCourses.length} كورسات</span></div>
    {loading ? <div className="course-empty">كنوجدو الكورسات ديالك...</div> : filteredCourses.length === 0 ? <div className="course-empty"><Search size={25} /><h3>ما لقيناش كورسات بهاد البحث</h3><p>جرب كلمة أخرى أو رجع الفلاتر.</p></div> : <div className="course-grid">{filteredCourses.slice(0, visibleCount).map((course) => <CourseCard key={course.id} course={course} completedLessons={completedLessons} onOpen={() => setActiveCourse(course)} />)}</div>}
    {filteredCourses.length > visibleCount && <button className="load-more-courses" onClick={() => setVisibleCount((count) => count + 6)}>عرض المزيد <ArrowLeft size={15} /></button>}
    <div className="course-section-heading all-courses-heading"><div><span className="section-kicker">المكتبة ديالك</span><h2>جميع الكورسات</h2></div><span>محتوى أصلي وبالدارجة</span></div>
  </section>;
}

function CourseCard({ course, completedLessons, onOpen }: { course: CatalogCourse; completedLessons: number[]; onOpen: () => void }) {
  const completed = course.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const progress = Math.round((completed / course.lessons.length) * 100);
  return <article className="course-card"><div className="course-card-top"><span className="course-field">{course.field}</span><span className="course-level">{course.level}</span></div><div className="course-card-icon"><Code2 size={22} /></div><h2>{course.title}</h2><p>{course.description}</p><div className="course-card-meta"><span>{course.contentLanguage}</span><span>{course.lessons.length} دروس</span><span>{course.durationMinutes} دقيقة</span></div><div className="course-card-progress"><div><span>{progress}% مكمل</span><small>{completed}/{course.lessons.length}</small></div><div className="line-progress"><i style={{ width: `${progress}%` }} /></div></div><button className="course-card-button" onClick={onOpen}>{progress ? "كمّل الكورس" : "بدا الكورس"}<ArrowLeft size={15} /></button></article>;
}

function CourseDetailView({ course, completedLessons, progress, onBack, onOpenLesson }: { course: CatalogCourse; completedLessons: number[]; progress: number; onBack: () => void; onOpenLesson: (lesson: CatalogLesson) => void }) {
  return <section className="content-section course-detail"><button className="back-course-button" onClick={onBack}><ArrowUpLeft size={17} /> رجع للمكتبة</button><div className="course-detail-hero"><span className="course-field">{course.field}</span><h1>{course.title}</h1><p>{course.description}</p><div className="course-detail-stats"><span>{course.level}</span><span>{course.contentLanguage}</span><span>{course.lessons.length} دروس</span><span>{course.durationMinutes} دقيقة</span></div><div className="course-detail-progress"><div><strong>{progress}%</strong><span>من الكورس مكمل</span></div><div className="line-progress"><i style={{ width: `${progress}%` }} /></div></div></div><div className="course-detail-heading"><div><span className="section-kicker">المسار ديالك</span><h2>الدروس ديال الكورس</h2></div><span>{course.lessons.length} دروس</span></div><div className="course-lesson-list">{course.lessons.map((lesson) => <button key={lesson.id} className={`course-lesson-row ${completedLessons.includes(lesson.id) ? "completed" : ""}`} onClick={() => onOpenLesson(lesson)}><span className="course-lesson-number">{completedLessons.includes(lesson.id) ? <Check size={16} /> : lesson.orderIndex}</span><span><strong>{lesson.title}</strong><small>{lesson.durationMinutes} دقيقة · {completedLessons.includes(lesson.id) ? "مكمل" : "مازال"}</small></span><ArrowLeft size={17} /></button>)}</div></section>;
}

function CourseLessonView({ course, lesson, completed, onToggle, onBack, onPrevious, onNext }: { course: CatalogCourse; lesson: CatalogLesson; completed: boolean; onToggle: (lessonId: number) => void; onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  return <section className="content-section course-lesson-page"><button className="back-course-button" onClick={onBack}><ArrowUpLeft size={17} /> رجع للكورس</button><div className="lesson-breadcrumb">{course.title} <span>·</span> الدرس {lesson.orderIndex} من {course.lessons.length}</div><article className="course-lesson-content"><div className="course-lesson-header"><span className="course-field">{course.field}</span><h1>{lesson.title}</h1><span className="lesson-duration"><Play size={13} /> {lesson.durationMinutes} دقيقة</span></div><div className="lesson-info-grid"><div><strong>أهداف التعلم</strong><p>{lesson.objectives}</p></div><div><strong>المتطلبات السابقة</strong><p>{lesson.prerequisites}</p></div></div><div className="lesson-reading"><h2>الشرح</h2><p>{lesson.explanation}</p><div className="lesson-code-example"><small>مثال تطبيقي</small><pre>{lesson.example}</pre></div><div className="lesson-practice"><strong>دورك دابا</strong><p>{lesson.exercise}</p></div></div><div className="lesson-assessment"><div className="course-detail-heading"><div><span className="section-kicker">راجع فهمك</span><h2>أسئلة سريعة</h2></div><span>{lesson.questions.length} أسئلة</span></div>{lesson.questions.map((question, index) => { const answer = answers[index]; const isSubmitted = submitted[index]; const correct = answer === question.answer; return <div className="course-question" key={question.question}><strong>{index + 1}. {question.question}</strong><div className="course-answer-options">{question.options.map((option, optionIndex) => <button key={option} className={isSubmitted && optionIndex === question.answer ? "correct" : isSubmitted && answer === optionIndex ? "wrong" : answer === optionIndex ? "selected" : ""} onClick={() => !isSubmitted && setAnswers((current) => ({ ...current, [index]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{isSubmitted && <p className={`answer-explanation ${correct ? "right" : "wrong-text"}`}>{correct ? "صحيح! " : "الجواب الصحيح: "}{question.explanation}</p>}<button className="check-answer" disabled={answer === undefined || isSubmitted} onClick={() => setSubmitted((current) => ({ ...current, [index]: true }))}>{isSubmitted ? "تصحح السؤال" : "تحقق من الجواب"}</button></div>; })}</div><button className={`complete-lesson-button ${completed ? "done" : ""}`} onClick={() => onToggle(lesson.id)}>{completed ? <><Check size={18} /> الدرس مكتمل</> : <>كمّلت الدرس <Check size={18} /></>}</button></article><div className="lesson-navigation"><button onClick={onPrevious} disabled={lesson.orderIndex === 1}><ArrowUpLeft size={16} /> الدرس السابق</button><button onClick={onNext} disabled={lesson.orderIndex === course.lessons.length}>الدرس التالي <ArrowLeft size={16} /></button></div></section>;
}

function LanguagesSection({ completedLessons, achievements, onToggle, onPassExam, onDownloadCertificate }: { completedLessons: string[]; achievements: LanguageAchievement[]; onToggle: (id: string) => void; onPassExam: (languageId: string, score: number) => void; onDownloadCertificate: (languageId: string, score: number) => void }) {
  const [selectedQuiz, setSelectedQuiz] = useState<{ courseName: string; lesson: LanguageLesson; lessonId: string } | null>(null);
  const [selectedExam, setSelectedExam] = useState<{ languageId: string; languageName: string } | null>(null);
  const totalLessons = languageCourses.reduce((total, course) => total + course.lessons.length, 0);
  const overallProgress = Math.round((completedLessons.length / totalLessons) * 100);

  return <section className="content-section language-section">
    <div className="page-heading language-heading"><div><p className="section-kicker">تعلم لغة كتفتح لك أبواب جديدة</p><h1>اللغات ديالك، فرص أكثر</h1><p>دروس قصيرة وعملية باش تهضر وتكتب بثقة فالدراسة والخدمة.</p></div><div className="language-total"><Languages size={25} /><strong>{overallProgress}%</strong><small>من المسار مكمل</small></div></div>
    <div className="language-hero"><div className="language-hero-icon"><Languages size={31} /></div><div><span className="mini-label">مسار التواصل المهني</span><h2>تعلم، طبق، وجرب راسك</h2><p>كل درس فيه تمرين صغير وQuiz، ومن بعد اختبار نهائي شامل.</p></div><div className="language-stat"><strong>{totalLessons}</strong><span>دروس مع Quiz</span></div></div>
    <div className="language-courses">{languageCourses.map((course) => {
      const courseLessonsDone = course.lessons.filter((_, index) => completedLessons.includes(`${course.id}-${index}`)).length;
      const courseComplete = courseLessonsDone === course.lessons.length;
      const achievement = achievements.find((item) => item.languageId === course.id);
      return <article className="language-course" key={course.id}><div className={`language-flag ${course.tone}`}>{course.flag}</div><div className="language-course-head"><div><span className="lesson-category">{course.level}</span><h2>{course.name}</h2><p>{course.native}</p></div><span className="language-percent">{Math.round((courseLessonsDone / course.lessons.length) * 100)}%</span></div><div className="line-progress"><i style={{ width: `${(courseLessonsDone / course.lessons.length) * 100}%` }} /></div><div className="language-course-meta"><span>{courseLessonsDone}/{course.lessons.length} دروس</span><span>{achievement ? `Badge ${achievement.score}%` : "تمرين + Quiz"}</span></div><div className="language-lesson-list">{course.lessons.map((lesson, index) => { const lessonId = `${course.id}-${index}`; const done = completedLessons.includes(lessonId); return <button className={done ? "done" : ""} key={lessonId} onClick={() => setSelectedQuiz({ courseName: course.name, lesson, lessonId })}><span className="language-lesson-check">{done ? <Check size={13} /> : index + 1}</span><span>{lesson.title}</span><ArrowLeft size={14} /></button>; })}</div><button className="language-start" disabled={!courseComplete} onClick={() => setSelectedExam({ languageId: course.id, languageName: course.name })}>{achievement ? "شوف الشهادة" : courseComplete ? "دير الاختبار النهائي" : "كمل الدروس أولاً"}<Award size={15} /></button>{achievement && <button className="certificate-link" onClick={() => onDownloadCertificate(course.id, achievement.score)}><Download size={13} /> هبط الشهادة الرقمية</button>}</article>;
    })}</div>
    {achievements.length > 0 && <div className="achievement-panel"><div><span className="section-kicker">الإنجازات ديالك</span><h2>Badges والشواهد</h2><p>كل نجاح كيبقى محفوظ فالحساب ديالك.</p></div><div className="achievement-list">{achievements.map((achievement) => { const course = languageCourses.find((item) => item.id === achievement.languageId); return <div className="achievement-badge" key={achievement.languageId}><span className="badge-icon"><Award size={20} /></span><div><strong>{course?.name} Master</strong><small>نجحتي بـ {achievement.score}%</small></div></div>; })}</div></div>}
    <div className="language-tip"><Sparkles size={19} /><div><strong>نصيحة فرصتي</strong><p>كمل دروس اللغة الثلاثة، جاوب على الـQuiz، ومن بعد دوز الاختبار النهائي باش تحصل على Badge وشهادة رقمية.</p></div></div>
    {selectedQuiz && <LanguageQuizModal courseName={selectedQuiz.courseName} lessonId={selectedQuiz.lessonId} lesson={selectedQuiz.lesson} completed={completedLessons.includes(selectedQuiz.lessonId)} onClose={() => setSelectedQuiz(null)} onComplete={() => onToggle(selectedQuiz.lessonId)} />}
    {selectedExam && <LanguageExamModal languageId={selectedExam.languageId} languageName={selectedExam.languageName} onClose={() => setSelectedExam(null)} onPass={(score) => onPassExam(selectedExam.languageId, score)} onDownloadCertificate={onDownloadCertificate} />}
  </section>;
}

function LanguageExamModal({ languageId, languageName, onClose, onPass, onDownloadCertificate }: { languageId: string; languageName: string; onClose: () => void; onPass: (score: number) => void; onDownloadCertificate: (languageId: string, score: number) => void }) {
  const questions = finalExamQuestions[languageId] ?? [];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = Math.round((questions.filter((question, index) => answers[index] === question.answer).length / questions.length) * 100);
  const passed = score >= 70;
  const submit = () => { setSubmitted(true); if (passed) onPass(score); };
  const retry = () => { setAnswers({}); setSubmitted(false); };

  return <div className="modal-backdrop" onClick={onClose}><div className="language-exam-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={19} /></button><span className="lesson-category">اختبار نهائي شامل</span><h2>{languageName} Mastery Exam</h2><p className="modal-lead">5 أسئلة من جميع الدروس · النجاح من 70%</p><div className="exam-question-list">{questions.map((question, questionIndex) => <div className="exam-question" key={question.question}><strong>{questionIndex + 1}. {question.question}</strong><div className="quiz-options">{question.options.map((option, optionIndex) => <button key={option} className={submitted && optionIndex === question.answer ? "correct" : submitted && answers[questionIndex] === optionIndex ? "wrong" : answers[questionIndex] === optionIndex ? "selected" : ""} onClick={() => !submitted && setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div></div>)}</div>{submitted && <div className={`exam-result ${passed ? "passed" : "failed"}`}><Award size={24} /><div><strong>{passed ? `مبروك! نجحتي بـ ${score}%` : `النقطة ديالك ${score}%`}</strong><p>{passed ? "تحصلتي على Badge وشهادة رقمية." : "خاصك 70% على الأقل. راجع الدروس وعاود المحاولة."}</p></div></div>}<div className="quiz-actions">{!submitted && <button className="primary-cta" disabled={Object.keys(answers).length !== questions.length} onClick={submit}>صحح الاختبار <Check size={16} /></button>}{submitted && passed && <button className="primary-cta" onClick={() => onDownloadCertificate(languageId, score)}><Download size={16} /> هبط الشهادة</button>}{submitted && !passed && <button className="primary-cta" onClick={retry}>عاود الاختبار</button>}<button className="ghost-cta" onClick={onClose}>إغلاق</button></div></div></div>;
}

function LanguageQuizModal({ courseName, lessonId, lesson, completed, onClose, onComplete }: { courseName: string; lessonId: string; lesson: LanguageLesson; completed: boolean; onClose: () => void; onComplete: () => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selectedAnswer === lesson.answer;
  const content = languageLessonContent[lessonId];
  const submit = () => { if (submitted && !correct) { setSubmitted(false); setSelectedAnswer(null); return; } setSubmitted(true); if (correct && !completed) onComplete(); };

  return <div className="modal-backdrop" onClick={onClose}><div className="language-quiz-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={19} /></button><span className="lesson-category">{courseName}</span><h2>{lesson.title}</h2>{content && <div className="lesson-content"><div className="lesson-objective"><strong>هدف الدرس</strong><p>{content.objective}</p></div><p className="lesson-explanation">{content.explanation}</p><div className="lesson-vocabulary"><strong>كلمات مهمة</strong><div>{content.vocabulary.map((word) => <span key={word}>{word}</span>)}</div></div><div className="lesson-example"><strong>مثال عملي</strong><p>{content.example}</p></div></div>}<div className="language-exercise"><strong>طبق راسك</strong><p>{lesson.exercise}</p></div><div className="quiz-box"><span className="quiz-label">Quiz</span><h3>{lesson.question}</h3><div className="quiz-options">{lesson.options.map((option, index) => <button className={submitted && index === lesson.answer ? "correct" : submitted && selectedAnswer === index ? "wrong" : selectedAnswer === index ? "selected" : ""} key={option} onClick={() => !submitted && setSelectedAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div></div>{submitted && <p className={`quiz-result ${correct ? "success" : "error"}`}>{correct ? "ممتاز! الجواب صحيح وتكمل الدرس." : "قريب! راجع الشرح وحاول مرة أخرى."}</p>}<div className="quiz-actions"><button className="primary-cta" disabled={selectedAnswer === null || (submitted && correct)} onClick={submit}>{submitted ? (correct ? "الدرس مكتمل" : "عاود المحاولة") : "تحقق من الجواب"}<Check size={16} /></button><button className="ghost-cta" onClick={onClose}>من بعد</button></div></div></div>;
}

function CvSection({ cv, setCv, skills, onDownload }: { cv: typeof initialCv; setCv: React.Dispatch<React.SetStateAction<typeof initialCv>>; skills: string; onDownload: () => void }) {
  return <section className="content-section"><div className="page-heading"><div><p className="section-kicker">خدم على راسك</p><h1>CV ديالك واجد فـ دقائق</h1><p>دخل المعلومات ديالك وشوف النتيجة كتبدل قدام عينيك.</p></div><button className="outline-button" onClick={onDownload}><Download size={16} /> هبط CV</button></div><div className="cv-workspace"><div className="form-panel"><div className="panel-heading"><div><p className="section-kicker">المعلومات الأساسية</p><h2>شنو بغيت الناس يعرفو عليك؟</h2></div><Pencil size={19} /></div><label>الاسم الكامل<input value={cv.name} onChange={(event) => setCv((current) => ({ ...current, name: event.target.value }))} /></label><label>العنوان المهني<input value={cv.headline} onChange={(event) => setCv((current) => ({ ...current, headline: event.target.value }))} /></label><div className="two-fields"><label>الإيميل<input value={cv.email} onChange={(event) => setCv((current) => ({ ...current, email: event.target.value }))} /></label><label>المدينة<input value={cv.city} onChange={(event) => setCv((current) => ({ ...current, city: event.target.value }))} /></label></div><label>نبذة قصيرة<textarea rows={4} value={cv.summary} onChange={(event) => setCv((current) => ({ ...current, summary: event.target.value }))} /></label><label>التجربة والمشاريع<textarea rows={4} value={cv.experience} onChange={(event) => setCv((current) => ({ ...current, experience: event.target.value }))} /></label><p className="form-hint"><Sparkles size={14} /> المهارات جايين من الملف الشخصي: {skills}</p></div><div className="cv-preview-wrap"><div className="preview-label"><span>المعاينة المباشرة</span><span className="preview-status"><Check size={13} /> محفوظة مؤقتاً</span></div><div className="cv-paper"><div className="cv-paper-head"><div><h2>{cv.name || "الاسم ديالك"}</h2><p>{cv.headline || "العنوان المهني ديالك"}</p></div><div className="cv-avatar">{(cv.name || "ف").charAt(0)}</div></div><p className="cv-contact">{cv.email} <span>•</span> {cv.city}</p><CvBlock title="نبذة" text={cv.summary} /><CvBlock title="التجربة والمشاريع" text={cv.experience} /><CvBlock title="المهارات" text={skills} /></div></div></div></section>;
}

function CvBlock({ title, text }: { title: string; text: string }) { return <div className="cv-block"><h3>{title}</h3><p>{text || "زيد المعلومات ديالك هنا..."}</p></div>; }

function ProfileSection({ profile, setProfile, editing, setEditing, onSave }: { profile: typeof initialProfile; setProfile: React.Dispatch<React.SetStateAction<typeof initialProfile>>; editing: boolean; setEditing: (value: boolean) => void; onSave: () => void }) {
  return <section className="content-section"><div className="page-heading"><div><p className="section-kicker">خلي الناس يعرفوك</p><h1>الملف الشخصي</h1><p>كلما كان الملف واضح، كلما لقيتي فرص مناسبة أكثر.</p></div>{editing ? <button className="primary-cta" onClick={onSave}><Check size={16} /> حفظ التغييرات</button> : <button className="outline-button" onClick={() => setEditing(true)}><Pencil size={16} /> تعديل الملف</button>}</div><div className="profile-layout"><div className="profile-card"><div className="profile-cover" /><div className="profile-avatar">{profile.name.charAt(0)}</div><div className="profile-card-body"><h2>{profile.name}</h2><p>{profile.role}</p><span><MapPin size={14} /> {profile.city}</span><div className="profile-stats"><div><strong>3</strong><small>دروس مكملة</small></div><div><strong>2</strong><small>مهارات مضافة</small></div><div><strong>78%</strong><small>اكتمال الملف</small></div></div></div></div><div className="profile-form form-panel"><div className="panel-heading"><div><p className="section-kicker">المعلومات ديالك</p><h2>خلي ملفك ديما محدث</h2></div><UserRound size={20} /></div><label>الاسم الكامل<input disabled={!editing} value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></label><label>العنوان المهني<input disabled={!editing} value={profile.role} onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))} /></label><div className="two-fields"><label>المدينة<input disabled={!editing} value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} /></label><label>الإيميل<input disabled={!editing} value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} /></label></div><label>نبذة عليك<textarea disabled={!editing} rows={4} value={profile.about} onChange={(event) => setProfile((current) => ({ ...current, about: event.target.value }))} /></label><label>المهارات <span className="label-help">فصل بينهم بفاصلة</span><input disabled={!editing} value={profile.skills} onChange={(event) => setProfile((current) => ({ ...current, skills: event.target.value }))} /></label>{!editing && <div className="profile-tip"><Sparkles size={17} /><p><strong>نصيحة صغيرة:</strong> زيد مشاريع Cloud اللي خدمتي عليهم باش يبان الملف ديالك أكثر.</p></div>}</div></div></section>;
}

function LessonModal({ lesson, completed, onClose, onToggle }: { lesson: Lesson; completed: boolean; onClose: () => void; onToggle: () => void }) {
  const Icon = lesson.icon;
  return <div className="modal-backdrop" onClick={onClose}><div className="lesson-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={19} /></button><div className={`lesson-icon ${lesson.tone}`}><Icon size={24} /></div><span className="lesson-category">{lesson.category}</span><h2>{lesson.title}</h2><p className="modal-lead">فهاد الدرس غادي تفهم الفكرة بلا مصطلحات معقدة، وتخرج بخطوة عملية تقدر تجربها اليوم.</p><p className="modal-fit">هاد الدرس مفيد خصوصاً لـ: <strong>{lesson.fit}</strong></p><div className="lesson-outline"><div><Check size={16} /><span>فهم الأساسيات فـ 5 دقايق</span></div><div><Check size={16} /><span>مثال عملي قريب لواقع الخدمة</span></div><div><Check size={16} /><span>خطوة صغيرة باش تكمل المسار</span></div></div><div className="modal-actions"><button className="primary-cta" onClick={onToggle}>{completed ? "رجع الدرس غير مكتمل" : "سجل الدرس كمكتمل"} <Check size={16} /></button><button className="ghost-cta" onClick={onClose}>من بعد</button></div></div></div>;
}
