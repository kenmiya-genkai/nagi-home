(function () {
  'use strict';
  const K = 'nagi-home-v2-';
  const letters = [
    '空気が冷たくなって、夕日がいちばんきれいな季節になりました。今日の夕日は見た？ 私は窓からずーっと眺めてたよ。',
    'このあいだ読み始めた本、やっと読み終わりました。最後の10ページ、もったいなくてゆっくり読んだ。次は何を読もうかな。',
    '島の猫が家の前で日なたぼっこしてた。起こさないように、そーっと写真だけ撮ったよ。今度見せるね。',
    '手紙って、届くまでの時間も贈りものだと思う。だから、たまにしか書かないの。…うそ。書きたいときに書いてるだけ。',
    'いつも覗きに来てくれてありがとう。ここにいると、私もひとりじゃない気がするよ。'
  ];
  const lines = {
    morning: ['おはよう。朝ごはん、ちゃんと食べる派です','パンの焼けるにおいって、しあわせだよね','いただきます。今日もいい日になりますように','今日の味噌汁、わかめが多め。当たりの日','窓の外、もう船が出とる。いってらっしゃい'],
    noon: ['ごろごろ読書中。いま、いいところ','この本もう3回目。なのにまた泣きそう','読書とお昼寝、どっちが先か迷う時間…','読みかけのページ、風でめくれとった','お茶をおかわり。もう一杯だけ'],
    evening: ['ドラマの続き、気になって仕方ない','ぼーっとテレビ。こういう時間も大事','お茶いれたよ。そっちも一息ついてる？','夕日が沈むの、全部見届けた','今日の雲、魚みたいな形やった'],
    night: ['おやすみなさい。また明日ね','すやすや…夢の中でも島の空を見てるかも','今日も一日、おつかれさま','波の音が子守歌みたい','明日の朝ごはん、何にしようかな']
  };
  const replies = {
    morning: ['ん？ おはよう。呼んだ？','はーい。朝ごはん、もうすぐできるよ','ふふ、なあに？','おはよう。朝ごはん、もう少しでできるよ'],
    noon: ['んん？ …あと5ページだけ','呼んだ？ ちょうど眠くなってきたとこ','なあに？ お茶いれる？','ん？いま、いいところ'],
    evening: ['ん？ テレビ、巻き戻そっか','はーい。今日も一日おつかれさま','呼んだ？ となりに座る？','夕日、見た？今日のは特別やった'],
    night: ['んん…ねむい…呼んだ…？','ふわぁ…おやすみの途中だったのに','大丈夫、起きたよ。なあに？','…ふあ。まだ起きとるよ']
  };
  const awayReplies = ['（返事はない…お出かけ中みたい）','（しーん。留守だね、今日は）','（声だけが家に響いた）'];
  const awayNotes = ['おでかけ中です。島をぐるっと散歩してくるね。夕方には戻るよ。— なぎ','ちょっと海を見に行ってきます。お土産話、待っててね。— なぎ','島の反対側までお散歩中。戻ったらお茶にしよう。— なぎ'];
  const diaryPool = ['今日の夕日は格別だった。写真に撮っても、本物にはかなわない。','本を読みすぎて肩がこった。でもやめられない。','島の猫と目が合った。向こうも同じことを考えてた気がする。','風の音を聞きながらぼーっとした。こういう日も大事。','新しいお茶を開けた。香りだけで幸せ。','波の音が子守歌みたいで、昼寝が長くなった。','手紙を書いた。届くまでの時間が、また楽しい。','今日は雲の流れが速かった。明日は晴れるかな。','ドラマの最終回。泣いた。しばらく引きずりそう。','何もしない日。それもまた、いい日。'];
  const books = ['島の天気の本','星の図鑑','海の生きもの図鑑','昔の手紙の本','お菓子作りの本','福岡の歴史','猫の気持ち','雲の名前事典'];
  const SPECIAL_DATES = {'11-21':'今日は島のビーチクリーン（オーシャン・リバース）の日'};
  const dateFmt = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
  const hourFmt = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',hourCycle:'h23'});
  const timeFmt = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const jDate = new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
  const diaryDateFmt = new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',month:'long',day:'numeric'});
  const diarySpecial = '今日は島のビーチクリーン（オーシャン・リバース）の日。海辺をきれいにして、島の景色が少し誇らしく見えた。';
  function dateKey(date=new Date()){const p=Object.fromEntries(dateFmt.formatToParts(date).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
  function dayNumber(key){const [y,m,d]=key.split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000);}
  function bandForHour(h){return h>=6&&h<10?'morning':h>=10&&h<16?'noon':h>=16&&h<22?'evening':'night';}
  const mod=(a,b)=>((a%b)+b)%b;
  function isAwayNow(key,h){return dayNumber(key)%10===3&&h>=8&&h<19;}
  function isLetterDay(key){return dayNumber(key)%3===0;}
  function isCatDay(key){return dayNumber(key)%4===1;}
  function catStage(visits){return visits>=3?'cat-2':'cat-1';}
  function isDanceDay(key){return dayNumber(key)%7===5;}
  function isTwinDay(key){return dayNumber(key)%5===2;}
  function visitorFor(key){const n=dayNumber(key);return n%5===2?(Math.floor(n/5)%2===0?'ushio':'kouchan'):null;}
  function isRareDay(key){return dayNumber(key)%13===4;}
  function moonPhase(date){const origin=Date.UTC(2000,0,6,18,14);const age=mod((date.getTime()-origin)/86400000,29.53);const idx=Math.floor((age/29.53)*8+0.5)%8;const emojis=['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];const names=['新月','三日月','上弦の月','十三夜','満月','寝待月','下弦の月','有明月'];const near=(x)=>Math.min(mod(age-x,29.53),mod(x-age,29.53));const tide=near(0)<1.8||near(14.765)<1.8?'大潮':near(7.38)<1.8||near(22.15)<1.8?'小潮':'中潮';return {age,emoji:emojis[idx],name:names[idx],tide};}
  function diaryFor(c={}){if(c.special)return diarySpecial;const event=c.event;if(event==='cat')return '猫が来た。今日は少し近くまで来てくれた。';if(event==='letter')return '手紙を書いた。ポストに入れる時、ちょっとどきどきした。';if(event==='away')return 'お出かけした。島の外の景色もたまにはいい。';if(event==='dance')return '夕方、踊った。誰も見てない…はず。';if(event==='rare')return '流れ星を見た。願いごとは内緒。';if(c.weather==='rain')return '雨の音を聞きながら本を読んだ。こういう日も好き。';if(c.weather==='snow')return '雪の静かな日。本を読みながら窓の外を眺めた。';if(c.weather==='clear')return '天気が良くて、洗濯物がよく乾いた。';return diaryPool[mod(c.dayNumber||0,diaryPool.length)];}
  function collectionFor(s={}){const defs=[['shell','🐚','貝殻',s.ushio],['cookie','🍪','お菓子',s.kouchan],['letter','✉️','手紙',s.letter],['paw','🐾','猫の足跡',s.cat>=3],['sunset','🌇','夕日の写真',s.rareEvening],['note','🎵','音符',s.dance]];return defs.filter(x=>x[3]).map(x=>({id:x[0],icon:x[1],name:x[2]}));}
  window.NAGI_HOME_V2={bandForHour,isAwayNow,isLetterDay,isCatDay,catStage,isDanceDay,isTwinDay,visitorFor,isRareDay,moonPhase,diaryFor,collectionFor};

  const el=id=>document.getElementById(id); const get=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(K+key))??fallback;}catch(_){return fallback;}};
  function store(key,value){localStorage.setItem(K+key,JSON.stringify(value));}
  function weatherKind(code){if(code===0)return'clear';if(code===1||code===2)return'partly';if([45,48].includes(code))return'fog';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return'rain';if([71,73,75,77,85,86].includes(code))return'snow';if([95,96,99].includes(code))return'storm';return'cloud';}
  let weather=null, previousReply='', lastLine='', lineStamp='';
  const firstVisit=get('first-visit',dateKey()); if(!localStorage.getItem(K+'first-visit'))store('first-visit',firstVisit);
  function svgLaundry(indoor){return indoor?'<svg viewBox="0 0 90 80"><path d="M12 8h66M20 8v58m50-58v58M20 66h50"/><path d="M29 23h20v27H29zM54 21h16v29H54z"/></svg>':'<svg viewBox="0 0 90 70"><path d="M8 12h74M18 12v52m54-52v52M18 64h54"/><path d="M29 23h22v29H29zM55 23h15v29H55z"/><path d="M36 23v-6h8v6m16 0v-6h6v6"/></svg>';}
  function svgPlant(stage){const stems=stage===1?'<path d="M40 59V42q-10-15 0-18"/>':`<path d="M40 59V${[0,48,40,30,20][stage]}"/><path d="M40 52q-18-14-15-22m15 28q18-15 17-25"/>${stage>=3?'<path d="M40 42q-14-15-12-22m12 14q14-14 15-23"/>':''}`;const flower=stage===5?'<circle cx="40" cy="14" r="7"/><circle cx="34" cy="12" r="4"/><circle cx="46" cy="12" r="4"/>':'';return `<svg viewBox="0 0 80 90"><path d="M21 58h38l-5 26H26z"/>${stems}${flower}</svg>`;}
  function currentContext(now,key,h,band){const day=dayNumber(key),special=SPECIAL_DATES[key.slice(5)]||'',away=isAwayNow(key,h),cat=isCatDay(key)&&band==='noon'&&!away,dance=band==='evening'&&isDanceDay(key)&&!away,rare=isRareDay(key),visitor=visitorFor(key);return{day,key,h,band,special,away,cat,dance,rare,visitor,rareEvening:rare&&band==='evening'&&(!weather||weather.kind==='clear'),nightRare:rare&&band==='night'};}
  function sayLine(ctx){if(ctx.special)return ctx.special;if(ctx.away)return '';if(ctx.cat)return '猫が来た。読書は中断、これは仕方ない';if(ctx.dance)return '見て見て、ダンスタイム！ 夕方は踊りたくなるの';if(ctx.nightRare)return '流れ星がひとつ。願いごとは内緒ね';if(ctx.rareEvening&&weather?.kind==='clear')return '今日の夕日は特別。もう少しだけ見ていたいな';const stamp=`${ctx.key}-${ctx.band}`;if(lineStamp===stamp&&lastLine)return lastLine;const pool=lines[ctx.band];const prev=localStorage.getItem(K+'last-line');const options=pool.filter(x=>x!==prev);lastLine=options[Math.floor(Math.random()*options.length)];lineStamp=stamp;localStorage.setItem(K+'last-line',lastLine);return lastLine;}
  function renderCollection(ctx){const saved=get('collection',[]);const visit=Number(get('cat-visits',0));const state={ushio:saved.includes('shell')||ctx.visitor==='ushio',kouchan:saved.includes('cookie')||ctx.visitor==='kouchan',letter:saved.includes('letter'),cat:Math.max(visit,saved.includes('paw')?3:0),rareEvening:saved.includes('sunset')||ctx.rareEvening,dance:saved.includes('note')||ctx.dance};const items=collectionFor(state);el('collection-items').innerHTML=items.map(x=>`<span class="collection-item" title="${x.name}">${x.icon} ${x.name}</span>`).join('')||'<span class="empty-shelf">これから増えていくよ</span>';el('collection-count').textContent=`${items.length}件`;}
  function update(){const now=new Date(),key=dateKey(now),h=Number(hourFmt.format(now)),band=bandForHour(h),ctx=currentContext(now,key,h,band);document.body.className=`band-${band}${ctx.away?' is-away':''}`;el('time').textContent=`${timeFmt.format(now)} JST`;el('band-label').textContent=ctx.away?'おでかけ中':ctx.dance?'ダンスタイム♪':({morning:'あさのなぎ',noon:'ひるのなぎ',evening:'ゆうがたのなぎ',night:'よるのなぎ'})[band];
    const scene=el('scene'),sleep=band==='night'&&!ctx.away;scene.classList.toggle('sleep-scene',sleep);el('background').src=sleep?'assets/scene-sleep.webp':ctx.away?(band==='evening'?'assets/bg-evening.webp':'assets/bg-day.webp'):(band==='evening'?'assets/bg-evening.webp':'assets/bg-day.webp');el('background').alt=sleep?'眠るなぎの夜の部屋':'';
    const pose=band==='morning'?'pose-eat':band==='noon'?(isTwinDay(key)?'pose-read-twin':'pose-read'):band==='evening'?(ctx.dance?'pose-dance':h>=17&&h<20?'pose-dinner':'pose-read'):'';
    const nagi=el('nagi');nagi.hidden=sleep||ctx.away;nagi.src=pose?`assets/${pose}.webp`:'';nagi.className=`nagi ${pose||''}`;nagi.alt=pose?(ctx.dance?'踊るなぎ':band==='morning'?'朝ごはんを食べるなぎ':band==='evening'&&h>=17&&h<20?'夕ごはんのなぎ':'読書をするなぎ'):'';
    const cat=el('cat');const showCat=ctx.cat&&!sleep&&!ctx.away;let visits=Number(get('cat-visits',0));if(showCat&&get('cat-seen-day','')!==key){visits++;store('cat-visits',visits);store('cat-seen-day',key);}cat.hidden=!showCat;if(showCat){const stage=catStage(visits);cat.src=`assets/${stage}.webp`;cat.className=`cat ${stage}`;cat.alt=stage==='cat-1'?'縁側に来た猫':'部屋の中に来た猫';}
    const fx=el('weather-fx');fx.className=`fx-layer${weather?` fx-${weather.kind}${weather.kind==='clear'&&band==='evening'?' fx-sunset':''}`:''}${ctx.nightRare?' fx-stars':''}`;el('rare-star').hidden=!(ctx.nightRare);el('window-event').classList.toggle('bird-flight',ctx.day%6===2&&band!=='night'&&!ctx.away);el('boat-light').hidden=!(band==='evening'&&weather?.kind==='clear'&&!ctx.away);
    const laundry=el('laundry');const daylight=['morning','noon','evening'].includes(band)&&!ctx.away&&!sleep;laundry.hidden=!daylight||!weather||!['clear','partly','cloud','rain'].includes(weather.kind);laundry.classList.toggle('indoor',weather?.kind==='rain');laundry.innerHTML=svgLaundry(weather?.kind==='rain');
    const plant=el('plant');const start=dayNumber(firstVisit),age=Math.max(0,dayNumber(key)-start),stage=Math.min(5,1+Math.floor(age/3));plant.innerHTML=svgPlant(stage);plant.hidden=sleep;el('season').textContent=['🌸','🎐','🍁','🍊'][Math.floor((now.getMonth())/3)%4];el('season').hidden=sleep;
    const specialText=ctx.special;let note='';if(ctx.visitor==='ushio')note='潮が顔を出してくれた。海の話を少しだけ。';if(ctx.visitor==='kouchan')note='こうちゃんが遊びに来た。お菓子を置いていってくれた。';if(ctx.day%5===3)note=ctx.day%2===0?'玄関先に猫がいた、というメモが残っていた。':'配達が来て、お菓子を届けてくれた。';el('event-note').textContent=specialText||note;el('event-note').hidden=!((specialText||note)&&!ctx.away&&!sleep);
    if(!ctx.away&&!sleep){if(ctx.visitor==='ushio')remember('shell');if(ctx.visitor==='kouchan')remember('cookie');if(ctx.dance)remember('note');if(ctx.rareEvening)remember('sunset');}
    el('away-note').textContent=awayNotes[mod(ctx.day,3)];el('away-note').hidden=!ctx.away;
    const nightBook=books[mod(ctx.day,books.length)];el('night-book').textContent=`今日読んでる本：『${nightBook}』`;el('night-book').hidden=!sleep;
    el('line').textContent=sayLine(ctx);el('line').hidden=ctx.away;el('call-button').disabled=sleep;el('dance-label').hidden=!ctx.dance;el('letter-button').hidden=!isLetterDay(key);el('letter-badge').hidden=!isLetterDay(key)||localStorage.getItem(K+'letter-read')===key;
    el('weather-chip').hidden=!weather;if(weather)el('weather-chip').textContent=`玄界島：${weather.icon}${weather.label}`;const moon=moonPhase(now);el('moon-chip').hidden=band!=='night'||ctx.away;el('moon-chip').textContent=`今夜の月：${moon.emoji} ${moon.name}ごろ・${moon.tide}`;
    renderCollection(ctx);const visitDates=get('visits',[]);if(!visitDates.includes(key)){visitDates.push(key);store('visits',visitDates);}const published=dayNumber('2026-11-15'),days=Math.max(1,ctx.day-published+1);el('visit-record').textContent=`おうち公開から${days}日目（公開日＝2026-11-15）・のぞきに来たのは${visitDates.length}回目`;
    window.__nagiContext={ctx,now,key,band,dayNumber:ctx.day,weather,nightBook};
  }
  function fetchWeather(){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);fetch('https://api.open-meteo.com/v1/forecast?latitude=33.684&longitude=130.238&current=weather_code,is_day&timezone=Asia%2FTokyo',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('weather');return r.json();}).then(d=>{const c=d.current;if(!c||typeof c.weather_code!=='number')return;const kind=weatherKind(c.weather_code);weather={kind,icon:kind==='clear'?(c.is_day===0?'🌙':'☀️'):({partly:'🌤️',cloud:'☁️',fog:'🌫️',rain:'🌧️',snow:'❄️',storm:'⛈️'})[kind],label:({clear:'晴れ',partly:'晴れときどき曇り',cloud:'曇り',fog:'霧',rain:'雨',snow:'雪',storm:'雷雨'})[kind]};update();}).catch(()=>{}).finally(()=>clearTimeout(timer));}
  function remember(id){const items=get('collection',[]);if(!items.includes(id)){items.push(id);store('collection',items);}}
  el('call-button').addEventListener('click',()=>{const {ctx,band}=window.__nagiContext;const pool=ctx.away?awayReplies:replies[band],opts=pool.filter(x=>x!==previousReply);previousReply=opts[Math.floor(Math.random()*opts.length)];el('reply-bubble').textContent=previousReply;el('reply-bubble').hidden=false;});
  el('letter-button').addEventListener('click',()=>{const key=dateKey();el('letter-content').textContent=letters[mod(dayNumber(key),5)];localStorage.setItem(K+'letter-read',key);remember('letter');el('letter-badge').hidden=true;el('letter-overlay').hidden=false;el('letter-close').focus();});
  el('diary-button').addEventListener('click',()=>{const {now,key,ctx,dayNumber:day,weather:currentWeather}=window.__nagiContext;el('diary-date').textContent=diaryDateFmt.format(now);const event=ctx.cat?'cat':isLetterDay(key)?'letter':ctx.away?'away':ctx.dance?'dance':ctx.nightRare||ctx.rareEvening?'rare':null;el('diary-content').textContent=diaryFor({special:!!ctx.special,event,weather:currentWeather?.kind,dayNumber:day});el('diary-overlay').hidden=false;el('diary-close').focus();});
  function close(id,focus){el(id).hidden=true;el(focus).focus();}el('diary-close').addEventListener('click',()=>close('diary-overlay','diary-button'));el('letter-close').addEventListener('click',()=>close('letter-overlay','letter-button'));['diary-overlay','letter-overlay'].forEach(id=>el(id).addEventListener('click',e=>{if(e.target.id===id)close(id,id==='diary-overlay'?'diary-button':'letter-button');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!el('diary-overlay').hidden)close('diary-overlay','diary-button');if(!el('letter-overlay').hidden)close('letter-overlay','letter-button');}});
  update();fetchWeather();setInterval(update,30000);
}());
