# הנחיות פרויקט - about.rotem-dev.org

עודכן: 2026-07-28
סטטוס: האתר פורסם ל-GitHub Pages ומחליף את `about.rotem-dev.org`.
ריפו עבודה פעיל: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d`
קומיט פרסום אחרון לפני עדכון ההנחיות: `9b5ba32`

## מטרת האתר

זה אתר About אישי של רותם זכאים, לא אתר מוצר של Maya ולא תצוגת mascot.

האתר צריך להציג את רותם כאיש Security Operations, תשתיות, troubleshooting, אוטומציה וכלי AI מעשיים. Maya היא הוכחה חזקה אחת בתוך הסיפור, יחד עם כלים ומערכות נוספות, אבל היא לא מרכז המותג.

## תוכן ומבנה

כיוון התוכן שאושר ב-2026-07-28 הוא Projects First. האתר צריך להוביל מהר מאוד לפרויקטים חיים ומוחשיים, ולא לחזור למבנה הישן של `Profile`, `Tool Lab`, `Systems & tools`, `Architecture`, `Experience` ו-`Certifications`.

- Hero קצר: מזהה את `Rotem Zacaim` / `רותם זכאים`, מציג Security Operations, תשתיות, AI ואוטומציה, ומוביל מיד ל-`Projects`.
- `Projects`: שישה פרויקטים ראשיים עם כפתורי פירוט:
  - `Home Assistant + Maya`
  - `Maya WhatsApp AI Agent`
  - `Local LLM / Cyber Agent`
  - `ROTEMZ Scanner / RedLab`
  - `Zacaim WiFi / Raspberry Pi Lab`
  - `mon / Private Control Center Labs`
- `Lab Gallery`: פרויקטים משניים כגון RoteMGPT, OpenAI Usage, Android Lab, משחקים, Apartment Plan App, AI Super-Analyst, Sale-ים וכלי agents.
- `Timeline`: ציר שנה-אחר-שנה שמציג מה רותם עשה ואיפה, על בסיס קורות החיים.
- `Courses & Skills`: קורסים, הסמכות וקבוצות ידע.
- `Contact`: אימייל ו-LinkedIn בלבד.

אין להחזיר sections ישנים אם הם שוברים את זרימת Projects First. אם צריך לשמר מידע מהם, לשלב אותו בתוך הפרויקטים, ה-timeline או קבוצות ה-skills.

## מקורות מידע

- קורות החיים שסופקו הם מקור האמת לניסיון, מקומות, תפקידים, קורסים והסמכות.
- מסמכי פרויקט Maya/MOM משמשים לתיאור יכולות וכלים ברמה גבוהה בלבד.
- LinkedIn הפך נגיש אחרי שהמשתמש התחבר דרך הדפדפן הפנימי ב-2026-07-28. נאספו 12 פוסטים ו-13 תמונות לתיקיית ה-brainstorm המקומית. ב-production משתמשים רק בעותקים מקומיים תחת `assets/projects/`, לא ב-hotlinks אל `media.licdn.com`.
- ה-control center הפרטי מוגן Cloudflare Access. באתר מתארים אותו כ-`private control center` ולא מבטיחים קישור ציבורי פתוח או חושפים hostname תפעולי.

## כללי בטיחות ופרטיות

אסור לפרסם באתר:

- טלפון, כתובת, group IDs, phone IDs, tokens, API keys, credentials או secrets.
- כתובות IP, hostnames פנימיים, פורטים, שמות שירותים פרטיים, paths תפעוליים או פרטי tunnel רגישים.
- הוראות offensive security, שרשראות תקיפה או צעדים שיכולים לשמש לרעה.

מותר לתאר:

- Cloudflare Access/Tunnel ברמה ארכיטקטונית.
- allowlisted/private tools ברמה כללית.
- מודלים מקומיים, observability, automations ו-tool layer בלי פרטי גישה.

## דמות 3D

הדמות היא אלמנט חתימה תומך וזמני, לא נושא האתר ולא mascot של Maya. נכון ל-2026-07-28 המשתמש רוצה להסיר או להחליף את הארנב בהמשך, אבל לא במסגרת שינוי התוכן הנוכחי. החלפה עתידית צריכה להיות משימה נפרדת עם בחירת נכס, בדיקת רינדור ובדיקות layout.

החלטות חובה:

- להשתמש בארנב הקיים `assets/3d/rotem-z-rabbit.glb` כל עוד לא אושר נכס חלופי במשימה נפרדת.
- לא לערוך, להוסיף או להסתמך על `assets/3d/night-city-resident.glb` בלי אישור מפורש.
- לשמור על המראה המקורי של הארנב ככל האפשר.
- לא להוסיף טקסט runtime על החולצה, כולל לא `rotem.z`.
- החולצה נשארת כמו במודל המקורי, עם סמל הגולגולת.
- לא להוסיף ידיים מזויפות, מצביעים חיצוניים או גיאומטריה שמחליפה את היד האמיתית.
- אם רוצים הצבעה אמיתית בעתיד, צריך מודל rigged עם bones תקינים או ניקוי/rigging ב-Blender.
- המודל הנוכחי אינו rigged בצורה שמאפשרת אנימציית יד אמיתית, לכן התנועה הנוכחית היא whole-model/procedural: idle, מבט, תזוזה לצד ותגובות גלילה.

כיוון תנועה:

- באנגלית/LTR: הדמות עומדת בצד ימין ומצביעה שמאלה, אל התוכן.
- בעברית/RTL: הדמות עומדת בצד שמאל ומצביעה ימינה, אל התוכן.
- layout האתר שומר מסילה לדמות, כך שטקסט לא נכנס מתחתיה גם בדסקטופ וגם במובייל.

## הערת יישום

- תוכן הפרויקטים, ה-timeline וה-skills מתוחזק ב-`script.js` כמבני נתונים ציבוריים ובטוחים לפרסום.
- `index.html` מספק shell סטטי ו-containers לסקשנים.
- `script.js` מרנדר cards ו-detail views לפי השפה הפעילה.

## פיתוח ופרסום

האתר סטטי ונשאר על GitHub Pages אלא אם יש סיבה אמיתית לעבור לשרת.

קבצים מרכזיים:

- `index.html` - shell סטטי ו-containers ל-Hero, Projects, Lab Gallery, Timeline, Courses & Skills, Contact ושורש ה-3D.
- `styles.css` - projects-first layouts, responsive behavior, דמות, RTL/LTR ומצבי פירוט.
- `script.js` - i18n, portfolio data/rendering, project detail/hash interactions, Three.js/character state.
- `assets/projects/` - מדיה מקומית מקודמת לפרויקטים; production משתמש בעותקים מקומיים מכאן.
- `assets/3d/character-manifest.json` - הפעלת GLB.
- `assets/3d/rotem-z-rabbit.glb` - נכס הדמות הזמני הנוכחי.
- `test/about-page.test.js` - חוזה בדיקות לתוכן, בטיחות, responsive behavior והדמות.

לפני שמצהירים שמשהו מוכן:

```powershell
git diff --check -- PROJECT_GUIDANCE.md
node --test test\about-page.test.js
git status --short
```

אם מפרסמים:

```powershell
git push origin HEAD:main
```

לא להוסיף את `assets/3d/night-city-resident.glb` בלי אישור מפורש; הוא קובץ לא קשור שנשאר לא במעקב.
