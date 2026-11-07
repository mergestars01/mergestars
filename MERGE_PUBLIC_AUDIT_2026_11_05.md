# MERGE STARS — საჯარო კოდის და მოქმედი საიტის აუდიტი

შემოწმება: 2026-11-05, Asia/Tbilisi. ეს არის მტკიცებულებებზე დაფუძნებული აუდიტი და არა სრული უსაფრთხოების სერტიფიცირება ან წარმოების E2E დადასტურება.

## მთავარი დასკვნა

პროექტში არსებობს რეალური სერვერი, ანგარიშები, კატალოგები, ადმინისტრირება და ვიზუალური მუზეუმი. თუმცა სრული გზა — ავტორიზებული დიზაინი → რეალური Meshy → Fit → დადასტურებული შეთავაზება → ბანკი → წარმოება → QC → პროდუქტის პასპორტი — დასრულებულად ვერ დასტურდება.

**მთავარი პრობლემა ვერსიების აცდენაა.** საჯარო GitHub, ადგილობრივი სამუშაო კოდი, მეორე GitHub რეპოზიტორია და მოქმედი საიტის მუზეუმი ერთი დამოწმებული release არ არის.

## 1. შემოწმებული წყაროები

| წყარო | შედეგი |
|---|---|
| `https://github.com/tavdo/MERGE_STARS.git` | დამოუკიდებელი shallow clone; default checkout `a81485536ae66ab198ba52ee6a4b359437337161`, commit date 2026-09-08 |
| მოქმედი `https://mergestars.com/` | ბრაუზერში შესასვლელი, მეგაპოლისი, Fashion House, დიზაინის ფანჯარა და რეგისტრაცია შემოწმდა |
| საჯარო API | მხოლოდ GET: metals/live, catalog/public; ასევე robots.txt და sitemap.xml |
| ადგილობრივი პროექტი | ბევრი დაუკომიტებელი ცვლილება; აუდიტისთვის არ გამოყენებულა როგორც საჯარო რეპოზიტორიის ეკვივალენტი |
| `mergestars01/mergestars` | წინა სამუშაოს პასპორტის ცვლილება იქ აიტვირთა `e0ba335`; ეს არ არის `tavdo/MERGE_STARS` |

აუდიტის ასლი: `.artifacts/public-audit-2026-11-05`. წყარო არ შეცვლილა; დაინსტალირდა დამოკიდებულებები, შეიქმნა build/test არტეფაქტები. საიტზე არ შექმნილა ანგარიში, შეკვეთა ან გადახდა და არ ატვირთულა პირადობის დოკუმენტი.

## 2. დაუყოვნებლივ მოსაგვარებელი საკითხები

### P0 — საჯარო SQL მონაცემები

საჯარო checkout-ში `backend/data/users.mysql.sql` შეიცავს INSERT ჩანაწერებს, ელფოსტის მისამართებს, password ველსა და 25 bcrypt მარკერს. ეს რაოდენობა არ არის დამოუკიდებლად დადასტურებული უნიკალური მომხმარებლების რაოდენობა. რეალურობა/მოქმედება არ შემოწმებულა. პირადი მნიშვნელობები ამ ანგარიშში შეგნებულად არ არის გადმოტანილი.

საჭიროა მონაცემთა მფლობელის მიერ შემთხვევის შეფასება, საჯარო გავრცელების შეჩერება, Git ისტორიის კოორდინირებული გასუფთავება და შესაბამისი ანგარიშების/სესიების დაცვის ზომების განსაზღვრა. მხოლოდ შემდეგი commit-იდან ფაილის წაშლა ისტორიულ ასლებს არ შლის. აუდიტს ისტორია არ გადაუწერია.

### P1 — კოდი და მოქმედი საიტი აცდენილია

საჯარო `frontend/src/App.tsx` შეიცავს LandingPage-ს და ძველ Brand Room-ს; მასში `/living-museum` მარშრუტიც არ არის. მოქმედ საიტზე უკვე ჩანს მეგაპოლისი, House-ები, procedural studio და 45 visual studies. ამიტომ საჯარო main-ის ხელახლა განთავსებამ შეიძლება ახალი მუზეუმი წაშალოს. ჯერ უნდა დაფიქსირდეს სერვერზე არსებული commit, სრული source და build-ის წარმომავლობა, შეიქმნას backup და rollback გეგმა.

