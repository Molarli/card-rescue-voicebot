const {readFileSync,existsSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const mirror = path.join(__dirname, '../docs/dialogue.js');
const file = existsSync(mirror) ? mirror : path.join(__dirname, '../dialogue.js');
const scope = {window:{}};
vm.runInNewContext(readFileSync(file,'utf8'),scope);
const api = scope.window.CardRescueDialogue;
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){console.error('FAIL '+name);throw e;}}
for(const lang of ['en','th']){
 const lost=lang==='en'?'I lost my card':'บัตรหายค่ะ';
 const yes=lang==='en'?'yes':'ยืนยัน';
 const start=(id='sage')=>{const d=api.create();assert.equal(d.reply(lost,lang).step,'select');d.reply(id,lang,{action:`select-${id}`});return d;};
 const review=(id)=>{const d=start(id);assert.equal(d.reply('approve demo identity',lang,{action:'confirm-verify'}).step,'block');return d;};
 test(lang+' natural lost-card wording',()=>{const d=api.create();const r=d.reply(lang==='en'?"I can’t find my debit card.":'หาบัตรไม่เจอค่ะ',lang);assert.equal(r.step,'select');assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' two distinct fictional cards',()=>{const d=api.create();const r=d.reply(lost,lang);assert.equal(r.quickReplies.filter(x=>x.action?.startsWith('select-')).length,2);assert.equal(d.getState().cards.length,2);});
 test(lang+' typed card-name selection',()=>{const d=api.create();d.reply(lost,lang);assert.equal(d.reply('Onyx',lang).step,'verify');assert.equal(d.getState().selected.id,'onyx');});
 test(lang+' spoken/typed approval cannot verify identity',()=>{const d=start();assert.equal(d.reply(yes,lang).step,'verify');assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' typed block cannot change card status',()=>{const d=review();d.reply(yes,lang);assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' selected card only is blocked on explicit action',()=>{const d=review('onyx');assert.equal(d.reply('confirm block',lang,{action:'confirm-block'}).step,'replacement');assert.equal(d.getState().cards.find(c=>c.id==='onyx').blocked,true);assert.equal(d.getState().cards.find(c=>c.id==='sage').blocked,false);});
 test(lang+' replacement requires delivery confirmation',()=>{const d=review('sage');d.reply('confirm block',lang,{action:'confirm-block'});assert.equal(d.reply(yes,lang).step,'delivery');assert.equal(d.getState().cards[0].replacementOrdered,false);assert.equal(d.reply(yes,lang).outcome,'replacement_ordered');assert.equal(d.getState().cards[0].replacementOrdered,true);});
 test(lang+' failed identity leaves both cards active',()=>{const d=start();assert.equal(d.reply('failed verification',lang,{action:'fail-verify'}).outcome,'verification_failed');assert.ok(d.getState().cards.every(c=>!c.blocked&&!c.replacementOrdered));});
 test(lang+' uncertain input hands off with no block',()=>{const d=review();assert.equal(d.reply(lang==='en'?'I am not sure':'ไม่แน่ใจค่ะ',lang).outcome,'agent_handoff');assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' repeated misunderstood input hands off',()=>{const d=start();d.reply('???',lang);assert.equal(d.reply('???',lang).outcome,'agent_handoff');assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' cancel before block preserves active state',()=>{const d=review();assert.equal(d.reply(lang==='en'?'cancel':'ยกเลิก',lang).outcome,'canceled');assert.ok(d.getState().cards.every(c=>!c.blocked));});
 test(lang+' skip replacement keeps block only',()=>{const d=review();d.reply('confirm block',lang,{action:'confirm-block'});assert.equal(d.reply(lang==='en'?'skip replacement':'ข้ามการออกบัตรใหม่',lang).outcome,'card_blocked');assert.equal(d.getState().cards[0].replacementOrdered,false);});
 test(lang+' reset clears block, replacement, and selection',()=>{const d=review();d.reply('confirm block',lang,{action:'confirm-block'});d.reset();assert.equal(d.getState().selected,null);assert.ok(d.getState().cards.every(c=>!c.blocked&&!c.replacementOrdered));});
 test(lang+' privacy redacts synthetic numeric secrets',()=>{const d=start();const r=d.reply('my OTP is 123456',lang);assert.equal(r.redactInput,true);assert.equal(r.step,'verify');assert.ok(!r.text.includes('123456'));});
 test(lang+' agent request before and after block preserves statuses',()=>{const d=review();assert.equal(d.reply('human agent',lang).outcome,'agent_handoff');assert.ok(d.getState().cards.every(c=>!c.blocked));const b=review();b.reply('confirm block',lang,{action:'confirm-block'});b.reply('human agent',lang);assert.equal(b.getState().cards[0].blocked,true);assert.equal(b.getState().cards[1].blocked,false);});
}
for(const secret of ['1234','๑๒๓๔','1234567890123','test@example.com','one two three four','หนึ่งสองสามสี่','my password is fictional-secret']) test('synthetic privacy pattern: '+secret,()=>assert.equal(api.isSensitive(secret),true));
console.log(`${passed}/${passed} logic checks passed. Not voice accuracy, user, timing, or bank-integration testing.`);
