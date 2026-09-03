export interface PresetText {
  id: string;
  title: string;
  category: 'proverbs' | 'literature' | 'tech' | 'stories' | 'english';
  authorOrSource?: string;
  language: 'fa' | 'en';
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const PRESET_TEXTS: PresetText[] = [
  {
    id: 'lit-1',
    title: 'دیباچه گلستان سعدی',
    category: 'literature',
    authorOrSource: 'سعدی شیرازی',
    language: 'fa',
    difficulty: 'medium',
    text: 'منت خدای را عز و جل که طاعتش موجب قربت است و به شکر اندرش مزید نعمت. هر نفسی که فرو می‌رود ممد حیات است و چون برمی‌آید مفرح ذات؛ پس در هر نفسی دو نعمت موجود است و بر هر نعمتی شکری واجب. از دست و زبان که برآید، کز عهده شکرش به در آید؟',
  },
  {
    id: 'lit-2',
    title: 'سرآغاز مثنوی معنوی',
    category: 'literature',
    authorOrSource: 'مولانا جلال‌الدین بلخی',
    language: 'fa',
    difficulty: 'medium',
    text: 'بشنو این نی چون شکایت می‌کند، از جدایی‌ها حکایت می‌کند. کز نیستان تا مرا ببریده‌اند، در نفیرم مرد و زن نالیده‌اند. سینه خواهم شرحه شرحه از فراق، تا بگویم شرح درد اشتیاق. هر کسی کو دور ماند از اصل خویش، باز جوید روزگار وصل خویش.',
  },
  {
    id: 'lit-3',
    title: 'گفتار اندر ستایش خرد',
    category: 'literature',
    authorOrSource: 'حکیم ابوالقاسم فردوسی',
    language: 'fa',
    difficulty: 'hard',
    text: 'کنون ای خردمند وصف خرد، بدین جایگه گفتن اندرخورد. خرد بهتر از هر چه ایزد بداد، ستایش خرد را به از راه داد. خرد رهنمای و خرد دلگشای، خرد دست گیرد به هر دو سرای. ازو شادمانی و زویت غمیست، و زویت فزونی و زویت کمیست.',
  },
  {
    id: 'prov-1',
    title: 'ضرب‌المثل‌های اصیل فارسی',
    category: 'proverbs',
    authorOrSource: 'فرهنگ عامه',
    language: 'fa',
    difficulty: 'easy',
    text: 'بادآورده را باد می‌برد. جوینده یابنده است. قطره قطره جمع گردد وانگهی دریا شود. کار نیکو کردن از پر کردن است. تو نیکی می‌کن و در دجله انداز، که ایزد در بیابانت دهد باز. شاهنامه آخرش خوش است. پایان شب سیه سپید است.',
  },
  {
    id: 'tech-1',
    title: 'انقلاب هوش مصنوعی و عصر داده‌ها',
    category: 'tech',
    authorOrSource: 'دانشنامه فناوری',
    language: 'fa',
    difficulty: 'medium',
    text: 'هوش مصنوعی به عنوان یکی از شگفت‌انگیزترین دستاوردهای بشر، شیوه تعامل ما با جهان پیرامون را دگرگون ساخته است. از پردازش زبان طبیعی و بینایی ماشین گرفته تا یادگیری عمیق، الگوریتم‌ها توانسته‌اند با تحلیل حجم عظیمی از داده‌ها، الگوهایی را شناسایی کنند که پیش از این برای انسان غیرقابل تصور بود.',
  },
  {
    id: 'tech-2',
    title: 'اهمیت مهارت تایپ ده انگشتی',
    category: 'tech',
    authorOrSource: 'راهنمای مهارت‌های دیجیتال',
    language: 'fa',
    difficulty: 'easy',
    text: 'تایپ ده انگشتی یکی از پایه‌ای‌ترین و پربازده‌ترین مهارت‌های عصر اطلاعات است. وقتی شما بدون نگاه کردن به کلیدها تایپ می‌کنید، فاصله میان ذهن و نمایشگر به صفر می‌رسد. این مهارت نه تنها سرعت نوشتن شما را چند برابر می‌کند، بلکه خستگی چشم و مهره‌های گردن را به شکل چشمگیری کاهش می‌دهد.',
  },
  {
    id: 'en-1',
    title: 'The Art of Touch Typing',
    category: 'english',
    authorOrSource: 'Typing Guide',
    language: 'en',
    difficulty: 'easy',
    text: 'Touch typing is a method of typing without using the sense of sight to locate the keys. Specifically, a touch typist will know their location on the keyboard through muscle memory. By practicing daily and keeping your fingers on the home row, you unlock immense speed, rhythm, and mental clarity.',
  },
  {
    id: 'en-2',
    title: 'The Origin of Computing',
    category: 'english',
    authorOrSource: 'Computer Science History',
    language: 'en',
    difficulty: 'medium',
    text: 'The analytical engine was a proposed mechanical general-purpose computer designed by English mathematician Charles Babbage. It was first described in eighteen thirty-seven as the successor to Babbage difference engine. Ada Lovelace wrote the first algorithm intended to be executed on this magnificent machine.',
  },
];