### P1 — შეკვეთის ფასი კლიენტის მონაცემს ენდობა

`backend/src/modules/coins/dto/submit-application.dto.ts` იღებს `coinValue`-ს რიცხვად; `coins.service.ts` პირდაპირ ინახავს `dto.coinValue`; `orders.service.ts` იყენებს `app.coinValue`-ს. ამ გზაზე ვერ მოიძებნა server-issued verified quote, ვადის შემოწმება ან თანხის დამოუკიდებელი სერვერული დადასტურება. საჭიროა მხოლოდ სერვერული შეთავაზებიდან შეკვეთის შექმნა. ეს კოდის დასკვნაა; მოქმედ საიტზე ფასის მანიპულაციის მცდელობა არ ჩატარებულა.

### P1 — წარმოების სტატუსის არასაკმარისი ბლოკირება

`coins.service.ts:updateStatus` პირდაპირ ანიჭებს მოთხოვნილ სტატუსს; `funds_received` ცალკე იწვევს შეკვეთის გადახდილად მონიშვნას. ამ ფუნქციაში არ ჩანს სავალდებულო ბანკის შეჯერება + ტექნიკური/მატერიალური approval + გადახდის პირობების შემოწმება `in_production`-მდე. ადმინისტრატორის ღილაკი ბანკის მტკიცებულების შემცვლელი არ არის.

### P1 — უსაფრთხო ნაგულისხმევი პარამეტრები

- `auth.service.ts` და `jwt.strategy.ts`: JWT secret-ის არქონისას ცნობილ development fallback-ს იყენებს. Production უნდა გაჩერდეს სავალდებულო secret-ის გარეშე.
- `database-seed.service.ts`: ცარიელ ბაზაზე ადმინისტრატორის ნაგულისხმევი პაროლი აქვს; production-ისთვის ასეთი fallback უნდა გაუქმდეს. მოქმედი სერვერის კონფიგურაცია უცნობია.
- `database/typeorm.options.ts`: synchronize ჩართულია, თუ DB_SYNC ზუსტად false არ არის. Production-ზე საჭიროა კონტროლირებული migrations.
- `audit/audit.controller.ts`: POST audit/events არ იყენებს ამ მეთოდზე auth guard-ს და actor-ს კლიენტის header/body-დან იღებს. `main.ts`-ის audit middleware-ც კლიენტის actor header-ს ენდობა. აუდიტის ავტორობა სანდო სერვერული იდენტობიდან უნდა მოვიდეს.

## 3. ფუნქციების სრული მიმართულებითი შედარება

სტატუსები: **CODE** = რეალური იმპლემენტაცია ნაპოვნია, მაგრამ production E2E არა; **LIVE OBSERVED** = ბრაუზერში/GET-ით ნანახია; **DEMO/CONCEPT** = ვიზუალური ან პროცედურული ნიმუში; **MISSING/BLOCKED** = ამ წყაროში ვერ დასტურდება ან კავშირი აკლია.

