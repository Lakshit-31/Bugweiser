/**
 * Voice Parser Utility for Moolya AI Voice Assistant
 * Extracts numeric quantities, prices, and standard ISO dates from spoken Hindi/English transcripts.
 */

// Mapping of English, Hindi, and Hinglish words to numbers
const NUMBER_WORDS = {
  // English digits
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, lakh: 100000,
  
  // Hindi Devanagari
  'शून्य': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19,
  'बीस': 20, 'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25, 'छब्बीस': 26, 'सत्ताइस': 27, 'अट्ठाइस': 28, 'उनतीस': 29,
  'तीस': 30, 'चालीस': 40, 'पचास': 50, 'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
  'सौ': 100, 'हजार': 1000, 'हज़ार': 1000, 'लाख': 100000,

  // Hinglish
  ek: 1, do: 2, teen: 3, char: 4, paanch: 5, chah: 6, saat: 7, aath: 8, nau: 9, das: 10,
  gyarah: 11, barah: 12, terah: 13, chaudah: 14, pandrah: 15, bees: 20, baees: 22, pachas: 50,
  sau: 100, hazar: 1000
};

const NUMBER_WORDS_DAY = {
  // English words
  one: 1, first: 1, '1st': 1,
  two: 2, second: 2, '2nd': 2,
  three: 3, third: 3, '3rd': 3,
  four: 4, fourth: 4, '4th': 4,
  five: 5, fifth: 5, '5th': 5,
  six: 6, sixth: 6, '6th': 6,
  seven: 7, seventh: 7, '7th': 7,
  eight: 8, eighth: 8, '8th': 8,
  nine: 9, ninth: 9, '9th': 9,
  ten: 10, tenth: 10, '10th': 10,
  eleven: 11, eleventh: 11, '11th': 11,
  twelve: 12, twelfth: 12, '12th': 12,
  thirteen: 13, thirteenth: 13, '13th': 13,
  fourteen: 14, fourteenth: 14, '14th': 14,
  fifteen: 15, fifteenth: 15, '15th': 15,
  sixteen: 16, sixteenth: 16, '16th': 16,
  seventeen: 17, seventeenth: 17, '17th': 17,
  eighteen: 18, eighteenth: 18, '18th': 18,
  nineteen: 19, nineteenth: 19, '19th': 19,
  twenty: 20, twentieth: 20, '20th': 20,
  'twenty one': 21, 'twenty-one': 21, '21st': 21,
  'twenty two': 22, 'twenty-two': 22, '22nd': 22,
  'twenty three': 23, 'twenty-three': 23, '23rd': 23,
  'twenty four': 24, 'twenty-four': 24, '24th': 24,
  'twenty five': 25, 'twenty-five': 25, '25th': 25,
  'twenty six': 26, 'twenty-six': 26, '26th': 26,
  'twenty seven': 27, 'twenty-seven': 27, '27th': 27,
  'twenty eight': 28, 'twenty-eight': 28, '28th': 28,
  'twenty nine': 29, 'twenty-nine': 29, '29th': 29,
  thirty: 30, thirtieth: 30, '30th': 30,
  'thirty one': 31, 'thirty-one': 31, '31st': 31,

  // Hindi Devanagari numbers 1-31
  'एक': 1, 'पहला': 1, 'दो': 2, 'दूसरा': 2, 'तीन': 3, 'तीसरा': 3, 'चार': 4, 'चौथा': 4, 'पांच': 5, 'पाँच': 5, 'पांचवा': 5, 'पाँचवा': 5,
  'छह': 6, 'छठा': 6, 'सात': 7, 'सातवां': 7, 'आठ': 8, 'आठवां': 8, 'नौ': 9, 'नौवां': 9, 'दस': 10, 'दसवां': 10,
  'ग्यारह': 11, 'ग्यारहवां': 11, 'बारह': 12, 'बारहवां': 12, 'तेरह': 13, 'तेरहवां': 13, 'चौदह': 14, 'चौदहवां': 14,
  'पंद्रह': 15, 'पंद्रहवां': 15, 'सोलह': 16, 'सोलहवां': 16, 'सत्रह': 17, 'सत्रहवां': 17, 'अठारह': 18, 'अठारहवां': 18,
  'उन्नीस': 19, 'उन्नीसवां': 19, 'बीस': 20, 'बीसवां': 20, 'इक्कीस': 21, 'इक्कीसवां': 21, 'बाईस': 22, 'बाईसवां': 22,
  'तेईस': 23, 'तेईसवां': 23, 'चौबीस': 24, 'चौबीसवां': 24, 'पच्चीस': 25, 'पच्चीसवां': 25, 'छब्बीस': 26, 'छब्बीसवां': 26,
  'सत्ताइस': 27, 'सत्ताइसवां': 27, 'अट्ठाइस': 28, 'अट्ठाइसवां': 28, 'उनतीस': 29, 'उनतीसवां': 29, 'तीस': 30, 'तीसवां': 30,
  'इकत्तीस': 31, 'इकत्तीसवां': 31,

  // Hinglish
  ek: 1, do: 2, teen: 3, char: 4, paanch: 5, chah: 6, saat: 7, aath: 8, nau: 9, das: 10,
  gyarah: 11, barah: 12, terah: 13, chaudah: 14, pandrah: 15, solah: 16, satrah: 17, atharah: 18, unnees: 19,
  bees: 20, ikkees: 21, baees: 22, teees: 23, chaubees: 24, pachhees: 25, chhabbees: 26, sattasee: 27, atthasee: 28, untees: 29, tees: 30, ikattees: 31
};

