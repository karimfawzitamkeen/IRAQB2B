/** Arabic ceremony film — Digital Certificate of Origin platform launch (STORYBOARD-COO-AR.md). */
export const AW = 1080;
export const AH = 1920;
export const ACX = 540;
/** 112 s at 30 fps. */
export const ADUR = 3360;
/** Critical zone for a portrait display read at ~4 m (same as the display-screen CoO film). */
export const ASAFE = {left: 80, right: 1000, top: 140, bottom: 1780};
/** 16:9 ceremony-screen master. */
export const ALW = 1920;
export const ALH = 1080;
export const ALSAFE = {left: 100, right: 1820, top: 60, bottom: 1020};

export const AF = {
	/** ceremonial naskh — patronage, names */
	naskh: '"Amiri", serif',
	/** display headings */
	display: '"Cairo", sans-serif',
	/** body lines */
	body: '"IBM Plex Sans Arabic", sans-serif',
};

/** Scene windows. */
export const AT = {
	patronage: [0, 250],
	launch: [250, 490],
	beneficiary: [490, 610],
	executor: [610, 780],
	shift: [780, 1020],
	overview: [1020, 1200],
	step1: [1200, 1400],
	step2: [1400, 1580],
	step3: [1580, 1760],
	step4: [1760, 1990],
	step5: [1990, 2180],
	step6: [2180, 2400],
	benefits: [2400, 3060],
	close: [3060, 3360],
} as const;

/** The official texts, exactly as supplied. */
export const TXT = {
	patron1: 'برعاية',
	patron2: 'معالي وزير التجارة',
	patron3: 'الدكتور مصطفى العاني',
	launch1: 'إطلاق',
	launch2: 'المنصة الرقمية',
	launch3: 'لتصديق شهادة المنشأ',
	beneficiaryLabel: 'الجهة المستفيدة',
	beneficiary: ['دائرة العلاقات', 'الخارجية التجارية'],
	executorLabel: 'الجهة المنفذة',
	executor: ['الشركة العامة للمعارض', 'والخدمات التجارية العراقية'],
	partnerLabel: 'بالشراكة مع',
	partner: 'تحالف السهد – التمكين',
};

export const STEPS = [
	{n: '١', title: 'تقديم الطلب', long: 'تقديم الطلب إلكترونياً'},
	{n: '٢', title: 'تدقيق المستندات', long: 'تدقيق المستندات'},
	{n: '٣', title: 'مراجعة الملحق التجاري', long: 'مراجعة الملحق التجاري'},
	{n: '٤', title: 'استيفاء الرسم السيادي', long: 'استيفاء الرسم السيادي'},
	{n: '٥', title: 'التصديق الرقمي', long: 'التصديق الرقمي'},
	{n: '٦', title: 'إصدار الشهادة والتحقق', long: 'إصدار الشهادة والتحقق'},
];