| მიმართულება | არსებული მტკიცებულება | დარჩენილი სამუშაო |
|---|---|---|
| CORE ანგარიშები | CODE: auth/users, JWT, refresh, email verification, password reset | რეალური რეგისტრაციის/ხელახალი შესვლის/აღდგენის იზოლირებული E2E |
| პასპორტი ან ID პირველ ეტაპზე | LIVE: მხოლოდ ID-ის წინა/უკანა მხარე; საჯარო კოდის KYC ტიპებში passport არ არის | `e0ba335`-ის მიზნობრივი ინტეგრაცია სწორი production source-ში, frontend+backend ერთად და ატვირთვის ტესტი |
| KYC | CODE: ავტორიზებული დოკუმენტის ატვირთვა, pending, ადმინისტრირება | დოკუმენტის ატვირთვა ≠ ოფიციალური ვინაობის შემოწმება; OCR/provider/liveness ვერ დასტურდება |
| 1,000 რეგისტრაცია | LIVE ფორმა აჩვენებდა 29/1,000 და 971 დარჩენილს | ეს მხოლოდ ეკრანზე ნაჩვენები მაჩვენებელია; უნიკალური დადასტურებული ადამიანების აუდიტი არ ჩატარებულა |
| 0.01 ₾ აქტივაცია | MISSING: საბანკო აქტივაციის სრული სერვისი/ქვითრის შეჯერება ვერ მოიძებნა | დამტკიცებული ბანკი, signed callback, idempotency, refund/overpayment, ერთი გადახდა–ერთი აქტივაცია |
| MERGE/Founder/Brand ID | CODE: ID-ები ანგარიშის შექმნისას გაიცემა | max-existing + next ალგორითმის კონკურენტული უსაფრთხოება; Founding უფლება რეგისტრაციასთან არ გაიგივდეს |
| Brand House | CODE: brand profile და public brand routes | პირველი ავტორიზებული design save → ერთი owner House გარანტია და 1,000+ House მოდელი დასამტკიცებელია |
| კატალოგი | CODE: collections/items CRUD, private/public, ownership checks; LIVE catalog/public HTTP 200 | რეალური მოდელების ხარისხი, version lineage, უფლებები და დიზაინის მტკიცებულებები |
| მუზეუმში შესვლა | LIVE OBSERVED: კარი იღება და მეგაპოლისის მართვა აქტიურდება | მიმდინარე ვიზუალის კოდი ამ საჯარო checkout-ში არ არის; ჯერ source გაერთიანდეს |
| LIVE Coin-ები | LIVE UI: Gold/Silver ბლოკები ჩანს, ორივე კურსი ცარიელია | `/api/metals/live` აბრუნებს `data: []`; უნდა შემოწმდეს provider/settings/cron და timestamp/freshness |
| მეტალის სერვისი | CODE: gold-api fetch, cron, socket broadcast | ძველ კოდში failure-ზე hardcoded ფასები fallback-ად ბრუნდება, source/stale ნიშნის გარეშე; ეს რეალურ LIVE ფასად არ უნდა ჩაითვალოს |
| Fashion House | LIVE OBSERVED: ტანსაცმელი, ფეხსაცმელი, ჩანთები, ქუდები, ქამრები, კოსტუმები, საათი, სათვალე, სამკაული | ყველა კატეგორიის სრულ გენერაციას/შეკვეთას ეს ნავიგაცია არ ადასტურებს |
| 12 ინდუსტრია / 12 პირადი ვიტრინა | LIVE: House/category navigation, 3D room კონტროლი | 12-ვე პირადი ვიტრინა, ლიფტი, 12/12 authorized saves, camera restore, persistence — NOT RUN |
| 1,000+ Houses / 13-Star | მოთხოვნა უცვლელია | 13 არ უნდა გახდეს House-ების ლიმიტი; 12 ინდუსტრია და 12 პირადი ხაზი ცალკე მოდელებია |
| რეალური Meshy | DEMO: MeshyAIPanel fake timed progress; CatalogItemStudio callback აბრუნებს null preview; meshy.hooks მხოლოდ სამომავლო კონტრაქტია | სერვერული job create/poll, error/cancel/retry, owner checks, რეალური GLB, quota, durable job linkage |
| Private Atelier | LIVE OBSERVED: მასალა, მოზაიკა, სტილი, ვარიაცია, brief ფორმა | UI თავად უწოდებს procedural study-ს; generation ღილაკს connection required აქვს; არ გაშვებულა ფასიანი გენერაცია |
| MERGE AI | CODE: OpenAI request + keyword fallback provider | production provider პასუხი არ შემოწმებულა; social OAuth/account ownership/publishing orchestration არ დასტურდება |
| პროგრესული Digital Twin | MISSING ამ საჯარო backend-ში fit profile revision მოდელი | კატეგორიის მხოლოდ საჭირო ზომები, private access, immutable revision, try-on, saved looks, reopen |
| სახლი / ავტომობილი / რენესანსი / საქორწინო / Family | მოქმედი ვიზუალური მუზეუმის რეფერენსების ნაწილი | სრული დიზაინი/რეკონსტრუქცია/სერვისის ფასი/მწარმოებლის შეთავაზება არ არის დადასტურებული |
| მოზაიკა / მასალები | LIVE ატელიე ირჩევს research candidate-ს, არა დამტკიცებულ რეცეპტს | geometry weight, assay, composite fraction, density, process feasibility და manufacturer approval |
| Gold საერთო 1,000 გ ლიმიტი | LIVE brief-ში items AND case ლიმიტი ტექსტად ჩანს | server-side aggregate enforcement ყველა დიზაინისა და ქეისის დონეზე არ დასტურდება |
| ფინანსური პოლიტიკის ვერსიები | CODE: OrdersService-ში 50% დიზაინის royalty hardcoded | 25/25/50 და 33/33/33/1 ისტორიული პოლიტიკა/თარიღი/ledger snapshot ცალკე დასამტკიცებელია |
| Wallet | CODE: ledger და transactions | concurrent writes-ის უსაფრთხოება, ერთჯერადი royalty, order/debit/credit atomicity; DB concurrency tests NOT RUN |
| Verified Offer → Order | ძველი application/order კოდი არსებობს | verified quote მოთხოვნა, owner/revision/expiry, price lock, retry-safe order creation |
| ბანკი / გადახდა | CODE: earnings debit და admin funds_received | რეალური bank callback, reconciliation და payment E2E — BLOCKED |
| Manufacturer Loop | ადმინისტრაციული production/status ფუნქციებია | supplier acceptance, technical pack, lead-time, funded PO, QC evidence, rejection/rework |
| მიწოდება | CODE: tracking და ETA ველები | OrdersService ქმნის synthetic tracking, +14 დღე, shipped-ზე ნაგულისხმევ courier-ს; რეალურ carrier confirmation-ს არ უტოლდება |
| Product Passport | QR/referral/brand კოდი არსებობს | verified material, serial, QC, manufacturer, order და immutable history-იანი პროდუქტის პასპორტი არ დასტურდება |
| QR/referral | CODE: referral attach, share, brand views/scans | ანაზღაურების ატრიბუციის უცვლელობა და duplicate/concurrent protection შესამოწმებელია |
| LIVE PULSE / Founder Control | მუზეუმში ღილაკები არსებობს; server admin/audit modules არის | სრული რეალური observability/incident response/alerts/backup restore ვერ დასტურდება |
| SEO | LIVE robots/sitemap მუშაობს; sitemap 14 URL-ია და login-საც შეიცავს | publicly approved entities, per-route metadata/HTML, noindex private, hreflang, Search Console; ადგილობრივი SEO patch აქ არ არის |
| მობილური | 390px-ზე registration overflow არ აღმოჩნდა | მთლიანი მუზეუმის touch/WebGL/FPS/მეხსიერება/ქსელის სისწრაფე — NOT RUN |
| ხელმისაწვდომობა | registration inputs-ს სახელის/გვარის/ტელეფონის label-კავშირი აკლია | keyboard, focus, form errors, contrast, reduced motion, სრული WCAG შემოწმება |
| სტანდარტები | გეგმები/პანელები არ ნიშნავს შესაბამისობას | ASVS/SSDF/WCAG/PCI/AI RMF/ISO მიზნების evidence matrix და დამოუკიდებელი შეფასება |
| 144 მილიონი / 30+3 / სხვა მიზნობრივი სცენარები | ამ საჯარო წყაროში დამტკიცებული production fulfillment არ ჩანს | forecast ცალკე ledger-ისგან; მოგება/შეკვეთა/აქტივობა არ გამოიგონოს |