// Month dictionary for date parsing
const MONTH_MAP = {
  // English & common speech-to-text variations
  jan: '01', january: '01', janwari: '01', janvri: '01',
  feb: '02', february: '02', febwari: '02', farvari: '02',
  mar: '03', march: '03', maarch: '03',
  apr: '04', april: '04', aprel: '04', epral: '04',
  may: '05', mai: '05',
  jun: '06', june: '06',
  jul: '07', july: '07', julai: '07',
  aug: '08', august: '08', agast: '08',
  sep: '09', sept: '09', september: '09', setember: '09', setamber: '09', setambar: '09', sitember: '09', sitamber: '09', sitambar: '09', sitambhar: '09',
  oct: '10', october: '10', aktubar: '10', aktuabar: '10',
  nov: '11', november: '11', navambar: '11', navamber: '11',
  dec: '12', december: '12', disambar: '12', disamber: '12',
  
  // Hindi Devanagari
  'जनवरी': '01', 'जन': '01',
  'फरवरी': '02', 'फ़रवरी': '02', 'फर': '02',
  'मार्च': '03',
  'अप्रैल': '04', 'अप्रेल': '04',
  'मई': '05',
  'जून': '06',
  'जुलाई': '07',
  'अगस्त': '08',
  'सितंबर': '09', 'सितम्बर': '09', 'सितं': '09',
  'अक्टूबर': '10', 'अक्टू': '10',
  'नवंबर': '11', 'नवम्बर': '11', 'नवं': '11',
  'दिसंबर': '12', 'दिसम्बर': '12', 'दिसं': '12'
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatDateISO = (d) => {
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${year}-${month}-${day}`;
};

/**
 * Extracts numeric quantity or price from a spoken string.
 * e.g., "1200 per quintal" => "1200"
 *       "1200 rupees per quintal" => "1200"
 *       "50 quintals" => "50"
 *       "बारह सौ" => "1200"
 *       "पचास क्विंटल" => "50"
 */
export const parseQuantityOrPrice = (text) => {
  if (!text) return '';
  const str = String(text).trim();

  // 1. Direct regex match for numbers (digits with optional commas or decimal)
  // e.g. "1200 per quintal", "1,200", "50.5", "₹1200", "1200/-", "1200 प्रति क्विंटल"
  const digitMatch = str.match(/(?:(?:rs\.?|rupees|₹|रुपये|रु\.?)\s*)?(\d+(?:,\d+)*(?:\.\d+)?)/i);
  if (digitMatch && digitMatch[1]) {
    const cleanedNum = digitMatch[1].replace(/,/g, '');
    if (!isNaN(parseFloat(cleanedNum))) {
      return cleanedNum;
    }
  }

  // Fallback digit match anywhere in string
  const anyDigitMatch = str.match(/\d+(?:\.\d+)?/);
  if (anyDigitMatch) {
    return anyDigitMatch[0];
  }

  // 2. Parse number words (e.g. "twelve hundred", "बारह सौ", "fifty", "पचास")
  const words = str.toLowerCase().split(/\s+/);
  let total = 0;
  let currentGroup = 0;
  let foundAnyWord = false;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-z\u0900-\u097F]/g, '');
    if (!cleanWord) continue;

    if (NUMBER_WORDS[cleanWord] !== undefined) {
      foundAnyWord = true;
      const val = NUMBER_WORDS[cleanWord];
      if (val === 100) {
        currentGroup = (currentGroup === 0 ? 1 : currentGroup) * 100;
      } else if (val === 1000 || val === 100000) {
        currentGroup = (currentGroup === 0 ? 1 : currentGroup) * val;
        total += currentGroup;
        currentGroup = 0;
      } else {
        currentGroup += val;
      }
    }
  }

  total += currentGroup;
  if (foundAnyWord && total > 0) {
    return String(total);
  }

  return str;
};

/**
 * Extracts quantity and unit (KG or QUINTAL) from a spoken transcript.
 * e.g., "500 kilo" => { displayQuantity: 500, unit: 'KG', quantityQuintals: 5.0 }
 *       "500 kg" => { displayQuantity: 500, unit: 'KG', quantityQuintals: 5.0 }
 *       "500 किलोग्राम" => { displayQuantity: 500, unit: 'KG', quantityQuintals: 5.0 }
 *       "50 quintal" => { displayQuantity: 50, unit: 'QUINTAL', quantityQuintals: 50.0 }
 *       "50 क्विंटल" => { displayQuantity: 50, unit: 'QUINTAL', quantityQuintals: 50.0 }
 */
export const parseQuantityAndUnit = (text) => {
  if (!text) return { displayQuantity: 50, unit: 'QUINTAL', quantityQuintals: 50.0 };
  const str = String(text).trim().toLowerCase();

  const isKg = /\b(kg|kgs|kilo|kilos|kilogram|kilograms|किलो|किग्रा|किलोग्राम)\b/i.test(str);
  const rawNumStr = parseQuantityOrPrice(text);
  const numVal = parseFloat(rawNumStr) || 50;

  if (isKg) {
    return {
      displayQuantity: numVal,
      unit: 'KG',
      quantityQuintals: numVal / 100.0
    };
  }

  return {
    displayQuantity: numVal,
    unit: 'QUINTAL',
    quantityQuintals: numVal
  };
};

/**
 * Parses spoken dates into standard ISO YYYY-MM-DD format.
 * e.g., "13 september 2026" => "2026-09-13"
 *       "13th september 2026" => "2026-09-13"
 *       "september 13 2026" => "2026-09-13"
 *       "13-09-2026" or "13/09/2026" => "2026-09-13"
 *       "13 सितंबर 2026" => "2026-09-13"
 *       "today" / "आज" => current date
 *       "yesterday" / "कल" => yesterday date
 *       "2 days ago" => 2 days prior
 */
/**
 * Parses spoken dates into standard ISO YYYY-MM-DD format.
 * e.g., "15 setember 2026" => "2026-09-15"
 *       "15 tarikh september 2026 ko" => "2026-09-15"
 *       "pandrah september 2026" => "2026-09-15"
 *       "15-09-2026" or "15/09/2026" => "2026-09-15"
 *       "15 सितंबर 2026" => "2026-09-15"
 */
export const parseSpokenDate = (text) => {
  if (!text) return formatDateISO(new Date());
  let rawStr = String(text).trim().toLowerCase();
  const now = new Date();

  // Relative dates
  if (rawStr.includes('today') || rawStr.includes('आज')) {
    return formatDateISO(now);
  }
  if (rawStr.includes('yesterday') || rawStr.includes('कल') || rawStr.includes('बीता')) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return formatDateISO(yesterday);
  }

  const daysAgoMatch = rawStr.match(/(\d+)\s*(?:days?|दिन)\s*(?:ago|पहले)/i);
  if (daysAgoMatch) {
    const days = parseInt(daysAgoMatch[1], 10);
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - days);
    return formatDateISO(pastDate);
  }

  // Already ISO format YYYY-MM-DD somewhere in string
  const isoMatch = rawStr.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  // Direct Numeric format DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const numericDmYMatch = rawStr.match(/(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2,4})/);
  if (numericDmYMatch) {
    const [, d, m, rawY] = numericDmYMatch;
    let y = rawY;
    if (y.length === 2) y = '20' + y;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  // Token-based number word replacement (for spoken day names e.g. "pandrah", "पंद्रह")
  const tokens = rawStr.split(/(\s+|[-/.])/);
  const replacedTokens = tokens.map(t => {
    const clean = t.trim().toLowerCase();
    if (NUMBER_WORDS_DAY[clean] !== undefined) {
      return String(NUMBER_WORDS_DAY[clean]);
    }
    return t;
  });
  let str = replacedTokens.join(' ');

  // Remove filler words (tarikh, ko, kaati, harvested, etc.)
  const strCleaned = str
    .replace(/\b(tarikh|tareekh|tariq|tikh|तारीख|ko|को|kaati|काटी|kaata|काटा|thi|था|thi|san|saal|sal|year|month|date|harvested|on)\b/g, ' ')
    .replace(/(\d+)(st|nd|rd|th)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Match Day + Month Name + Year (e.g. "15 setember 2026", "15 september 2026", "15 सितंबर 2026")
  const dayMonthYearMatch = strCleaned.match(/(\d{1,2})\s+([a-z\u0900-\u097F]+)(?:\s+(20\d{2}|\d{4}))?/i);
  if (dayMonthYearMatch) {
    const day = pad2(dayMonthYearMatch[1]);
    const monthKey = dayMonthYearMatch[2].toLowerCase();
    const year = dayMonthYearMatch[3] || String(now.getFullYear());

    if (MONTH_MAP[monthKey]) {
      return `${year}-${MONTH_MAP[monthKey]}-${day}`;
    }
  }

  // Match Month Name + Day + Year (e.g. "september 15 2026" or "सितंबर 15 2026")
  const monthDayYearMatch = strCleaned.match(/([a-z\u0900-\u097F]+)\s+(\d{1,2})(?:\s+(20\d{2}|\d{4}))?/i);
  if (monthDayYearMatch) {
    const monthKey = monthDayYearMatch[1].toLowerCase();
    const day = pad2(monthDayYearMatch[2]);
    const year = monthDayYearMatch[3] || String(now.getFullYear());

    if (MONTH_MAP[monthKey]) {
      return `${year}-${MONTH_MAP[monthKey]}-${day}`;
    }
  }

  // Fallback to JS Date parser if valid
  const parsedTimestamp = Date.parse(rawStr);
  if (!isNaN(parsedTimestamp)) {
    return formatDateISO(new Date(parsedTimestamp));
  }

  // Default fallback if totally unparseable
  return formatDateISO(now);
};

/**
 * Extracts fulfillment delay reasons (Rain, Transportation, Harvesting, etc.) from spoken transcript.
 */
export const parseSpokenReason = (text) => {
  if (!text) return '';
  const str = String(text).toLowerCase();

  if (/rain|barish|baarish|weather|मौसम|वर्षा|पानी/i.test(str)) {
    return 'Heavy Rain / भारी बारिश';
  }
  if (/transport|gadi|gaadi|truck|vehical|vehicle|traffic|jam|road|गाड़ी|ट्रक|परिवहन/i.test(str)) {
    return 'Transportation Problem / परिवहन समस्या';
  }
  if (/harvest|crop|fasal|kataye|katai|samay|delay|कटाई|फसल|तैयार/i.test(str)) {
    return 'Harvesting Delay / फसल कटाई में समय';
  }

  return 'Other Reason / अन्य कारण';
};

/**
 * Parses both date and delay reason from spoken transcript.
 */
export const parseSpokenDateAndReason = (text) => {
  const date = parseSpokenDate(text);
  const reason = parseSpokenReason(text);
  return { date, reason };
};
