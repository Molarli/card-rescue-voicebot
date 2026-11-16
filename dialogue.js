
(function () {
  "use strict";

  const cards = [
    { id: 'sage', lastFour: '4821', label: { en: 'Sage debit · fictional', th: 'Sage เดบิต · บัตรสมมติ' } },
    { id: 'onyx', lastFour: '7093', label: { en: 'Onyx debit · fictional', th: 'Onyx เดบิต · บัตรสมมติ' } }
  ];
  const scenarios = [
    { id: 'card', icon: 'card', title: { en: 'Report a lost card', th: 'แจ้งบัตรหาย' }, description: { en: 'Choose a card and try the full rescue flow.', th: 'เลือกบัตรและทดลองทุกขั้นตอน' }, prompt: { en: 'I lost my debit card.', th: 'บัตรเดบิตหายค่ะ' } },
    { id: 'failure', icon: 'lock', title: { en: 'Try a failed check', th: 'ลองยืนยันไม่ผ่าน' }, description: { en: 'Simulate failure after choosing a card.', th: 'เลือกบัตรแล้วลองยืนยันไม่ผ่าน' }, prompt: { en: 'Try failed verification', th: 'ลองยืนยันไม่ผ่าน' } },
    { id: 'handoff', icon: 'headset', title: { en: 'Ask for an agent', th: 'ขอคุยกับเจ้าหน้าที่' }, description: { en: 'View a handoff without a new block.', th: 'ดูการส่งต่อโดยไม่อายัดเพิ่ม' }, prompt: { en: 'I want a human agent.', th: 'ขอคุยกับเจ้าหน้าที่ค่ะ' } }
  ];

  const copy = {
    th: {
      welcome: "สวัสดีค่ะ ยินดีต้อนรับสู่ Card Rescue VoiceBot เดโมจำลองสำหรับแจ้งบัตรเดบิตหาย ลองพูด พิมพ์ หรือเลือกสถานการณ์ตัวอย่างได้เลยค่ะ",
      protected: "ฉันซ่อนข้อความนี้เพราะอาจมีข้อมูลส่วนตัวค่ะ กรุณาใช้ข้อมูลสมมติ และอย่าพิมพ์หรือพูดรหัสผ่าน PIN OTP หรือหมายเลขบัญชีจริงนะคะ",
      fallback: "ฉันยังจับใจความไม่ได้ค่ะ ลองบอกว่า บัตรหาย หรือขอคุยกับเจ้าหน้าที่ และใช้เฉพาะข้อมูลสมมติค่ะ",
      balance: "บัญชีเงินฝากตัวอย่างมียอดเงินที่ใช้ได้ 12,450 บาทค่ะ ยอดนี้เป็นข้อมูลสมมติสำหรับการสาธิต",
      transfer: "รายการโอนตัวอย่างจำนวน 850 บาทมีสถานะสำเร็จค่ะ รหัสอ้างอิงของรายการสมมติคือ DEMO-TF-A",
      handoff: "บันทึกการส่งต่อจำลองแล้ว เลขที่เรื่อง CR-DEMO-0002 ไม่มีเจ้าหน้าที่จริงเชื่อมต่อและไม่มีการอายัดเพิ่ม สถานะบัตรบนหน้าจอยังคงเดิมค่ะ",
      verify: "เลือกอนุมัติหรือจำลองยืนยันไม่สำเร็จบนหน้าจอค่ะ นี่เป็นเพียงการตรวจสอบตัวตนจำลอง ไม่เปิดแอปธนาคารและไม่ใช้ข้อมูลส่วนตัว",
      verified: "ยืนยันตัวตนผ่านแอปธนาคารจำลองสำเร็จค่ะ",
      verificationFailed: "การยืนยันตัวตนจำลองไม่สำเร็จค่ะ ฉันส่งต่อเรื่องให้เจ้าหน้าที่จำลองแล้ว เลขที่เรื่อง CR-DEMO-0002 บัตรตัวอย่างยังไม่ได้ถูกอายัด และยังไม่มีคำขอออกบัตรใหม่",
      block: "ตรวจสอบข้อมูลบัตรเดบิตตัวอย่างบนหน้าจอ แล้วกดปุ่มยืนยันการอายัดเพื่อดำเนินการค่ะ",
      replacement: "อายัดบัตรเดบิตตัวอย่างสำเร็จค่ะ ต้องการขอออกบัตรใหม่ในระบบจำลองไหมคะ",
      delivery: "ยืนยันให้จัดส่งบัตรใหม่ไปยังที่อยู่ลงทะเบียนตัวอย่างได้เลยค่ะ ระบบใช้ที่อยู่สมมติที่เตรียมไว้ จึงไม่ต้องระบุที่อยู่ของคุณ",
      cardDone: "บัตรสมมติที่เลือกถูกอายัดแล้วค่ะ เลขที่เรื่อง CR-DEMO-0001 ระบบจำลองได้บันทึกคำขอออกบัตรใหม่และจัดส่งไปยังที่อยู่ลงทะเบียนตัวอย่างแล้ว",
      cardOnly: "บัตรสมมติที่เลือกถูกอายัดแล้วค่ะ เลขที่เรื่อง CR-DEMO-0001 ไม่มีคำขอออกบัตรใหม่ในรอบนี้",
      cardAlready: "บัตรเดบิตตัวอย่างถูกอายัดในระบบจำลองแล้วค่ะ",
      cardCancel: "ยกเลิกขั้นตอนก่อนอายัดบัตรตัวอย่างแล้วค่ะ",
      demoVerify: "อนุมัติในแอปจำลอง",
      demoFailure: "จำลองยืนยันไม่สำเร็จ",
      confirm: "ยืนยันการอายัด",
      order: "ขอออกบัตรใหม่",
      confirmDelivery: "ยืนยันการจัดส่ง",
      skip: "ข้ามการออกบัตรใหม่",
      cancel: "ยกเลิก"
    },
    en: {
      welcome: "Welcome to the Card Rescue VoiceBot simulation. Speak or type your request, or choose a sample scenario.",
      protected: "I hid that message because it may contain personal information. Please use fictional data and keep real passwords, PINs, OTPs, and account numbers out of the demo.",
      fallback: "I didn’t catch that. Try “I lost my card” or ask for an agent. Please use only fictional information.",
      balance: "The sample savings account has an available balance of 12,450 baht. This amount is fictional.",
      transfer: "The sample transfer of 850 baht shows as completed. The fictional reference is DEMO-TF-A.",
      handoff: "Demo handoff recorded: CR-DEMO-0002. No live agent is connected and no new card block was made. The card statuses shown on screen remain unchanged.",
      verify: "Choose Approve in demo app or Simulate failed verification on screen. This is a fictional identity check: no banking app opens and no personal information is needed.",
      verified: "Identity verification passed in the simulated banking app.",
      verificationFailed: "Simulated identity verification failed. I recorded a handoff to a demo agent under case CR-DEMO-0002. The sample card is still active and no replacement was ordered.",
      block: "Review the sample debit card on your screen, then select Confirm block to proceed.",
      replacement: "The selected fictional card is blocked. Case CR-DEMO-0001. Would you like to order a replacement in this simulation?",
      delivery: "Please confirm delivery to the preset fictional address on file. The demo already has the address.",
      cardDone: "The selected fictional card is blocked. Case CR-DEMO-0001. The simulation recorded a replacement order for delivery to the fictional address on file.",
      cardOnly: "The selected fictional card is blocked. Case CR-DEMO-0001. No replacement was ordered in this session.",
      cardAlready: "The sample debit card is already blocked in this simulation.",
      cardCancel: "The session was canceled before the sample debit card was blocked.",
      demoVerify: "Approve in demo app",
      demoFailure: "Simulate failed verification",
      confirm: "Confirm block",
      order: "Order replacement",
      confirmDelivery: "Confirm delivery",
      skip: "Skip replacement",
      cancel: "Cancel"
    }
  };

  const intents = [
    ["handoff", /เจ้าหน้าที่|พนักงาน|คุยกับคน|โอเปอเรเตอร์|\b(?:agent|representative|operator|human|customer service|customer support|support staff)\b/i],
    ["card", /หาบัตร.{0,12}ไม่เจอ|\bcan(?:not|['’]t) find\b.*\bcard\b|\bmisplaced\b.*\bcard\b|บัตร.{0,24}(?:หาย|หามิได้|ถูกขโมย|อายัด|ระงับ|ล็อก|ล็อค|ปิดใช้งาน)|(?:อายัด|ระงับ|ล็อก|ล็อค).{0,16}บัตร|\b(?:lost|stolen|missing|block|freeze|lock|disable|cancel)(?:ed)?\b.*\bcard\b|\bcard\b.*\b(?:lost|stolen|missing|block|blocked|freeze|frozen|lock|locked|disable|disabled)\b/i],
    ["transfer", /สถานะ.{0,16}(?:โอน|รายการ)|(?:ติดตาม|ตรวจสอบ|เช็ค|เช็ก).{0,18}(?:โอน|รายการ)|โอน.{0,12}(?:สำเร็จ|หรือยัง|เข้าหรือยัง)|\b(?:status|track|check|did)\b.*\btransfer\b|\btransfer\b.*\b(?:status|complete|completed|go through|arrive)\b/i],
    ["balance", /ยอด(?:เงิน|คงเหลือ|บัญชี)|เงินเหลือ|\b(?:balance|available funds)\b/i]
  ];

  const cancellation = /^(?:please\s+)?(?:no\b|nope\b|cancel\b|stop\b|skip\b|don['’]?t\b|do not\b|never\s?mind\b|ยกเลิก|ข้าม|ไม่(?:เอา|ค่ะ|ครับ|ต้อง|ยืนยัน|อายัด|ใช่|ก่อน|แล้ว|\s|$)|หยุด)/i;
  const affirmation = /^(?:(?:yes|yep|confirm|okay|ok|go ahead)(?:[\s,]+please)?|(?:ยืนยัน|ตกลง|ใช่|ได้เลย)\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const deliveryApproval = /^(?:confirm (?:the )?delivery|ยืนยัน(?:การ)?จัดส่ง\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const replacementApproval = /ขอ(?:ออก)?บัตร(?:ใบ)?ใหม่|ออกบัตร(?:ใบ)?ใหม่|\b(?:order|issue|send|get)\b.*\b(?:replacement|new (?:card|one))\b/i;
  const verificationFailure = /ยืนยัน(?:ตัวตน)?ไม่สำเร็จ|ยืนยัน(?:ตัวตน)?ไม่ผ่าน|\b(?:failed verification|verification failed|fail verification)\b/i;
  const greeting = /^(?:สวัสดี|หวัดดี|hello\b|hi\b|hey\b)/i;
  const spokenEnglishDigits = /\b(?:zero|one|two|three|four|five|six|seven|eight|nine)(?:[\s,.-]+(?:zero|one|two|three|four|five|six|seven|eight|nine)){3,}\b/i;
  const spokenThaiDigits = /(?:ศูนย์|หนึ่ง|สอง|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า)(?:[\s,.-]*(?:ศูนย์|หนึ่ง|สอง|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า)){3,}/;
  const sharedSecret = /(?:\b(?:my\s+)?(?:pin|otp|password|passcode|account number|card number|cvv|cvc|address)\s*(?:is\s+|[:=]\s*)\S|(?:รหัสผ่าน|รหัส\s*otp|รหัส\s*pin|เลขบัญชี|เลขบัตร|ที่อยู่)\s*(?:ของฉัน\s*)?(?:คือ|[:=])\s*\S|\b(?:cvv|cvc)\s*\p{Nd}{3}\b)/iu;
  const numberSequence = /\p{Nd}(?:[\s,().+-]*\p{Nd}){3}/u;
  const shortCode = /^\s*\p{Nd}{3}\s*$/u;
  const emailAddress = /[^\s@]+@[^\s@]+\.[^\s@]+/u;

  function isSensitive(input) {
    const normalized = String(input ?? "").normalize("NFKC");
    return numberSequence.test(normalized) || shortCode.test(normalized) || spokenEnglishDigits.test(normalized) ||
      spokenThaiDigits.test(normalized) || sharedSecret.test(normalized) || emailAddress.test(normalized);
  }

  function languageKey(lang) {
    return String(lang ?? "").toLowerCase().startsWith("en") ? "en" : "th";
  }

  function welcome(lang) {
    return copy[languageKey(lang)].welcome;
  }

  function result(text, intent, status, quickReplies = [], step = null, outcome = null, redactInput = false) {
    return { text, intent, status, quickReplies, step, outcome, redactInput };
  }

  function suggestions(lang) {
    return scenarios.map((scenario) => ({ label: scenario.title[lang], text: scenario.prompt[lang] }));
  }

  function create() {
    let cardStep = null;
    let selectedId = null;
    let blocked = new Set();
    let ordered = new Set();
    let misses = 0;
    const extra = {
      en: { select: 'Which fictional card is missing? Choose Sage or Onyx. Both are demo cards; no real bank is connected.', selected: 'Selected fictional card:', uncertain: 'I’m not certain enough to continue. Demo handoff recorded: CR-DEMO-0002. No new card block was made. No live agent is connected.', choose: 'Choose', retry: 'Please use the on-screen choices, or ask for an agent.', cancel: 'Cancel' },
      th: { select: 'บัตรสมมติใบไหนหายคะ เลือก Sage หรือ Onyx ทั้งสองเป็นบัตรเดโม ไม่มีการเชื่อมต่อธนาคารจริง', selected: 'บัตรสมมติที่เลือก:', uncertain: 'ฉันยังไม่มั่นใจพอที่จะดำเนินการค่ะ บันทึกการส่งต่อจำลอง CR-DEMO-0002 แล้ว ไม่มีการอายัดเพิ่มและไม่มีเจ้าหน้าที่จริงเชื่อมต่อ', choose: 'เลือก', retry: 'กรุณาเลือกปุ่มบนหน้าจอ หรือขอคุยกับเจ้าหน้าที่ค่ะ', cancel: 'ยกเลิก' }
    };
    function getState() {
      return { step: cardStep, selected: cards.find(c => c.id === selectedId) ?? null, cards: cards.map(c => ({ ...c, blocked: blocked.has(c.id), replacementOrdered: ordered.has(c.id) })) };
    }
    function reset() { cardStep = null; selectedId = null; blocked.clear(); ordered.clear(); misses = 0; }
    function choices(words, language) {
      const x = extra[language];
      const sets = {
        select: cards.filter(c => !blocked.has(c.id)).map(c => ({ label: `${x.choose} ${c.label[language]} •••• ${c.lastFour}`, text: c.id, action: `select-${c.id}` })),
        verify: [{label: words.demoVerify, text: 'approve demo identity', action: 'confirm-verify'}, {label: words.demoFailure, text: 'failed verification', action: 'fail-verify'}],
        block: [{label: words.confirm, text: 'confirm block', action: 'confirm-block'}],
        replacement: [{label: words.order, text: words.order}, {label: words.skip, text: words.skip}],
        delivery: [{label: words.confirmDelivery, text: words.confirmDelivery}]
      };
      const items = [...(sets[cardStep] ?? [])];
      if (cardStep && cardStep !== 'replacement') items.push({label:x.cancel,text:x.cancel});
      return items;
    }
    function ask(words, language, step, text) {
      cardStep = step;
      return result(text, 'card', 'pending', choices(words, language), step);
    }
    function finish(text, outcome, status = 'completed') {
      cardStep = null; misses = 0;
      return result(text, 'card', status, [], outcome === 'verification_failed' ? 'escalated' : 'done', outcome);
    }
    function reply(input, lang, { action } = {}) {
      const language = languageKey(lang), words = copy[language], x = extra[language];
      const message = String(input ?? '').normalize('NFC').trim();
      if (isSensitive(message)) return result(words.protected, 'privacy', 'protected', choices(words,language), cardStep, null, true);
      if (/เจ้าหน้าที่|พนักงาน|คุยกับคน|\b(agent|human|representative|operator)\b/i.test(message)) {
        return finish(words.handoff, 'agent_handoff', 'handoff');
      }
      if (/not sure|uncertain|don.t know|ไม่แน่ใจ|ไม่ทราบ|ไม่รู้/i.test(message)) return finish(x.uncertain, 'agent_handoff', 'handoff');
      if (cardStep && cancellation.test(message)) return finish(blocked.has(selectedId) ? words.cardOnly : words.cardCancel, blocked.has(selectedId) ? 'card_blocked' : 'canceled');
      if (cardStep === 'select') {
        const chosen = cards.find(c => action === `select-${c.id}` || new RegExp(`\\b${c.id}\\b`, 'i').test(message));
        if (chosen && !blocked.has(chosen.id)) {
          selectedId = chosen.id; misses = 0;
          return ask(words,language,'verify',`${x.selected} ${chosen.label[language]} •••• ${chosen.lastFour}. ${words.verify}`);
        }
      } else if (cardStep === 'verify') {
        if (action === 'fail-verify' || verificationFailure.test(message) || /ยืนยันไม่ผ่าน/.test(message)) return finish(words.verificationFailed,'verification_failed','handoff');
        if (action === 'confirm-verify') { misses = 0; return ask(words,language,'block',`${words.verified} ${words.block}`); }
      } else if (cardStep === 'block') {
        if (action === 'confirm-block' && selectedId) { blocked.add(selectedId); misses = 0; return ask(words,language,'replacement',words.replacement + (language === 'th' ? ' เลขที่เรื่อง CR-DEMO-0001' : '')); }
      } else if (cardStep === 'replacement') {
        if (affirmation.test(message) || replacementApproval.test(message)) { misses = 0; return ask(words,language,'delivery',words.delivery); }
      } else if (cardStep === 'delivery') {
        if (affirmation.test(message) || deliveryApproval.test(message)) { ordered.add(selectedId); return finish(words.cardDone,'replacement_ordered'); }
      }
      if (cardStep) {
        misses++;
        if (misses >= 2) return finish(x.uncertain,'agent_handoff','handoff');
        const current = cardStep;
        return ask(words,language,current,x.retry + ' ' + (current === 'select' ? x.select : words[current] ?? ''));
      }
      if (/failed verification|ยืนยันไม่ผ่าน/.test(message)) {
        return ask(words,language,'select',x.select + (language === 'en' ? ' Then choose Simulate failed verification.' : ' แล้วเลือกจำลองยืนยันไม่สำเร็จค่ะ'));
      }
      if (intents.find(([id,pattern]) => id === 'card' && pattern.test(message)) || replacementApproval.test(message)) {
        misses = 0; selectedId = null;
        if (blocked.size === cards.length) return finish(words.cardAlready,'card_blocked');
        return ask(words,language,'select',x.select);
      }
      return result(greeting.test(message) ? words.welcome : words.fallback, greeting.test(message) ? 'greeting':'fallback', 'ready', suggestions(language));
    }
    return { reset, reply, getState };
  }
  window.CardRescueDialogue = { cards, scenarios, create, welcome, isSensitive };
})();
