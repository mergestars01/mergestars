# MERGE AI workspace — განხორციელების ანგარიში

თარიღი: 2026-10-15. სტატუსი: **ნაწილობრივი განხორციელება არსებულ Museum-ის კოდში; რეალური CORE/staging ინტეგრაცია დაბლოკილია. გამოქვეყნება არ შესრულებულა.**

ხელმისაწვდომი პროექტია არსებული MERGE Living Museum, project_id `appgprj_6ac2d9927d988191937a1887d59dfef8`, საწყისი გამოქვეყნებული ვერსია 46, commit `6e9dec828ecc63ff5e04efca0f14e0e47fb2987e`. ამ სამუშაო სივრცეში mergestars.com-ის CORE backend-ის სამუშაო კოდი და ავტორიზებული მართვის კონტრაქტები ხელმისაწვდომი არ არის. ამ ორ გარემოს ერთმანეთად არ ვაცხადებთ.

## განხორციელებული ცვლილებები

- დამატებულია `/dashboard/merge-ai`, არსებული კერძო Museum-ის sign-in-ის გამოყენებით. ეს **არ არის საერთო MERGE CORE ავტორიზაციის დასრულება**.
- ძველი Museum/Brand Museum-ის MERGE AI მოქმედება ხსნის ახალ კომპონენტურ სამუშაო სივრცეს იმავე პროექტში. შენარჩუნებულია დაბრუნების ძველი callbacks, focus და კამერის მეხსიერების კოდი.
- ატვირთული dashboard-ის მიხედვით აწყობილია შავი/ოქროსფერი header, sidebar, ხუთსაფეხურიანი ცენტრალური პანელი და AI პანელი; ახალი კომპონენტები ადაპტირდება ეკრანის ზომასთან. ვიზუალური browser შედარება ჯერ არ შესრულებულა.
- გამოყენებულია უცვლელი ოფიციალური კომპანიის ლოგო. ახალი Museum რეფერენსი მხოლოდ header-ის დეკორატიული პანორამაა; ინტერფეისი რეალური ელემენტებისგან შედგება. დახურული/ღია კარის ან აქტიური ქალაქის გამოსახულება არ ჩანაცვლებულა.
- ახალი workspace-ის ინტერფეისის ტექსტები ინგლისურია. სხვა დამტკიცებული Museum ეკრანების სრული თარგმნა ამ ცვლილებით არ მომხდარა. მომხმარებლის მიერ შეყვანილი ტექსტი თვითნებურად არ ითარგმნება.
- მუშაობს ბრენდის სამუშაო აღწერის შევსება, სოციალური არხებისა და რეგისტრაციის გზის არჩევა, კონტენტის პარამეტრები, ტექსტური brief-ის მომზადება, კოპირება, TXT ჩამოტვირთვა და clipboard-ის შეცდომის ხელით აღდგენა. ეს არის შაბლონური მომზადება, არა AI გენერაცია ან CORE save.
- გამართულია transient brief-ის გასუფთავება დახურვისას და კერძო სესიის სუბიექტის შეცვლისას. არსებული private-session ID გამოიყენება მხოლოდ UI remount-ისთვის; ახალი CORE იდენტობა არ შექმნილა.
- შვიდივე სოციალური არხი აჩვენებს SETUP REQUIRED-ს. საიტზე გადასვლა, checkbox ან მომხმარებლის მიერ ანგარიშის არსებობის მითითება CONNECTED-ს ვერ ქმნის.
- AI quick prompts ცვლის მხოლოდ შეტყობინების მონახაზს. გაგზავნა გამორთულია: რეალური ჩატი/ისტორია არ იმიტირდება.
- განახლებულია კომერციული, VIP, შემოწმებისა და გადახდის გზის ტექსტი: **რეგისტრაცია → 12 მოდელი → მომხმარებლის დადასტურებით 12 ოფიციალური CORE შეკვეთა → გადახდა → დაფარვა → ავტორიზებული წარმოება**. შეკვეთის რეალური შექმნის endpoint კვლავ მიუწვდომელია.
- 12 Brand Line-ის ადგილი ნაჩვენებია როგორც დაგეგმვის ადგილი და არა არსებული მოდელი, Order ID ან გაყიდვების მრიცხველი. პროდუქტის შენახვა მომხმარებლის ცალკე დადასტურების გარეშე შეკვეთად არ ითვლება.
- შენარჩუნებულია Silver = 1 ნივთი და Gold = დამტკიცებული წონის ფარგლებში 12-მდე ნივთი; არსებული 33/33/16.5/16.5/1 განაწილება და ცალკე 2% საფასური არ გადათვლილა ახალ ფინანსურ ძრავად.