## 4. რეალურად შესრულებული შემოწმებები

| შემოწმება | შედეგი |
|---|---|
| Clean public repository clone | PASS — ზუსტი commit დაფიქსირებულია |
| npm ci ორივე package-lock-ით, install scripts გამორთული | PASS |
| frontend TypeScript + Vite production build | PASS |
| backend Nest production build | PASS |
| backend unit tests | PASS — მხოლოდ 1 suite / 1 Hello World test; დროებითი cache permission პრობლემის შემდეგ workspace cache-ით გაიარა |
| ბანკი/CORE რეგისტრაცია/პირადი დოკუმენტი/შეკვეთა E2E | NOT RUN — production ჩანაწერები არ შეგვიქმნია |
| DB migrations / wallet concurrency / backup restore | NOT RUN |
| შესასვლელი → მეგაპოლისი | PASS, ვიზუალური ნავიგაცია |
| Fashion House → category design dialog | PASS, ფორმა გაიხსნა |
| LIVE Gold/Silver კურსი | FAIL — API ცარიელია და UI წერს LIVE RATE NOT PROVIDED |
| პასპორტის არჩევანი live რეგისტრაციაზე | FAIL — მხოლოდ ID-ის ორივე მხარეა |
| public catalog GET | PASS — HTTP 200 JSON; ყოველი asset ცალკე არ შემოწმებულა |
| robots/sitemap ხელმისაწვდომობა | PASS; SEO შინაარსი არასრულია |
| phone-width registration 390×844 | შეზღუდული PASS — scrollWidth 385, viewport 390; სრული accessibility არა |
| 12-ვე House, ლიფტი და 12/12 saved models | NOT RUN |
| ყველა ფოტო/ლოგოს სიზუსტე და დუბლიკატები | NOT RUN — დამტკიცებული საბოლოო asset manifest საჭიროა |
| penetration test / dependencies vulnerability audit | NOT RUN |

