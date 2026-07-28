# הנחיות פרויקט - about.rotem-dev.org

עודכן: 2026-07-28
סטטוס: האתר פורסם ל-GitHub Pages ומחליף את `about.rotem-dev.org`.
ריפו עבודה פעיל: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d`
קומיט פרסום אחרון לפני עדכון ההנחיות: `9b5ba32`

## מטרת האתר

זה אתר About אישי של רותם זכאים, לא אתר מוצר של Maya ולא תצוגת mascot.

האתר צריך להציג את רותם כאיש Security Operations, תשתיות, troubleshooting, אוטומציה וכלי AI מעשיים. Maya היא הוכחה חזקה אחת בתוך הסיפור, יחד עם כלים ומערכות נוספות, אבל היא לא מרכז המותג.

## תוכן ומבנה

התוכן הנוכחי בנוי סביב:

- Hero: `Rotem Zacaim` / `רותם זכאים`, Cyber Security, infrastructure operations, AI automation.
- `Profile`: ניסיון תפעולי, אבטחת מידע, תשתיות, ניטור ותגובה.
- `Tool Lab`: הכלים שרותם בונה ומפעיל, כולל Maya, RoteMGPT, RedLab, ZACAIM, Local GGUF, Cloudflare Access, Home Assistant, Android Lab, URL Intelligence, Google Calendar ו-SQLite Memory.
- `Systems & tools`: ארבעה כרטיסים ציבוריים: Security operations, Maya AI agent, Private control center, Security workbenches.
- `Architecture`: Secure access, Message runtime, Tool layer, Model layer, Observability.
- `Experience`: מבוסס קורות חיים 2026, כולל תפקידי security/infrastructure operations, חמ"ל/מרכז שליטה, משטרה ותפעול.
- `Certifications`: Cyber Defender, QA, CCNA, Jr Penetration Tester, Applied Ethical Hacking ועוד.
- `Contact`: אימייל, LinkedIn וקישורי קשר ציבוריים בלבד.

## מקורות מידע

- קורות החיים שסופקו הם מקור האמת לניסיון והסמכות.
- מסמכי פרויקט Maya/MOM משמשים לתיאור יכולות וכלים ברמה גבוהה בלבד.
- LinkedIn נחסם בזמן הבדיקה, לכן לא להשתמש בפוסטים או תמונות משם אלא אם המשתמש מספק צילום מסך או קובץ.
- דומיין ה-control center הפרטי מוגן Cloudflare Access. באתר מתארים "private control center" ולא מבטיחים קישור ציבורי פתוח או חושפים hostname תפעולי.

## כללי בטיחות ופרטיות

אסור לפרסם באתר:

- טלפון, כתובת, group IDs, phone IDs, tokens, API keys, credentials או secrets.
- hostnames פנימיים, פורטים, שמות שירותים פרטיים, paths תפעוליים או פרטי tunnel רגישים.
- הוראות offensive security, שרשראות תקיפה או צעדים שיכולים לשמש לרעה.

מותר לתאר:

- Cloudflare Access/Tunnel ברמה ארכיטקטונית.
- allowlisted/private tools ברמה כללית.
- מודלים מקומיים, observability, automations ו-tool layer בלי פרטי גישה.

## דמות 3D

הדמות היא אלמנט חתימה תומך, לא נושא האתר.

החלטות חובה:

- להשתמש בארנב הקיים `assets/3d/rotem-z-rabbit.glb` כל עוד לא נבחר נכס טוב יותר.
- לשמור על המראה המקורי של הארנב ככל האפשר.
- לא להוסיף טקסט runtime על החולצה, כולל לא `rotem.z`.
- החולצה נשארת כמו במודל המקורי, עם סמל הגולגולת.
- לא להוסיף ידיים מזויפות, מצביעים חיצוניים או גיאומטריה שמחליפה את היד האמיתית.
- אם רוצים הצבעה אמיתית בעתיד, צריך מודל rigged עם bones תקינים או ניקוי/rigging ב-Blender.
- המודל הנוכחי אינו rigged בצורה שמאפשרת אנימציית יד אמיתית, לכן התנועה הנוכחית היא whole-model/procedural: idle, מבט, תזוזה לצד, ותגובות גלילה.

כיוון תנועה:

- באנגלית/LTR: הדמות עומדת בצד ימין ומצביעה שמאלה, אל התוכן.
- בעברית/RTL: הדמות עומדת בצד שמאל ומצביעה ימינה, אל התוכן.
- layout האתר שומר מסילה לדמות, כך שטקסט לא נכנס מתחתיה גם בדסקטופ וגם במובייל.

## פיתוח ופרסום

האתר סטטי ונשאר על GitHub Pages אלא אם יש סיבה אמיתית לעבור לשרת.

קבצים מרכזיים:

- `index.html` - מבנה תוכן וסקשנים.
- `styles.css` - layout, responsive, דמות, RTL/LTR.
- `script.js` - i18n, Three.js, character state, scroll behavior.
- `assets/3d/character-manifest.json` - הפעלת GLB.
- `assets/3d/rotem-z-rabbit.glb` - נכס הדמות הנוכחי.
- `test/about-page.test.js` - חוזה בדיקות לתוכן, בטיחות והדמות.

לפני שמצהירים שמשהו מוכן:

```powershell
node --test test\about-page.test.js
git diff --check
git status --short
```

אם מפרסמים:

```powershell
git push origin HEAD:main
```

לא להוסיף את `assets/3d/night-city-resident.glb` בלי אישור מפורש; הוא קובץ לא קשור שנשאר לא במעקב.