## კავშირებისა და მონაცემების მდგომარეობა

| ეკრანი / შესაძლებლობა | რეალური მდგომარეობა |
| --- | --- |
| ახალი workspace — კერძო Museum sign-in | არსებული sign-in კოდი გამოყენებულია; browser login NOT RUN |
| საერთო MERGE CORE identity/session | BLOCKED — ავტორიზებული session integration აკლია |
| Brand information / 12 რეალური Lines / Catalog / QR | CORE მონაცემები არ ჩატვირთულა; მხოლოდ მკაფიო pending და სამუშაო ველები |
| Brand House-ის გადამოწმება | არსებული `/api/core/brand-house` boundary, რომელიც 503 DEPENDENCY REQUIRED-ს აბრუნებს |
| Email create/connect | მხოლოდ არჩევანი; პროვაიდერის გარეშე mailbox/ACTIVE არ იქმნება |
| Social connections | SETUP REQUIRED; OAuth, account creation და რეალური CONNECTED მდგომარეობა დაუკავშირებელია |
| Content preferences / Final Review | transient brief მუშაობს; CORE save, AI generation და Launch გამორთულია |
| Personal AI chat / history | BLOCKED — რეალური server-backed AI კონტრაქტი/კონფიგურაცია არ არის |
| Social gallery / Fit / Product actions | მხოლოდ მიუწვდომელი მდგომარეობა; გამოგონილი მედია არ ემატება |
| Activity / commissions / deferred balance | რეალური მონაცემი არ არის; ნაჩვენებია „— / NOT AVAILABLE“, არა ნულები |
| 12 ოფიციალური შეკვეთის დადასტურება | მოთხოვნა და UI გზა აღწერილია; რეალური Order ID არ შექმნილა |
| Payment / production / QC / Passport | არსებული fail-closed მდგომარეობა შენარჩუნებულია |
| არსებული საჯარო catalog/collection/model/metal reads | კოდი უცვლელია; კონტრაქტული ტესტები გაიარა. ამ სამუშაოში ახალი LIVE E2E არ შესრულებულა |

**ახალი workspace-ის არც ერთი პერსონალური/ფინანსური ეკრანი ჯერ არ იყენებს დადასტურებულ პერსონალურ CORE მონაცემს.** არსებული CORE public read კოდი ახალ საერთო სესიად ან ახალი კომერციული ინტეგრაციის მტკიცებულებად არ ითვლება.

რეალურად არსებული fixed read კონტრაქტებია CORE `/users/me` (ვალიდირებული Bearer), `/catalog/public`, `/catalog/public/:slug`, `/metals/live` და უკვე არსებული პროდუქტის მოდელის relay. ახალი guessed endpoint არ დამატებულა. ყველა ძველი `/api/core/*` POST კვლავ ამოწმებს არსებულ identity/origin boundary-ს და დაუკავშირებელი CORE-ის შემთხვევაში 503-ს აბრუნებს. კლაიენტის payment/connected flags ამას ვერ ცვლის.

ამ კერძო Site-ის runtime configuration: revision 0, configured entries 0. Meshy, AI, email/OAuth, payment და წარმოების სისტემების საიდუმლოებები არ დამატებულა ან გამოგონილა.

## რა შენარჩუნდა

დახურული კარი, დამტკიცებული ღია კარი, ნელი გახსნის თანმიმდევრობა, აქტიური Megapolis, 12 HOUSE, ძველი ნავიგაციის callbacks, პირადი drafts-ის API/სქემა, არსებული საჯარო CORE read კონტრაქტები, ფინანსური დაცვის POST boundary და ოფიციალური logo/source ფაილები.

`docs/MERGE_AI_WORKSPACE_PRESERVATION.json` შეიცავს კარის, ქალაქისა და ოფიციალური ლოგოს SHA-256 საკონტროლო ჰეშებს. ისინი საწყისს ემთხვევა. ძველი drafts-ის რეალური მონაცემების ჩატვირთვა/მიგრაცია არ ჩატარებულა; მათი კოდი და სქემა უცვლელია. არ ვამტკიცებთ რეალურ მონაცემთა ბაზაზე შესრულებულ regression ტესტს.

## შეცვლილი / დამატებული ფაილები

