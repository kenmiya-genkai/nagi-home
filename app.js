(function () {
  'use strict';

  const bands = {
    morning: {
      label: 'あさのなぎ', image: 'assets/morning.webp', alt: '朝ごはんを食べるなぎ',
      lines: [
        'おはよう。朝ごはん、ちゃんと食べる派です',
        'パンの焼けるにおいって、しあわせだよね',
        'いただきます。今日もいい日になりますように'
      ]
    },
    noon: {
      label: 'ひるのなぎ', image: 'assets/noon.webp', alt: 'ごろごろ読書をするなぎ',
      lines: [
        'ごろごろ読書中。いま、いいところ',
        'この本もう3回目。なのにまた泣きそう',
        '読書とお昼寝、どっちが先か迷う時間…'
      ]
    },
    evening: {
      label: 'ゆうがたのなぎ', image: 'assets/evening.webp', alt: 'テレビを見るなぎ',
      lines: [
        'ドラマの続き、気になって仕方ない',
        'ぼーっとテレビ。こういう時間も大事',
        'お茶いれたよ。そっちも一息ついてる？'
      ]
    },
    night: {
      label: 'よるのなぎ', image: 'assets/night.webp', alt: 'すやすや眠るなぎ',
      lines: [
        'おやすみなさい。また明日ね',
        'すやすや…夢の中でも島の空を見てるかも',
        '今日も一日、おつかれさま'
      ]
    }
  };

  const letters = [
    '空気が冷たくなって、夕日がいちばんきれいな季節になりました。今日の夕日は見た？ 私は窓からずーっと眺めてたよ。',
    'このあいだ読み始めた本、やっと読み終わりました。最後の10ページ、もったいなくてゆっくり読んだ。次は何を読もうかな。',
    '島の猫が家の前で日なたぼっこしてた。起こさないように、そーっと写真だけ撮ったよ。今度見せるね。',
    '手紙って、届くまでの時間も贈りものだと思う。だから、たまにしか書かないの。…うそ。書きたいときに書いてるだけ。',
    'いつも覗きに来てくれてありがとう。ここにいると、私もひとりじゃない気がするよ。'
  ];

  const REPLIES = {
    morning: ['ん？ おはよう。呼んだ？', 'はーい。朝ごはん、もうすぐできるよ', 'ふふ、なあに？'],
    noon: ['んん？ …あと5ページだけ', '呼んだ？ ちょうど眠くなってきたとこ', 'なあに？ お茶いれる？'],
    evening: ['ん？ テレビ、巻き戻そっか', 'はーい。今日も一日おつかれさま', '呼んだ？ となりに座る？'],
    night: ['んん…ねむい…呼んだ…？', 'ふわぁ…おやすみの途中だったのに', '大丈夫、起きたよ。なあに？']
  };

  const AWAY_REPLIES = [
    '（返事はない…お出かけ中みたい）',
    '（しーん。留守だね、今日は）',
    '（声だけが家に響いた）'
  ];

  const DIARY = [
    '今日の夕日は格別だった。写真に撮っても、本物にはかなわない。',
    '本を読みすぎて肩がこった。でもやめられない。',
    '島の猫と目が合った。向こうも同じことを考えてた気がする。',
    '風の音を聞きながらぼーっとした。こういう日も大事。',
    '新しいお茶を開けた。香りだけで幸せ。',
    '波の音が子守歌みたいで、昼寝が長くなった。',
    '手紙を書いた。届くまでの時間が、また楽しい。',
    '今日は雲の流れが速かった。明日は晴れるかな。',
    'ドラマの最終回。泣いた。しばらく引きずりそう。',
    '何もしない日。それもまた、いい日。'
  ];

  const AWAY_NOTES = [
    'おでかけ中です。島をぐるっと散歩してくるね。夕方には戻るよ。— なぎ',
    'ちょっと海を見に行ってきます。お土産話、待っててね。— なぎ',
    '島の反対側までお散歩中。戻ったらお茶にしよう。— なぎ'
  ];

  const AWAY_IMAGES = {
    morning: 'assets/away-day.webp',
    noon: 'assets/away-day.webp',
    evening: 'assets/away-evening.webp',
    night: 'assets/away-night.webp'
  };

  function dayNumberFor(dateKey) {
    const parts = dateKey.split('-').map(Number);
    return Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  }

  function isLetterDay(dateKey) {
    return dayNumberFor(dateKey) % 3 === 0;
  }

  function isCatDay(dateKey) {
    return dayNumberFor(dateKey) % 4 === 1;
  }

  function isAwayDay(dateKey) {
    return dayNumberFor(dateKey) % 10 === 3;
  }

  function isDanceDay(dateKey) {
    return dayNumberFor(dateKey) % 7 === 5;
  }

  function visitorFor(dateKey) {
    const dayNumber = dayNumberFor(dateKey);
    if (dayNumber % 5 !== 2) return null;
    return Math.floor(dayNumber / 5) % 2 === 0 ? 'ushio' : 'kouchan';
  }

  function weatherKind(code) {
    if (code === 0) return 'clear';
    if (code === 1 || code === 2) return 'partly';
    if ([45, 48].includes(code)) return 'fog';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([95, 96, 99].includes(code)) return 'storm';
    if (code === 3) return 'cloud';
    return 'cloud';
  }

  function pickDiaryIndex(dateKey) {
    return ((dayNumberFor(dateKey) % DIARY.length) + DIARY.length) % DIARY.length;
  }

  function pickLetterIndex(dateKey) {
    return ((dayNumberFor(dateKey) % 5) + 5) % 5;
  }

  function bandForHour(hour) {
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'noon';
    if (hour >= 16 && hour < 22) return 'evening';
    return 'night';
  }

  function awayImageFor(band) {
    return AWAY_IMAGES[band];
  }

  function pickLineIndex(dateKey, band) {
    // UTC midnight day count keeps this pure and independent of the viewer's zone.
    const dayNumber = dayNumberFor(dateKey);
    const offset = Object.keys(bands).indexOf(band);
    return ((dayNumber + offset) % 3 + 3) % 3;
  }

  window.NAGI_HOME = { bandForHour, pickLineIndex, isLetterDay, pickLetterIndex, isCatDay, pickDiaryIndex, isAwayDay, isDanceDay, visitorFor, weatherKind, awayImageFor };

  const hourFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', hourCycle: 'h23'
  });
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const diaryDateFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric'
  });

  let currentBand = 'morning';
  let previousReply = null;
  let currentWeather = null;
  let danceVideoOpen = false;

  function dateKeyAt(date) {
    const parts = Object.fromEntries(dateFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function update() {
    const now = new Date();
    const dateKey = dateKeyAt(now);
    const hour = Number(hourFormatter.format(now));
    const band = bandForHour(hour);
    currentBand = band;
    const data = bands[band];
    const catToday = band === 'noon' && isCatDay(dateKey);
    const awayToday = isAwayDay(dateKey);
    // Keep the dance mode decision and its presentation together for a future video swap.
    const danceToday = band === 'evening' && isDanceDay(dateKey) && !awayToday;
    const showLetter = isLetterDay(dateKey);
    const visitor = visitorFor(dateKey);
    document.body.className = `band-${band}`;
    document.getElementById('time').innerHTML = `${timeFormatter.format(now)} <span>JST</span>`;
    document.getElementById('band-label').textContent = awayToday ? 'おでかけ中' : (danceToday ? 'ダンスタイム♪' : data.label);
    const line = document.getElementById('line');
    line.hidden = awayToday;
    line.textContent = danceToday
      ? '見て見て、ダンスタイム！ 夕方は踊りたくなるの'
      : catToday
      ? '猫が来た。読書は中断、これは仕方ない'
      : data.lines[pickLineIndex(dateKey, band)];
    const image = document.getElementById('nagi-image');
    const photoVisual = document.getElementById('photo-visual');
    photoVisual.classList.toggle('dancing', danceToday);
    const photoCard = document.querySelector('.photo-card');
    const danceVideoCard = document.getElementById('dance-video-card');
    const danceButton = document.getElementById('dance-button');
    const danceVideo = document.getElementById('dance-video');
    if (!danceToday && danceVideoOpen) {
      danceVideo.pause();
      danceVideoOpen = false;
    }
    photoCard.hidden = danceToday && danceVideoOpen;
    danceVideoCard.hidden = !danceToday || !danceVideoOpen;
    danceButton.hidden = !danceToday;
    const nextImage = awayToday ? awayImageFor(band) : (catToday ? 'assets/noon-cat.webp' : data.image);
    if (image.getAttribute('src') !== nextImage) {
      image.classList.add('image-changing');
      image.onload = () => image.classList.remove('image-changing');
      image.src = nextImage;
    }
    image.alt = awayToday ? 'おでかけ中で空っぽのお部屋' : (catToday ? '猫と一緒にごろごろするなぎ' : data.alt);
    const awayNote = document.getElementById('away-note');
    awayNote.textContent = AWAY_NOTES[((dayNumberFor(dateKey) % 3) + 3) % 3];
    awayNote.hidden = !awayToday;
    document.getElementById('away-letter-note').hidden = !awayToday || !showLetter;
    const visitorNote = document.getElementById('visitor-note');
    visitorNote.hidden = awayToday || !visitor;
    visitorNote.textContent = visitor === 'ushio'
      ? (showLetter ? '潮が手紙を届けに来てくれた。「いつもありがとう」って、笑ってた。' : '潮が顔を出してくれた。海の話を少しだけ。')
      : (visitor === 'kouchan' ? 'こうちゃんが遊びに来た。お菓子を置いていってくれた。' : '');
    const fx = document.getElementById('weather-fx');
    fx.className = `fx-layer${currentWeather ? ` fx-${currentWeather.kind}${currentWeather.kind === 'clear' && band === 'evening' ? ' fx-sunset' : ''}` : ''}`;
    const weatherChip = document.getElementById('weather-chip');
    weatherChip.hidden = !currentWeather;
    if (currentWeather) weatherChip.textContent = `玄界島の空：${currentWeather.icon}${currentWeather.label}`;
    const letterButton = document.getElementById('letter-button');
    letterButton.hidden = !showLetter;
    document.getElementById('letter-badge').hidden = !showLetter || localStorage.getItem('nagi-home-letter-read') === dateKey;
  }

  function fetchWeather() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=33.684&longitude=130.238&current=weather_code,is_day&timezone=Asia%2FTokyo', { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('weather unavailable'); return response.json(); })
      .then((data) => {
        const current = data.current;
        if (!current || typeof current.weather_code !== 'number') return;
        const kind = weatherKind(current.weather_code);
        const weather = {
          kind,
          icon: kind === 'clear' ? (current.is_day === 0 ? '🌙' : '☀️') : ({ partly: '🌤️', cloud: '☁️', fog: '🌫️', rain: '🌧️', snow: '❄️', storm: '⛈️' })[kind],
          label: ({ clear: '晴れ', partly: '晴れときどき曇り', cloud: '曇り', fog: '霧', rain: '雨', snow: '雪', storm: '雷雨' })[kind]
        };
        currentWeather = weather;
        update();
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeout));
  }

  const letterButton = document.getElementById('letter-button');
  const letterOverlay = document.getElementById('letter-overlay');
  const letterClose = document.getElementById('letter-close');
  letterButton.addEventListener('click', () => {
    const dateKey = dateKeyAt(new Date());
    document.getElementById('letter-content').textContent = letters[pickLetterIndex(dateKey)];
    localStorage.setItem('nagi-home-letter-read', dateKey);
    document.getElementById('letter-badge').hidden = true;
    letterOverlay.hidden = false;
    letterClose.focus();
  });

  document.getElementById('call-button').addEventListener('click', () => {
    const dateKey = dateKeyAt(new Date());
    const pool = isAwayDay(dateKey) ? AWAY_REPLIES : REPLIES[currentBand];
    const options = pool.filter((reply) => reply !== previousReply);
    const reply = options[Math.floor(Math.random() * options.length)];
    previousReply = reply;
    const bubble = document.getElementById('reply-bubble');
    bubble.textContent = reply;
    bubble.hidden = false;
  });

  const danceButton = document.getElementById('dance-button');
  const danceVideo = document.getElementById('dance-video');
  const danceVideoCard = document.getElementById('dance-video-card');
  const photoCard = document.querySelector('.photo-card');
  danceButton.addEventListener('click', () => {
    const now = new Date();
    const danceToday = bandForHour(Number(hourFormatter.format(now))) === 'evening'
      && isDanceDay(dateKeyAt(now)) && !isAwayDay(dateKeyAt(now));
    if (!danceToday) return;
    if (!danceVideo.hasAttribute('src')) danceVideo.setAttribute('src', 'assets/dance-1.mp4');
    danceVideoOpen = true;
    photoCard.hidden = true;
    danceVideoCard.hidden = false;
    danceVideo.play().catch(() => {
      danceVideoOpen = false;
      danceVideoCard.hidden = true;
      photoCard.hidden = false;
    });
  });
  document.getElementById('dance-return-button').addEventListener('click', () => {
    danceVideo.pause();
    danceVideoOpen = false;
    danceVideoCard.hidden = true;
    photoCard.hidden = false;
  });

  const diaryButton = document.getElementById('diary-button');
  const diaryOverlay = document.getElementById('diary-overlay');
  const diaryClose = document.getElementById('diary-close');
  diaryButton.addEventListener('click', () => {
    const now = new Date();
    const dateKey = dateKeyAt(now);
    document.getElementById('diary-date').textContent = diaryDateFormatter.format(now);
    document.getElementById('diary-content').textContent = DIARY[pickDiaryIndex(dateKey)];
    diaryOverlay.hidden = false;
    diaryClose.focus();
  });
  function closeDiary() {
    diaryOverlay.hidden = true;
    diaryButton.focus();
  }
  diaryClose.addEventListener('click', closeDiary);
  diaryOverlay.addEventListener('click', (event) => {
    if (event.target === diaryOverlay) closeDiary();
  });
  function closeLetter() {
    letterOverlay.hidden = true;
    letterButton.focus();
  }
  letterClose.addEventListener('click', closeLetter);
  letterOverlay.addEventListener('click', (event) => {
    if (event.target === letterOverlay) closeLetter();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !letterOverlay.hidden) closeLetter();
    if (event.key === 'Escape' && !diaryOverlay.hidden) closeDiary();
  });

  update();
  fetchWeather();
  window.setInterval(update, 30000);
}());