Build performance: frontend main JS ≈2.34 MB minified / 649 KB gzip; GLB ≈29.57 MB. ეს არის build არტეფაქტების ზომა, არა ყველა გვერდის აუცილებელი გადმოწერა ან რეალური Core Web Vitals. საჭიროა lazy-loading, 3D/texture compression და რეალური მობილური გაზომვა.

## 5. სამუშაოების სწორი რიგი

1. P0 მონაცემების შემთხვევის დამუშავება; ღია SQL და ისტორია მფლობელთან შეთანხმებით გასუფთავდეს.
2. მოქმედი სერვერის source/commit/build და DB/uploads backup დაფიქსირდეს. ერთიანი სანდო release შეიქმნას ისე, რომ არსებული CORE და მუზეუმი შენარჩუნდეს.
3. უსაფრთხო production configuration: secrets required, seed fallback off, migrations, audit identity, access controls.
4. პასპორტის/ID ცვლილება შერჩეულ source-ში ჩაიტანოს; test environment-ში account→upload→pending→review→login გამოცდა.
5. LIVE metals წყარო აღდგეს; stale/unavailable მკაფიო იყოს და reference price არ გახდეს payable quote.
6. ერთი სრული ვერტიკალური გზა: ერთი კატეგორია → რეალური Meshy job → GLB → authorized design save → ერთი House → Fit revision.
7. Verified Offer → bank confirmation → ერთჯერადი Order → manufacturer authorization; შემდეგ QC და Passport.
8. მასშტაბირება 12 ინდუსტრიაზე და 1,000+ Houses-ზე; მობილური, SEO და სრული რეგრესია.

## 6. რა გვჭირდება საბოლოო დადასტურებისთვის

- production source-ის ზუსტი checkout/release ID და server access მფლობელის მიერ დადასტურებული გზით;
- test გარემო და test მომხმარებლები/როლები (საიდუმლო გასაღებები ჩატში არ ჩაიწეროს);
- ბანკის და Meshy-ის მოქმედი კონტრაქტები/გარემოს კონფიგურაცია;
- დამტკიცებული ფინანსური პოლიტიკის ვერსია, Terms/Privacy და KYC retention წესები;
- Search Console და რეალური მობილური წარმადობის გაზომვის შესაძლებლობა;
- საბოლოო asset manifest და მწარმოებლის ტექნიკური შემოწმების პროცესი.

საჯარო რეპოზიტორიის ძირითადი მტკიცებულებები: [შემოწმებული commit](https://github.com/tavdo/MERGE_STARS/tree/a81485536ae66ab198ba52ee6a4b359437337161), [Meshy panel](https://github.com/tavdo/MERGE_STARS/blob/a81485536ae66ab198ba52ee6a4b359437337161/frontend/src/components/catalog/MeshyAIPanel.tsx), [orders](https://github.com/tavdo/MERGE_STARS/blob/a81485536ae66ab198ba52ee6a4b359437337161/backend/src/modules/orders/orders.service.ts), [metals](https://github.com/tavdo/MERGE_STARS/blob/a81485536ae66ab198ba52ee6a4b359437337161/backend/src/modules/metals/metals.service.ts).

**ამ აუდიტით production არ განახლებულა. არც აშენების წარმატება და არც ვიზუალური ფორმის გახსნა არ ნიშნავს რეალური ბანკის, Meshy-ის ან წარმოების წარმატებას. CORE NEVER GETS REGENERATED.**