| ფაილი | ცვლილება |
| --- | --- |
| `app/dashboard/merge-ai/page.tsx` | სამუშაო სივრცის ახალი არსებული-პროექტის route |
| `app/merge-ai.css` | იზოლირებული luxury/responsive სტილები |
| `app/layout.tsx` | ახალი სტილის import |
| `app/page.tsx` | არსებული სესიის scope მხოლოდ UI reset-ისთვის |
| `components/merge-ai-workspace.tsx` | header, sidebar, ხუთი ნაბიჯი, order journey და კომპოზიცია |
| `components/merge-ai-panels.tsx` | editable პანელები, brief, email/social pending, chat draft, gallery/activity |
| `components/personal-merge-ai.tsx` | არსებული Museum entry point-ის თავსებადი wrapper |
| `components/museum.tsx` | ახალი workspace dialog, ინგლისური სათაური, scope reset და განახლებული order გზა |
| `components/order-funding-path.tsx` | ოფიციალური unpaid order → PAY NOW / PAY LATER |
| `components/entry-payment-law.tsx` | წინასწარი გადახდისა და 1,000-ის ლოდინის გარეშე order დადასტურების წესი |
| `components/item-coin-law.tsx` | 12 ნამდვილი Order ID-ისა და გადახდილი Coin-ის გამიჯვნა |
| `components/commercial-readiness.tsx` | განახლებული order/offer/payment/production თანმიმდევრობა |
| `components/vip-journey.tsx` | ოფიციალური შეკვეთის ცალკე ეტაპი გადახდამდე |
| `lib/merge-ai-manager.ts` | მკაცრი brief schema და Founder order სპეციფიკაცია; არ ქმნის CORE ჩანაწერს |
| `lib/social-brand-preparation.ts` | მომზადებული სამუშაო ტექსტები ინგლისურად |
| `public/assets/merge-ai-approved-panorama.png` | მოწოდებული ახალი რეფერენსი, header-ის დეკორატიული გამოყენება |
| `tests/personal-merge-ai.mjs` | რეალური კომპონენტების rendering/callback/validation/reset/security შემოწმებები |
| `docs/APPROVED_MERGE_AI_WORKSPACE_AND_ORDER_LAW.md` | 21-სექციანი scoped Founder გაფართოება |
| `docs/MERGE_AI_WORKSPACE_PRESERVATION.json` | აქტივებისა და Master prompt-ის სრული პრეფიქსის შენარჩუნების მტკიცებულება |
| `docs/MERGE_AI_WORKSPACE_IMPLEMENTATION_2026_10_15.md` | ეს ანგარიში |

სრული არსებული Master prompt-ის 116,899 საწყისი ბაიტი უცვლელ პრეფიქსად შენარჩუნდა; 21-სექციანი გაფართოება ბოლოში დაემატა. ახალი სრული ფაილი 133,857 ბაიტია. ორიგინალი 71 სექცია, Social Extension 19 და Visual Extension 17 არ გადანომრილა და არ გადაეწერა.

## მონაცემთა ბაზა

**ცვლილებები: 0. მიგრაციები: 0. ახალი მომხმარებლების/House/პროდუქტების/შეკვეთების/საკომისიოს ბაზა: 0.** ახალი UI არ წერს CORE-ში, D1-ში, localStorage-ში ან sessionStorage-ში. ოფლაინ brief მხოლოდ React-ის დროებით მეხსიერებაშია, მომხმარებლის კოპირების/ჩამოტვირთვის გარდა. ისტორიული ფინანსური ჩანაწერი არ შეცვლილა.

## ტესტები და ფარგლები

| შემოწმება | შედეგი | რეალურად რა შემოწმდა |
| --- | --- | --- |
| `node tests/personal-merge-ai.mjs` | PASS | ინგლისური SSR, ოფიციალური ლოგო, უნიკალური IDs/შიდა anchors, 7 pending არხი, მკაცრი validation/spoof rejection, რეალური form/field/review callbacks, copy/download/fallback, reset, disabled external actions |
| `node tests/coin-museum.mjs` | PASS | 12 HOUSE, Gold/Silver განსხვავება, კლიენტისგან forged entitlement/წონის/გადახდის უარყოფა, mock API auth/origin/fail-closed |
| `node tests/registration-funding.mjs` | PASS | transient registration, PII-ს შენახვის/გაგზავნის არარსებობა, საინფორმაციო funding არჩევანი და ცალკე LIVE reference |
| `node tests/photo-megapolis.mjs` | PASS | ზუსტი ქალაქის hash, hotspot callbacks, 12 HOUSE, disabled guards, არსებული ბმები; არა GPU/browser მოძრაობა |
| `node tests/museum-gate.mjs` | PASS | დახურული/ღია კარის ზუსტი hash, ნელი თანმიმდევრობა, open hold, error/duplicate-entry guards, იგივე ქალაქის მიზანი |
| `node tests/coin-sky-prices.mjs` | PASS | CORE reference და payable offer-ის გამიჯვნა, troy ერთეულები, stale-data cancellation, no fake markup/quote |
| `node tests/core-read-contract.mjs` | PASS | fixed reads, response/schema/ID/permission/session/timeout კონტრაქტები; არა რეალური owner session |
| TypeScript `tsc --noEmit --incremental false` | PASS | ტიპების შემოწმება |
| Sites `build-site.mjs` | PASS | Vinext/Vite build და `/dashboard/merge-ai` route; final archive აგება იგივე workflow-ში |
| `git diff --check` | PASS | whitespace/conflict-marker შემოწმება |
| Pixel comparison / mobile browser / keyboard E2E | NOT RUN | მხარდაჭერილი browser ინსტრუმენტი ხელმისაწვდომი არ არის |
| რეალური shared CORE login/owner/permissions E2E | BLOCKED | არ არის მოქმედი საერთო session/მართვის კონტრაქტი |
| 12 რეალური CORE Order ID / idempotent retry | BLOCKED | backend model/order contracts აკლია |
| Email/OAuth/AI chat/publication/history E2E | BLOCKED | შესაბამისი სერვისები და ნებართვები არ არის გამართული |
| Payment/commission/production/QC/Passport staging | BLOCKED | რეალური contract/staging/evidence აკლია |

ამ გაშვებებში FAIL არ დაფიქსირდა. PASS არ ნიშნავს დაუკავშირებელი ფუნქციის დასრულებას. Build აჩვენებს warning-ს 500 kB-ზე დიდ chunk-ზე და Vinext-ის static route-classification შეზღუდვას; ბრაუზერის შესრულება/დატვირთვის გაზომვა არ განხორციელებულა.

Browser QA-ის კონკრეტული შეზღუდვა: [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) ამბობს: “If `$control-browser` is unavailable, skip browser QA”. ამიტომ preview server ან სხვა browser გზა არ ჩანაცვლებულა. იგივე skill-ის troubleshooting მოითხოვს ამ შეზღუდვის დაფიქსირებას.

## staging-მდე აუცილებელი პირობები

1. უშუალოდ არსებული mergestars.com-ის მიმდინარე სამუშაო source/routes და შეთანხმებული shared session/CORE authorization კონტრაქტი.
2. რეალური House/Line/Product/Version/Order schema და user-confirmation/idempotency ნაკადი, რომელიც ოფიციალურ unpaid შეკვეთას მოდელის შენახვის შემდეგ ქმნის. არსებული CORE თუ ამას ვერ უჭერს მხარს, ცვლილება უნდა გაკეთდეს CORE-ში, არა Museum-ის ცალკე ბაზაში.
3. რეალური backend AI/history, email provisioning და თითოეული სოციალური არხის მხარდაჭერილი ოფიციალური integration/configuration.
4. როლები, უფლებები, authorized brand assets/media, activity/commission reads და მოქმედი versioned policy.
5. არსებული CORE staging გარემო და მხარდაჭერილი browser QA წვდომა. კერძო production URL-ს staging არ ეწოდება.

## LIVE-მდე აუცილებელი პირობები

რეალური shared identity/House/12 order staging PASS; payment და available-commission settlement evidence; unpaid/unauthorized production-ის უარყოფის მტკიცებულება; უფლებები, რეალური manufacturer/QC/Passport/QR; browser/mobile E2E; rollback-ის შემოწმება და დამფუძნებლის აშკარა დამტკიცება.

ამ სამუშაოში production deploy, სოციალური ანგარიშის შექმნა, პუბლიკაცია, თანხის ჩამოჭრა, საკომისიოს დარიცხვა ან წარმოების ავტორიზაცია არ შესრულებულა. გამოქვეყნებული საწყისი ვერსია 46 რჩება rollback-ის საწყის ნიშნულად; ახალი სამუშაო შეინახება source version-ად და არა დამტკიცებულ staging/LIVE ინტეგრაციად.
