# MERGE ⭐ STARS — UNIFIED MASTER PLATFORM SPECIFICATION
## V23.1 FINAL SPECIFICATION FOR FOUNDER SIGN-OFF · 16 ოქტომბერი 2026
### GRAND LIVING MUSEUM · BRAND MEGAPOLIS · CORE · MERGE AI · LIVE PULSE

**მიზნობრივი გარემო:** არსებული `https://mergestars.com`.  **საბაზისო არქივი:** `MERGE CORE V22.7`, ყველა თავდაპირველი 71 სექცია.  **სტატუსი:** დოკუმენტურად დასრულებული **V23.1 / FOUNDER SIGN-OFF REQUIRED**. ეს არ არის მოქმედი საიტის, ფინანსური პოლიტიკის, ინტეგრაციების ან სტანდარტთან სერტიფიცირებული შესაბამისობის მტკიცებულება.

> **MANDATORY EXECUTION INSTRUCTION:** FIRST AUDIT THE ACTUAL EXISTING APPLICATION. PRESERVE ALL HISTORICAL CORE RECORDS, AGREEMENTS, ASSETS AND FINANCIAL POSTINGS. IMPLEMENT IN THE EXISTING APPLICATION ONLY. DO NOT REBUILD CORE, DO NOT SIMULATE SUCCESS IN PRODUCTION, AND DO NOT DEPLOY WITHOUT FOUNDER APPROVAL.

---

# A. დოკუმენტური მმართველობა და ცვლილებების კანონი

## A01 · ავტორიტეტული წყაროები და წინმსწრებობა

1. ისტორიული რეალური ტრანზაქციის, ავტორობის, ხელშეკრულებისა და მომხმარებლის უფლების წყაროა არსებული **MERGE CORE** და ჩანაწერის შექმნისას მოქმედი პოლიტიკა; ახალი ტექსტი ისტორიას უკანონოდ არ ცვლის.
2. თავდაპირველი V22.7-ის ყველა 71 სექცია ინახება **READ-ONLY ARCHIVE**-ში. წინამდებარე V23 არის ერთიანი ახალი ტექნიკური სპეციფიკაცია. დაუდასტურებელი მოთხოვნები რჩება **PROPOSED**-ში.
3. ახალი პოლიტიკის ამოქმედება მოითხოვს `policy_id`, `version`, `approved_by`, `approval_evidence`, `effective_at`, `applicability_scope`, `legal_review`, `tax_review` და `rollback_rule`-ს. მანამდე ძველი რეალური კონტრაქტი უცვლელია; ახალ პოლიტიკას არ მიაწერო `ACTIVE`.
4. კონფლიქტისას გადაწყდეს ამ რიგით: **რეალურად მოქმედი კანონმდებლობა და ნამდვილი კონტრაქტი → არსებულ ჩანაწერში ჩაკეტილი ფინანსური/ავტორის უფლებები → მოქმედი CORE მონაცემი → დამფუძნებლის ფორმალურად დამტკიცებული ახალი ვერსია → წინამდებარე შეთავაზების დაუმტკიცებელი ნაწილი**. დაუდასტურებელი გადაწყვეტილება უნდა გამოიტანო **OPEN DECISION**-ად; არ გამოიცნო.
5. ყოველი მოთხოვნა მოინიშნოს `MUST`, `SHOULD` ან `OPTIONAL`; ჰქონდეს მფლობელი, კოდის შესაბამისობა, ტესტი, სტატუსი და დამოკიდებულება. პროექტი არ დაიწყოს წინა დოკუმენტების უბრალოდ ერთ გრძელ პრომპტად გაერთიანებით.

## A02 · ერთი CORE — პასუხისმგებლობების გამოყოფა

`CORE = identity + catalog + lineage + orders + attribution + financial truth + audit`. `Grand Living Museum / Brand Museum / Dashboard / AI = authorized experience layers`. ტექნიკური მოდულები შეიძლება განაწილებული იყოს სერვისებად, მაგრამ მათ **არ უნდა შექმნან მეორე ავტორიტეტული რეესტრი**. ახალი წვდომის ფენები მხოლოდ არსებულ ID-ებსა და ავტორიზებულ API კონტრაქტებს იყენებს. REST/GraphQL/WebSocket/event broker ამოირჩიე მხოლოდ რეალური რეპოზიტორიის აუდიტის შემდეგ.

**ინვარიანტები:** `ONE CORE SUBJECT`, `ONE CANONICAL PRODUCT RECORD`, `VERSIONED RIGHTS`, `ONE ORDER ID PER REAL REQUEST`, `NO UNSUPPORTED PAYMENT CLAIM`, `NO FINANCIAL POSTING FROM A VIEW OR CLICK`, `NO PRODUCTION WITHOUT VERIFIED AUTHORIZATION`.

## A03 · სამუშაოს დაწყებამდე სავალდებულო აუდიტი

გაარკვიე არსებული repo/branch/commit, სტეკი, deployment, staging, DB schema, migrations, backups, endpoints, RBAC/ABAC, auth sessions, price feed, PSP, QR resolver, Meshy, Three.js, saved Museum build, media storage, logging, observability და სამართლებრივი დოკუმენტების ვერსიები. დააფიქსირე `WORKING / PARTIAL / MISSING / BLOCKED`, მტკიცებულებითა და კოდის ადგილით. არასოდეს გამოიგონო endpoint, კონექტორი, პარტნიორობა, ავტორიზაცია, LIVE data ან ხელმისაწვდომი ფინანსური ფუნქცია.

# B. მომხმარებელი, ბრენდი და 12 რეალური შეკვეთა

## B01 · ერთიანი რეგისტრაცია

გამოიყენე არსებული CORE ავტორიზაცია, კონტაქტის დადასტურება, სესია, აღდგენა, საჭირო KYC/KYB და პირობების ვერსიონირებული დადასტურება. პერსონალური მონაცემები მინიმალური მოცულობით. მიწოდების მისამართი შეიძლება მოითხოვო შეკვეთისთვის საჭირო ეტაპზე; რეგისტრაციისას არ დააყოვნო არასაჭირო ველებით.

**სასურველი მარტივი UX:** `REGISTER → CREATE 12 DESIGNS → REVIEW 12 REQUESTS → CONFIRM 12 ORDER REQUESTS → PAY NOW / PAY LATER`. შემდგომი FIT/AI/SOCIAL/MUSEUM მოქმედებები თავისუფლად ხელმისაწვდომია შესაბამისი უფლებების ფარგლებში, არა იძულებით ერთი ჯაჭვის ბოლოს.

## B02 · Brand House და Brand Line

1. ერთი საბაზისო CORE მომხმარებელი იღებს **ერთ default Brand House-ს** და მასში **12 Brand Line-ის** მართვას. დამატებითი House-ის შემთხვევა დასაშვებია მხოლოდ არსებული ან დამტკიცებული CORE პოლიტიკით.
2. პირველ **წარმატებით შენახულ** ახალ დიზაინზე ან შეკვეთის მოთხოვნაზე იძებნება არსებული Brand House; არქონისას იქმნება idempotent CORE პროცესით. ცალკე დამატებითი ფასიანი activation action არ მოითხოვო.
3. Brand House-ის/Line-ის ავტომატური შექმნა **არ უდრის** საჯაროობას, Coin-ის დაფარვას, წარმოების უფლებას ან გამომუშავებულ საკომისიოს.
4. 12 Brand Line არის ბრენდის სტრუქტურა, **არა 12 შეკვეთის მუდმივი ლიმიტი**. თითოეული Line-ს შეუძლია შესაბამისი შეუზღუდავი პროდუქტის ვერსია/შეკვეთა, სისტემის რეალური რესურსისა და უფლებების მიხედვით.

## B03 · 12 დიზაინი, 12 ORDER ID — ზუსტი სამართლებრივი გამიჯვნა

მომხმარებელი ამზადებს 12 დიზაინს. თითოეული `CREATE NEW / KEEP ORIGINAL / CREATE MY VERSION / IMPORT OWN DESIGN` უნდა დაუკავშირდეს CORE product/version-ს, ავტორობასა და უფლებებს. ერთი review ეკრანი აჩვენებს თორმეტს, ფასის/შეთავაზების ფაქტობრივ მდგომარეობას და შესაბამის პირობებს. იმ კატეგორიისთვის, რომლის შეკვეთას რეალური ზომა სჭირდება, შეკვეთის გაგზავნამდე მოითხოვე მომხმარებლის მიერ შეყვანილი შესაბამისი Fit Profile-ის ველების შევსება; სხვა კატეგორიისთვის ეს ბარიერი არ დაამატო. **მომხმარებლის ერთი აშკარა `CONFIRM 12` მოქმედება შეიძლება შექმნას 12 ინდივიდუალური `order_id`**, მათგან თითოეულის სერვერული ავტორიზაციით და დადასტურების audit-ით. Batch request იყენებს idempotency key-ს; ნაწილობრივი შეცდომა აჩვენებს კონკრეტულად შექმნილ/ვერშექმნილ შეკვეთებს და უსაფრთხო retry-ს, დუბლირების გარეშე.

**სამი ერთმანეთისგან განსხვავებული სიმართლე:**
- `DESIGN_SAVED`: მხოლოდ პროდუქტის/ვერსიის შენახვა, კომერციული შეკვეთა არა.
- `ORDER_REQUEST_RECORDED`: მომხმარებლის მიერ ოფიციალურად დაფიქსირებული ნამდვილი შეკვეთის მოთხოვნა უნიკალური ID-ით, შესაძლოა ჯერ დაუდასტურებელი ფასითა და პირობებით. ის შედის **Submitted Order Requests** მაჩვენებელში, გადახდის მიუხედავად.
- `ORDER_ACCEPTED / VERIFIED_OFFER`: ნამდვილ შემოწმებულ შეთავაზებასა და დამტკიცებულ პირობებზე დაფუძნებული კომპანიის მიერ მიღებული შეკვეთა. მხოლოდ ეს შეიძლება ჩაითვალოს შესაბამის სახელშეკრულებო შესრულების ვალდებულებად, მოქმედი ხელშეკრულების შესაბამისად.

**მხოლოდ მოთხოვნის ჩაწერით არ გამოაცხადო გადახდა, გარანტირებული ფასი, გაყიდვიდან მიღებული შემოსავალი ან წარმოების ავტორიზაცია.** საფინანსო საჯარო/საბანკო ანგარიშში `SUBMITTED / ACCEPTED / DEFERRED / PAID / FULFILLED / CANCELLED` ცალკე სვეტებია.

## B04 · გადახდის ორი გზა

`PAY NOW`: მხოლოდ მოქმედი ბანკის/PSP-ის რეალური checkout + სერვერული verification. `PAY LATER`: შესაბამისი აქციის ფარგლებში მომხმარებლის აშკარად მიღებული პირობებით დაფიქსირებული გადავადებული ვალდებულება; დაფარვა რეალურად AVAILABLE საკომისიოდან, როდესაც ასეთი ნამდვილი თანხა არსებობს. გადახდის ღილაკი მომხმარებლის უფლებამოსილ სივრცეში ჩნდება დაუყოვნებლივ რეგისტრაციის შემდგომ, როცა შესაბამისი პაკეტი/შეთავაზება არსებობს; გადახდა **არ არის** 12 დიზაინის შექმნის წინაპირობა. დაფარვის არჩევანი შეიძლება განხორციელდეს შეკვეთების review პროცესშიც.

`ORDER REQUESTED ≠ ACCEPTED ≠ PAID ≠ PRODUCIBLE`. არც ერთი აქტიური ზოლის/Brand House-ის არსებობა ავტომატურად არ წარმოშობს საკომისიოს.

## B05 · Founding 1,000 და 30+3

პირველი 1,000 რეგისტრირებული პირი არის Founder Cohort; არა უფასო პაკეტი და არა პლატფორმის მონაწილეების ზედა ზღვარი. აქციის კონკრეტულ პირობებში PAY LATER შესაძლებელი იყოს. რეგისტრაციიდან 33 დღის აქტიურობის შეფასება: **მინიმუმ ერთი ახალი გარე მყიდველის ნამდვილი და უნიკალური CORE-ში დაფიქსირებული შეკვეთის მოთხოვნა**, მხოლოდ განმეორებული QR/like/self-initial orders არა. მოთხოვნის ფაქტი აქტიურობისთვის შეიძლება იყოს საკმარისი, თუმცა **საკომისიოსთვის არა**. INACTIVE სტატუსით არ იშლება Brand House, Line, order, QR history, უკვე არსებული უფლებები ან გადავადებული დაფარვის შესაძლებლობა. შეიძლება შეივსოს ახალი აქტიური აქციური ადგილი; `ACTIVE_SLOTS` და `ALL_TIME_BENEFICIARIES` არ აურიო.

# C. Growth, QR და რეალური ფინანსური სტატისტიკა

## C01 · ზრდის მოდელი და 144 მილიონი

დამფუძნებლის სცენარი `12,000 × 12,000 = 144,000,000` მათემატიკურად სწორია **მხოლოდ** შესაბამისი ერთეული/მექანიზმის განსაზღვრით. `12,000 ახალმა მყიდველმა × თითოეულის 12 შეკვეთამ = 144,000 ახალი შეკვეთა`. `144 მილიონი` მიღწევად დასათვლელი იქნება მხოლოდ იმდენივე ცალკეული, კანონიერად დასადასტურებელი order-request record-ის შემთხვევაში. სამი თვე ჩაითვალოს **სცენარის სასურველ ჰორიზონტად**, არა შესრულების, შემოსავლის ან გადახდის გარანტიად.

Founder Growth Simulator შეიცავდეს house count, unique external buyers, conversion, orders/buyer, submitted, accepted, paid, cancelled, attributed, production capacity, time horizon და scenario assumptions-ს; ყოველი გრაფიკი მონიშნე **LIVE / FORECAST / SCENARIO / TEST DATA**. სიმულაცია მუშაობდეს მხოლოდ sandbox-ზე; არ დაამატოს production CORE-ში შეკვეთები.

## C02 · QR — ერთი ქსელი

არსებული Brand QR ხსნის შესაბამის Brand Museum/House-ს; Product QR — კონკრეტულ პროდუქტს/ვერსიას და უფლებამოსილ პასპორტს; Social campaign tracked link — შესაბამის წყაროსა და კამპანიას. Attribution სწორ CORE ეტაპზე იხურება immutable snapshot-ით (`source_house_id`, `destination_house_id`, campaign, order linkage, policy version, evidence). მოგვიანებით ვიზიტი უკვე ჩაკეტილ წყაროს არ გადაწერს. ტელეფონზე QR გამოსახულებასთან ერთად გამოიყენე clickable link.

**მნიშვნელოვანი:** QR view, visit, like, follow, registration, design save, order request და paid sale **სხვადასხვა მოვლენებია**. უნიკალური მყიდველები გამოვავლინოთ კანონიერად და პრივატულად, არ გამოვიგონოთ დასკვნები მხოლოდ IP/კუკის მიხედვით.

## C03 · ახალი GOLD/SILVER კომერციული პოლიტიკის კანდიდატი

**FOUNDER-PROPOSED POLICY — NOT YET ACTIVE UNTIL APPROVAL:** ერთიან განსაზღვრულ `commission_allocation_base = 100%` ბაზაზე:

| კომპონენტი | წილი |
|---|---:|
| MERGE COMPANY / PRODUCTION ALLOCATION | 33% |
| PRECIOUS METAL ALLOCATION | 33% |
| SOURCE BRAND HOUSE | 16.5% |
| DESTINATION BRAND HOUSE | 16.5% |
| PHYSICAL MEGAPOLIS CONSTRUCTION ALLOCATION | 1% |
| **სულ** | **100%** |

თუ Source და Destination ერთი House-ია, შესაბამისი ორივე წილი მას ეკუთვნის — ჯამი 33%. **დამატებითი 2% PLATFORM SERVICE FEE** აღირიცხება ამ 100%-იანი ალოკაციის **გარეთ**, ცალკე შეთავაზების/ხელშეკრულების/ინვოისის ბაზით, შესაბამისი გადასახადების გათვალისწინებით. 2% არ გამოაკლო ჩუმად ამ 100%-ს. არ უწოდო 33%-იანი კომპანიის ალოკაცია ავტომატურად მოგებას, 33%-იანი ლითონის ალოკაცია — უკვე შეძენილ მარაგს ან 1%-იანი სამშენებლო ალოკაცია — უკვე ხარჯვისთვის ხელმისაწვდომ ფულს.

**Legacy 25/25/50** ძველი V22.7 (მათ შორის პარტნიორული 61-ე მუხლის) ტექსტში არსებობს. მას მიენიჭოს `LEGACY_POLICY`/ისტორიული სკოპი; ახალი 33/33/33/1 — ახალი ვერსიის `PROPOSED` სტატუსი, სანამ კომერციული, იურიდიული, საგადასახადო და ფინანსური დამტკიცება არ შევა registry-ში. აქტივაციის შემდეგ `effective_at`-ით ვრცელდება მხოლოდ შესაბამის მომავალ ოპერაციებზე; ძველ ledger-ს არასოდეს გადააწერო.

ამოქმედებამდე სავალდებულოდ დაამტკიცე: რა არის gross/net/fee/VAT basis, currency/FX snapshot, decimal precision/rounding, discount/refund method, tax jurisdiction, cost coverage, production commitments, source qualification, return/reversal, reserve/payout schedule, 1%-იანი ფონდის სამართლებრივი სტატუსი და fund ownership/accounting. უცხო ბაზრებისთვის ქვეყნის მიხედვით იურიდიული/საგადასახადო შემოწმება ცალკეა.

## C04 · ფული, ledger და დარიცხვის მექანიზმი

არსებული CORE PSP/bank adapter-ით შეინარჩუნე provider message signature, immutable reference, idempotency, reconciliation, chargebacks, refunds, dispute workflow. კომპანიის ანგარიშსწორება, მომხმარებლის შეძენა, თანხის ბუღალტრული აღრიცხვა და ბრენდული საკომისიო იყოს განცალკევებული ledger records. გამოიყენე მინიმუმ `PENDING / AVAILABLE / RESERVED / NEGATIVE / PAID_OUT / REVERSED`; `SETTLED` ზუსტად განმარტე მოცემულ კონტექსტში. გადავადებული Coin-ის დაფარვას შეუძლია გამოიყენოს მხოლოდ რეალურად earned, eligible, AVAILABLE თანხა შესაბამისი თანხმობითა და ვალიდური settlement-ით. სრული audit, არანაირი ორმაგი გამოყენება ან ნეგატიური ბალანსის იგნორირება.

შეძენა/რეკრუტირება არ ნიშნავს ავტომატურ საკომისიოს; გადახდა მხოლოდ დამტკიცებული რეალური გაყიდვის ატრიბუციით. დეფერალი არ არის გარანტირებული შემოსავალი.

# D. პროდუქტი, ოქრო/ვერცხლი და წარმოება

## D01 · პროდუქტის ერთადერთი სიმართლე

ერთი Master Catalog, მრავალი ავტორიზებული ხედვა: Grand Museum + ავტორის Brand Museum + პირადი Line. შეინახე უფლებები და provenance: `root_product_id`, `source_product_id` სადაც რეალურად არის, `new_product_id`, creator/owner/rights, house, version, material, geometry, declared/verified status. ფიზიკური ნივთის მფლობელობა ≠ საავტორო უფლება ≠ ბრენდის საკუთრება. ახალი პროდუქტის ვერსია **არ ცვლის ორიგინალს**. ატვირთული ფოტოა მედია, არა 3D/verified production file. Bulk upload-ით თითოეულ ფაილს შედეგი ცალ-ცალკე ენიჭება.

## D02 · GOLD COIN / SILVER COIN პაკეტები

`MERGE COIN CASE` არის მრგვალი, გასახსნელი ფიზიკური luxury ჩანთა/ქეისი შიდა განყოფილებებით; `MERGE COIN` ასევე შეიძლება იყოს CORE-ის რაოდენობრივი/კომერციული სააღრიცხვო ტერმინი. განასხვავე **ფიზიკური ქეისი, პროდუქტის პაკეტი, თითოეული Order ID და Coin quantity unit**. Coin არც კრიპტოაქტივია და არც გარანტირებული ინვესტიცია.

GOLD/SILVER პაკეტის ფასის რეფერენსი შეიძლება ემყარებოდეს შესაბამისი **1 კგ სუფთა ლითონის** საბაზრო ფასს მხოლოდ ამ წესის დამტკიცების შემდეგ; ეს **ფასის რეფერენსია**, არა პირობა, რომ მომხმარებელს გადაეცემა ამდენი სუფთა ლითონი. მოითხოვე ცალკე და გამჭვირვალე package/pricing rule version.

GOLD ხაზის პაკეტში ნებადართული იყოს **1–12 შესაბამისი ნივთის დაფინანსებული წარმოება** მხოლოდ დამტკიცებული პირობებით; ნივთებისა და ქეისის **MERGE 8K ოქროს კომპოზიტის ერთობლივი მასა ≤ 1,000 გ**, ფიზიკური ნივთის სხვა მასალები ცალკე აღირიცხოს. ეს **არ ნიშნავს 1 კგ სუფთა ოქროს**.

SILVER ხაზის პაკეტი დაფარავს **ერთ შესაბამის ფიზიკურ ნივთს და შეთანხმებულ ქეისს**; დანარჩენი 11 საწყისი Brand Line-ის ოფიციალური order request არ იქცევა ავტომატურად 11 დაფინანსებულ ნივთად. დაუმტკიცებელი silver composite weight cap არ გამოიგონო. GOLD/SILVER რეალური ფასები CORE-ის LIVE reference, approved pricing version, material quantity, taxes/fees-დან მოდის — არა hardcoded $/€ რიცხვებიდან.

## D03 · MERGE 8K მატერიალური სპეციფიკაცია

სამიზნე კომპოზიტი: **1 ნაწილი ძვირფასი ლითონის შესაბამისი კომპონენტი : 2 ნაწილი დანარჩენი კომპონენტები, მასით**. მიზნობრივი metal component ≈ 33⅓% = ~333.33გ / 1კგ კომპოზიტზე. ვერცხლის `Ag 999.9` აღნიშნავს გამოყენებული ლითონის კომპონენტის სისუფთავეს, **არა მთლიანი კომპოზიტის** სისუფთავეს. `MERGE 8K` არის პროექტის დასახელება/სპეციფიკაცია; შესაბამის ქვეყანაში სარეკლამო/საიუველირო სინჯის იურიდიული ნიშანდება დასამტკიცებელია. მიზნობრივი რეცეპტი ≠ დამზადებული პარტიის გაზომვა. თავსებადი პარტიის რეალური ტესტი, უსაფრთხოება და ხარისხი იყოს ცალკე მტკიცებულება.

Mosaic: `MICRO/FINE/MEDIUM/LARGE/ARCHITECTURAL`, შერჩევითი და ფუნქციური, წყაროს ბრენდის შენარჩუნებით. ძაფი/ბოჭკო/მოზაიკის შეკერვა `RESEARCH/PROTOTYPE/TESTED/APPROVED` ნიშვნით; არ გამოაცხადო კანისთვის უსაფრთხოდ ან სერტიფიცირებულად გამოცდის გარეშე.

## D04 · Price & verified offer

`Geometry → measured/calculated dimensions → material revision → volume → density → calculated weight → reference metal quote with timestamp → versioned price policy → ESTIMATED → VERIFIED OFFER`.

დაიცავი quote freshness, currency, currency conversion, rounding, offer expiry, supply/lead-time, rights, tax and fee explanation. ფასის `snapshot` არ ნიშნავს ლითონის შეძენას ან ფასის გარანტიას. უარყოფითი/არარსებული მასალის ან პარტნიორის მონაცემებისას სტატუსი `VERIFICATION REQUIRED`; VERIFIED შეთავაზება არ გამოაცხადო. 12 მოთხოვნა შეიძლება იყოს recorded მანამდე, მაგრამ accepted financial commitment მხოლოდ საჭირო შემოწმების/თანხმობის შემდეგ.

## D05 · პარტნიორთან საწარმოო მარშრუტი

`VERIFIED CUSTOMER ORDER → PAYMENT/APPROVED SETTLEMENT → AUTHORIZED MANUFACTURING PO → ACTUAL AGREEMENT/MATERIAL PERMISSION → FILAMENT FACTORY PROCUREMENT → BATCH MATERIAL PASSPORT/WARRANTY → DIRECT SHIPMENT TO AUTHORIZED PARTNER FACTORY → RECEIPT/REQUIRED CHECKS → MANUFACTURING → QC/XRF → PRODUCT PASSPORT → DELIVERY`.

ისტორიული V22.7-ის **57–70 მუხლების დეტალები უნდა შენარჩუნდეს**: პარტნიორი შეიძლება იყოს ავტორი და მწარმოებელი განსხვავებული როლებით; MERGE აწესრიგებს საკუთარი შესაბამისი მასალის მიწოდებას; ფილამენტის შეთანხმებული ქარხანა შესაძლოა პირდაპირ აგზავნიდეს ჩინეთიდან პარტნიორ ქარხანაში; თითოეულ პარტიას აქვს provenance, COA, ტექნიკური/ტესტის მტკიცებულება და მხოლოდ **რეალური** გარანტია. `customer_order_id`, `manufacturing_po_id`, `material_procurement_po_id`, `batch_id`, `shipment_id`, `factory_receipt_id`, `qc_id` დაუკავშირე რეალურად არსებულ სქემას.

გაარჩიე გაგზავნილი/მიღებული/გამოყენებული/ნარჩენი/დაბრუნებული მასა, დაკარგვის რისკი, საკუთრება, Incoterms სადაც შეთანხმებულია, customs, claim/dispute, lead times, cancellation, warranty, producer rights. პარტნიორი/Rolex/Meshy/Meta ვერ გამოჩნდეს დადასტურებულ პარტნიორად შესაბამისი ACTIVE შეთანხმების გარეშე. საწარმოო ანაზღაურება და კონკრეტული შეკვეთის საკომისიო სხვადასხვა საფუძველს ემყარება — თანხა არ დაითვალო ორჯერ.

## D06 · წარმოება, QC, პასპორტი

`NO VERIFIED FINANCIAL/TECHNICAL AUTHORIZATION → NO PRODUCTION`. Financed order, PO, material reservation, manufacturing execution, QC/XRF და delivery დამოუკიდებელი სტატუსებია. საბოლოო პასპორტი შეიცავს ავტორს, ბრენდს, წყაროს, ვერსიას, manufacturing supplier, material batch, დეკლარირებულ/გაზომილ შემადგენლობას და წონას, product/order IDs, QC evidence, QR და უფლებამოსილ ისტორიას. Failed quality უნდა ნიშნავდეს HOLD/REWORK/REJECT; კარადიდან ფოტო არ ხდება VERIFIED product.

# E. 3D Living Museum, ვიზუალური კანონები და Digital Twin

## E01 · ვიზუალური იდენტობა

დამტკიცებული შავ/ოქროს/ვერცხლის luxury architectural 3D ვიზუალი არის დიზაინის საფუძველი და **არა გვერდის ფუნქციური screenshot-as-background**. არ წაშალო არსებული 18 გამოსახულება, შესასვლელი, კარები, დარბაზები, ავატარის დამტკიცებული პროპორციები, saved positions, collection windows, ექსპონატები და drafts. **ოფიციალური MASTER CORE v2.2 კომპანიის ორიგინალი ლოგო** უცვლელი geometry-ით ცენტრალურად მოათავსე მთავარი მუზეუმის შესასვლელის თავზე ჩვეულებრივი ვარსკვლავის ნაცვლად, აგრეთვე კომპანიის header/footer/AI UI-ში. თუ ორიგინალი asset არ არსებობს, გააჩერე შესაბამისი ჩანაცვლება `LOGO_ASSET_REQUIRED`-ით; არ გამოიგონო მსგავსი მონოგრამა.

**Generated image / mockup visible text = accurate English only.** ცოცხალი ტექსტური UI იყოს localization-ready; არსებული ქართული CORE ჩანაწერები/კონტრაქტები არ გადაიწეროს. ნამდვილი მომხმარებლის სახელები/დარიცხვები არასოდეს ჩაანაცვლო LUMIRA/Nino/144m/ONLINE მაკეტის გამოგონილი რიცხვებით.

## E02 · კარებიდან უწყვეტი მეგაპოლისი

`CLOSED MAIN DOOR → REAL SLOW DOOR ANIMATION → OPEN DOOR → CAMERA/AVATAR ENTRY → CONTINUOUS NAVIGATION → EXHIBIT FOCUS → RETURN TO PREVIOUS EXACT POSITION`.

Three.js/GLTF/GLB ან არსებული მხარდაჭერილი 3D engine. არა slideshow; არა grid-only e-commerce; ერთი spatial museum. 12 მთავარი საათის ფორმით განლაგებული ურბანული მისასვლელი და ცენტრალური მე-13 MERGE Museum — **UX topology**. მოერგოს ექვს კლასტერსა და 30-ზე მეტ House/category-ის გაფართოებას; 12 კატეგორიის შეზღუდვა არ დაუწესო CORE taxonomy-ს.

კამერა, scene graph, collision/navmesh, floor arrows, room position, checkpoint state, selection restore, loading states, progressive assets, GPU cleanup. მობილურზე swipe/tap controls, keyboard alternative, `Skip 3D / Text Catalog`, reduced motion. Preview/3D model ყოველთვის მორგებული იყოს მოწყობილობის შესაძლებლობებს.

## E03 · Digital Twin & Fit Profile

ცალკე ძლიერი მამაკაცისა და ქალის უსახო, პროპორციული ავატარი; არ გააკეთო ბავშვური ან ადამიანის იდენტობის მიმსგავსებელი. Fit fields — height/shoulders/chest/waist/hips/neck/wrist/finger/foot და საჭიროებისას face proportions. გაზომვები მომდინარეობდეს **მომხმარებლის შეყვანიდან**; არასოდეს გამოიცნო ზუსტი ზომა ფოტოდან. მხოლოდ საჭირო product category-სთვის შეაგროვე; ღირებულება, measurement unit, source, consent/version, last-updated და access control ჩაწერე. Fit to Me creates a new configuration without overwriting source; სხეულის ზომები არ გადაეცეს საჯარო Social Gallery-ს.

# F. MERGE AI, სოციალური ქსელები და ცოცხალი Brand House

## F01 · ერთი პერსონალური AI თითო House-ზე

კერძო AI მენეჯერს მიეცეს მხოლოდ შესაბამისი owner/house-ის ნებადართული ბრენდი, 12 Line, კატალოგი, პროდუქტის ისტორია, QR, აქტიურობა, ფინანსური მოკლე მიმოხილვა. AI საუბარი და ადამიანების private chat ცალკე უფლებების საცავებია. არ მოხდეს cross-tenant retrieval, prompt injection-ის მიერ tool permission-ის გაფართოება, ანგარიშის შექმნა ან ხარჯვა ჩატის ტექსტით. UI-ში რეალური status, source-of-truth და საჭირო `APPROVE ACTION`.

## F02 · Email / Social onboarding

მომხმარებელი ირჩევს `SELF REGISTRATION / AI-ASSISTED SETUP / CONNECT EXISTING` შემდეგ არხებზე: Instagram, Facebook, TikTok, LinkedIn, YouTube, Pinterest, X და მოგვიანებით მხარდაჭერილი არხები. ჩვეულებრივი სოციალური ანგარიშის რეგისტრაციისთვის MERGE-ს სპეციალური კომერციული პარტნიორობა არ სჭირდება; თუმცა ოფიციალური API, publishing scope და automated signup განსხვავდება. AI ეხმარება რეალური, ოფიციალური provider flow-ით; OTP, 2FA, პაროლები, CAPTCHA მომხმარებლის ხელში რჩება. არ გამოიყენო აკრძალული bot/scraping. ბრენდული ელფოსტა იქმნება მხოლოდ რეალური mail provider/domain authorization-ისას. რეალური დაკავშირების სტატუსები: `NOT_CONNECTED/SETUP_REQUIRED/AUTHORIZATION_PENDING/CONNECTED/EXPIRED/ERROR/DISCONNECTED`. ტექსტის გენერირება არ ნიშნავს საფოსტო ყუთის ან ანგარიშის რეალურ შექმნას.

## F03 · Social content, buyer experience

დამტკიცებული კომუნიკაციით AI ამზადებს ტექსტებს, ფოტოებს, ვიდეოს სცენარებს, Brand story-ს, QR კამპანიებს, კალენდარს და multilingual captions. გამოქვეყნების რეჟიმები `MANUAL/SCHEDULED/AUTHORIZED_AUTOPILOT`, ხარჯვისთვის ცალკე აშკარა თანხობრივი ავტორიზაცია, ნებისმიერ დროს revoke/STOP. Provider scope-ის არქონისას social link only. Public Brand House Gallery აჩვენებს official embeds ან original URLs-ს; აღრიცხავს provenance/creator/media consent. `SOCIAL VIDEO → REAL OR CONCEPT LABEL → PRODUCT ID → FIT TO ME → CREATE MY VERSION → QR → REQUEST ORDER`. რეალური ფიზიკური ნივთი, sample, concept და digital try-on სხვადასხვა წყაროთი და სტატუსით. მომხმარებლის პირადი ზომები/ფინანსები არ გახდეს საჯარო.

## F04 · Community & abuse management

ნამდვილი მომხმარებლების კომენტარები, ჩატები, share/save/like, notifications, business inbox; შესაბამისი reporting/blocking/mute, moderation queue, rate limits, spam/impersonation handling, copyright/takedown, abuse escalation, privacy request, retention schedule. ყალბი live crowds ან fake paid sales არ გამოიყენო.

# G. უსაფრთხოება, ხარისხი, მართვა და ოპერირება

## G01 · საერთაშორისო ჩარჩოების რეალური გამოყენება

ტექნიკური გუნდისთვის შეფასების **მიზნობრივი ჩარჩოები**, არა უკვე მიღებული სერტიფიკატები:
- OWASP ASVS **5.0.0** — ვებაპლიკაციის უსაფრთხოების ტესტირებადი მოთხოვნები და საფრთხეების მოდელირება; OWASP API Security Top 10:2023 API authorization, object-level checks, rate limits.
- NIST SP 800-218 SSDF **1.1 final** — უსაფრთხო software lifecycle, secure coding, review, dependency risk, CI/CD checks. 1.2 საჯარო draft ცალკე აღინიშნოს, როგორც draft.
- W3C WCAG **2.2 Level AA target** — ტექსტური alternative, კონტრასტი, keyboard navigation, reduced motion, accessible checkout/forms, accessible authentication, non-3D fallback.
- ISO/IEC **27001:2022** როგორც ინფორმაციული უსაფრთხოების მართვის სისტემის მიზნობრივი ჩარჩო; ISO/IEC **42001:2023** და NIST AI RMF 1.0 — AI lifecycle, permissions, logging, quality and oversight.
- PCI DSS **4.0.1**, სადაც payment flow/merchant architecture რეალურად ექვემდებარება მას — სასურველია hosted PSP/tokenization და PCI scope-ის მინიმიზაცია.
- წარმოების ხარისხის/traceability control, supplier QC და ბაზრებზე პროდუქციის შესაბამისობა საჭიროების მიხედვით შესაბამისი სტანდარტებითა და ადგილობრივი კანონებით.

**აკრძალულია ფრაზა „ISO/PCI certified/compliant“ შესაბამისი რეალური შეფასების/სერტიფიკატის გარეშე.** ოფიციალური წყაროები/URL იხილე დანართში.

## G02 · უსაფრთხოების სავალდებულო კონტროლები

Threat modeling per flow; tenant isolation; authenticated server-side object & field authorization; session/MFA for sensitive admin; strong password-less/standard flows where supported; encryption transport/storage; secrets management; key rotation; OAuth least-privilege/revocation; PII minimization; audit log access; immutable settlement events; signed webhook verification; request/idempotency controls; dependency/supply-chain scanning; CI secrets scan; vulnerability handling; backups with tested restores; rate limiting/DoS controls; fraud controls with human review. არ გაასაჯაროო fit/identity/money in logs, dashboards or AI prompts.

## G03 · AI Risk Management

AI-ის შესაძლებლობები შეფასდეს ცალ-ცალკე: content creation, Q&A, product matching, personal AI, social publish, order assistance, manufacturing recommendations. ყოველი მოქმედებისთვის: authorized user scope, tool allowlist, required approval, human override, deterministic financial CORE calculations (AI არ ითვლის ავტორიტეტულ ფასს/საკომისიოს), prompt injection/PII leakage tests, provenance of generated media, safety review, revoke, rollback. AI-generated media მონიშნე რეალური ფოტოსგან განსხვავებულად.

## G04 · Live Pulse & რეალური სტატუსი

Founder-only Dashboard: CORE registered/active brands, submitted orders, accepted orders, paid sales, deferred liabilities, cash received, earned/available commission, QR conversion, production capacity, incidents. LIVE PULSE არის **technical event health**: auth/API/DB/PSP/ledger/QR/AI/social/3D/production/passport. არ აურიო „სისტემა ონლაინ არის“ და „მილიონობით შეკვეთა გვაქვს“. `HEALTHY/DEGRADED/INCIDENT/MAINTENANCE`, რეალური events, source timestamp, sampling/freshness, duplicate controls. მხოლოდ იმ service-ზე გამოაცხადე HEALTHY, რომელიც შემოწმდა.

## G05 · UX, performance, SRE მიზნები

შექმენი measurable performance budgets, device tiers, stress tests, error budget, on-call and incident playbooks. საწყისი **შეთავაზებული** SLO-ები (შეასწორე არსებული ინფრასტრუქტურის რეალური baseline-ის მიხედვით): API ordinary read p95 ≤500ms (შიდა პირობებით), core order-save success ≥99.9% excluding invalid user input, public website monthly availability target ≥99.9%, WCAG 2.2 AA acceptance target, Core Web Vitals LCP p75 ≤2.5s on supported conditions, production RPO/RTO განისაზღვროს ინჟინრული რისკის შეფასებით და რეალური restore drill-ით (არ გამოიგონო გარანტია). 3D fallback ეხმარება low-end devices-ს. Monitoring, tracing, structured event IDs, release canaries, backward-compatible DB migration და rollback აუცილებელია.

## G06 · იურიდიული, საგადასახადო და მომხმარებელთა უფლებები

Versioned Terms, Privacy Policy, IP/creator license, manufacturing/fulfillment, refund/cancellation, cross-border shipping/customs, platform fees and commission terms, deferred-payment obligations and consumer disclosures, ad consent/provider rules, supplier/quality guarantees, country-specific precious-metal labeling. `MERGE COIN ≠ CRYPTO / SECURITY / INVESTMENT`. ეს განსაზღვრება თავისთავად არ გამორიცხავს კონკრეტული იურისდიქციის რეგულატორულ კლასიფიკაციას; სჭირდება დამოუკიდებელი იურისტის შეფასება. Revenue share from verified real orders only, no recruitment-only reward. Georgian and other target-market tax treatment (VAT, invoicing, payout withholding) განმარტოს კვალიფიციურმა ფინანსურმა სპეციალისტმა.

# H. განხორციელების გეგმა, ხარისხის კარი და დამფუძნებლის მიღება

## H01 · განხორციელების 10 ეტაპი

1. `AUDIT`: source repo / CORE schema / routes / providers / data quality / contracts / legal.
2. `CONTRACT MAP`: authority and IDs; canonical state machines; field-level permission matrix.
3. `ORDER JOURNEY`: 12 designs → 12 explicit submitted requests → offer acceptance → Pay Now/Later, idempotent batch and accessible UX.
4. `FINANCIAL POLICY REVIEW`: new allocation proposal, backtesting, tax/legal, approval registry, future effective version. Legacy historical untouched.
5. `QR & ANALYTICS`: locked attribution, clean metrics, counter reconciliation.
6. `MUSEUM/3D`: approved visuals, closed/open doors, official logo, real spatial experience, digital twin and lightweight mode.
7. `MERGE AI/SOCIAL`: personal brand workspace, email, social connections, gallery and permissions.
8. `MANUFACTURING`: material batch, direct shipment, PO, quality, passport, SLA/claim rules.
9. `LIVE PULSE & HARDENING`: observability, performance, cybersecurity, privacy, fraud, accessibility, 144m synthetic load scenarios.
10. `STAGING → FOUNDER REVIEW → APPROVED LIVE`: test evidence, rollout, monitoring, rollback.

## H02 · RELEASE GATES (NO-GO)

აკრძალულია LIVE თუ არსებობს: P0/P1 vulnerability; insecure cross-tenant access; unverified payment represented as paid; data loss or duplicate orders in retries; wrong commissioned policy version; unapproved prices; permissionless production; incorrect company logo; invalid consent or public PII leak; failed backup restoration; 3D inaccessible with no usable fallback; external account success fabricated. დამფუძნებელს წარუდგინე **blocked reasons**, არა ყალბი PASS.

## H03 · Test contract

ყოველ მოთხოვნას ჰქონდეს `requirement_id → code_path → test_case → evidence_url/artifact → owner → result[PASS/FAIL/BLOCKED/NOT RUN]`. Unit+Integration+Contract+E2E+Security+Load+Accessibility+Restore. მთავარი სცენარები: 12-order batch partial failure; contract confirmation; deferred payment reserve; same-House commission; refund/reversal; PSP webhook replay; unauthorized cross-House read; social OAuth expire; 3D context lost and restore; price quote expiry; material receipt mismatch; QC reject; passport version; 33+33+16.5+16.5+1 reconciliation; 2% separate fee; historical 25/25/50 untouched; 30+3 no-rights-loss; simulation vs live metrics; 1k/12k/144m synthetic orders in isolated environment.

## H04 · საბოლოო მიღების პაკეტი

გადმოეცი source diff/commit, schema migrations, rollback, contract map, permission matrix, financial policy registry, audit and test report, screenshots/video of real authenticated UI, real functional links only, blocked dependencies, vendor approvals, production checklist, plan/timeline and cost estimates. `DESIGNED`, `IMPLEMENTED`, `TESTED`, `STAGED`, `DEPLOYED` განსხვავებული სტატუსებია. Real mergestars.com-თან წვდომის არქონა მონიშნე `BLOCKED`, არა `DONE`.


# I. შესრულებადი სამუშაო კონტრაქტები — არქიტექტურა, მონაცემები და საზღვრები

> ქვემოთ მოცემული ID-ები და მოვლენის სახელები არის **სავალდებულო ბიზნეს-სემანტიკა** და **სქემის შესამოწმებელი წინადადება**, არა იმის მტკიცება, რომ ეს ცხრილები ან endpoint-ები უკვე არსებობს. იმპლემენტაციაში გამოიყენე მოქმედ CORE სქემასთან ზუსტად შეთანხმებული სახელები; დუბლირებული truth store აკრძალულია.

## I01 · გონივრული, საზომი სამუშაო პრიორიტეტები

- **P0 (საიტის/ფულის უსაფრთხოების ბლოკერი):** ერთიანი ავტორიზაცია, ობიექტის უფლებები, Order ID/idempotency, ფასისა და შეთავაზების სინამდვილე, PSP webhooks, ფინანსური პოლიტიკის version lock, გადავადებული ანგარიშსწორება, რეპეტირებული მოვლენებისგან დაცვა, QC/წარმოება მხოლოდ ავტორიზაციით, მონაცემთა შენარჩუნება, საჯარო პირადი ინფორმაციის არგამჟღავნება.
- **P1 (ფუნქციური მიღება):** 12 დიზაინის მარტივი გზა, QR ლოკაცია/ატრიბუცია, რეალური 3D კარები/სივრცე, ოფიციალური ლოგო, Digital Twin, AI ჩატი, Social Gallery, მობილური/ხელმისაწვდომობა, LIVE PULSE real telemetry, support workflow.
- **P2 (მართვადი გაფართოება):** ზრდის სიმულატორი და stress testing, სხვადასხვა ახალი სოციალური პროვაიდერი, მოწინავე AI autopilot, მულტირეგიონული მასშტაბირება, გაუმჯობესებული 3D rendering. P2 ვერ აუვლის P0-ს.

## I02 · ავტორიტეტული მონაცემებისა და პასუხისმგებლობების რუკა

| დომენი | სისტემის სიმართლე | ნებადართული წარმოდგენა | მკაცრად აკრძალული |
|---|---|---|---|
| Identity | CORE user / authorized session | AI, Museum, Dashboard | პარალელური user registry / credentials |
| Brand | CORE House / Line / rights | 12 ხაზის პანელი და სივრცე | დუბლირებული House, ავტომატური საჯაროობა |
| Product | CORE product + version + lineage | Catalog / 3D Exhibit / Social Gallery | ფოტოს წარმოებად აღიარება; root-ის გადაწერა |
| Order | CORE order/request + terms evidence | შეკვეთის სტატუსი, 12-item review | შეკვეთის ლოკალური იმიტაცია |
| Payment | PSP/bank evidence + CORE ledger | PAY NOW/LATER status | UI click → PAID |
| Commission | versioned policy + ledger | pending/available/report | ღილაკი/QR → AVAILABLE |
| QR | CORE attribution and resolver | გარე tracked link / product QR | მეორე source-of-truth / ჩაკეტილი წყაროს გადაწერა |
| Manufacturing | CORE authorized PO + material batch | production progress / passport | unpaid order → production |
| AI | ნებადართული ბრენდის კონტექსტი | chat & drafted content | უკონტროლო tools / სხვა House-ის მონაცემები |
| Social | provider confirmation/rights | connected/galleries | შერჩეული არხის ჩათვლა CONNECTED-ად |

## I03 · შეკვეთების ზუსტი მანქანა და თორმეტის ერთიანი დადასტურება

**სავალდებულო მოვლენების გამიჯვნა:**

`DESIGN_SAVED` → `ORDER_REQUEST_RECORDED` → `OFFER_VERIFIED` → `ORDER_ACCEPTED` → `PAYMENT_PENDING / PAYMENT_DEFERRED` → `PAYMENT_VERIFIED / ELIGIBLE_SETTLEMENT` → `PRODUCTION_AUTHORIZED` → `IN_PRODUCTION` → `QC_RESULT` → `PASSPORT_ISSUED` → `DELIVERED`.

- `ORDER_REQUEST_RECORDED`: დამკვეთის მიერ ღილაკით ოფიციალურად შემოტანილი 12 კონკრეტული შეკვეთის მოთხოვნიდან თითოეული **რეალურად არსებობს CORE-ში**, უნიკალური `order_id`-ით. Payment შეიძლება იყოს PENDING/DEFERRED. მომხმარებელს ეჩვენოს **12 Recorded Orders**, არა 12 Paid Sales.
- `ORDER_ACCEPTED`: შემოწმებული შეთავაზების, რეალური პირობებისა და კომპანიის მიღების მტკიცებულების შემდეგ. არ შეიქმნას ავტომატურად ფასდაუდასტურებელი მოთხოვნისგან.
- ფასის, ვერსიის, კონფიგურაციის ან ვადის მნიშვნელოვნად შეცვლისას ხელახალი დადასტურება/შეთავაზება საჭიროებისამებრ; ძველი snapshot არ გადაიწეროს.
- `CONFIRM ALL 12` ერთი UX ქმედებაა, მაგრამ სერვერი ქმნის 12 დამოუკიდებელ, თანმიმდევრულად დათვლილ order-request record-ს. მოთხოვნას აქვს `batch_id`, `idempotency_key`, `user_id` (ავტორიზაციიდან), 12 დადასტურებული product/version references და `accepted_terms_version`.
- განმეორებითი submit ან network retry უბრუნებს იგივე batch-ის ადრე შექმნილ ობიექტებს; არ ქმნის ახალ `order_id`-ებს.
- ნაწილობრივი ჩავარდნისას თითო ნივთის `created/blocked/failed` რეალური სტატუსი დაბრუნდეს. ხელახალი გაშვება ავსებს მხოლოდ გამოტოვებულს; შექმნილს არ შლის.
- `PAY NOW` შეიძლება რეგისტრაციის შემდეგვე გამოჩნდეს პაკეტის შესაბამისი დამტკიცებული შეთავაზების არსებობისას; 12 დიზაინის მომზადება წინასწარ გადახდის პირობა არ არის.
- **იურიდიულად მნიშვნელოვანი:** დოკუმენტში ერთდროულად წერია დამფუძნებლის სურვილი „12 ოფიციალური შეკვეთა“ და წყაროს მოთხოვნა „მხოლოდ VERIFIED OFFER-ით მიღებული კომერციული შეკვეთა“. V23 ამას წყვეტს ორ ეტაპად (recorded request / accepted order), მაგრამ საბოლოო სახელშეკრულებო სტატუსს ამტკიცებს იურისტი (D-02).

## I04 · ფინანსური კონტრაქტები და გამოთვლის მაგალითები

**ახალი პოლიტიკის შესამოწმებელი მაგალითი** (თუ ახალი პოლიტიკა დამტკიცდა და `allocation_base = 100.00` შესაბამისი ვალუტის ერთეულია; ეს არ არის ავტომატურად მომხმარებლის საბოლოო ფასი):

- Company/Production 33.00;
- Metal allocation 33.00;
- Source House 16.50;
- Destination House 16.50;
- Physical Megapolis construction allocation 1.00;
- სულ **100.00**;
- 2%-იანი დამატებითი საფასური **ცალკე**, მხოლოდ პოლიტიკით განსაზღვრული ბაზითა და გადასახადების წესით.

`decimal`/minor-units გამოიყენე floating point-ის ნაცვლად. `allocation_base`, tax base, fee base, inclusive/exclusive treatment, FX quote/timestamp, rounding method, refunds and reserve must have an approved policy contract. დამრგვალების ნაშთის წესიც იყოს დეტერმინისტული, რათა ყოველი ვალუტის თანხები ზუსტად შეეთანხმოს საწყის თანხას. ერთი House როგორც Source და Destination = 33% ორივე როლის თანხის გაერთიანებით, ორმაგი ჩარიცხვის გარეშე.

**პროცესები განსხვავებულია:** კომპანიის შემოსავალი, ლითონის ბიუჯეტი, საკომისიოს ვალდებულება, მესამე მხარის წარმოების ვალდებულება და სამშენებლო ფონდის ალოკაცია. არც 33% კომპანია ნიშნავს 33% წმინდა მოგებას, არც 1% — დეპონირებულ/შესაძენად ხელმისაწვდომ ფულს. ფიზიკური მეგაპოლისის სამშენებლო ფონდის სამართლებრივი/საბანკო მოწყობა ცალკე დამტკიცდეს.

**დეფერალი:** pending ≠ available. გადავადებული ვალდებულებიდან თანხის დაკლების ბრძანებას აქვს `source_commission_entry_id`, `target_liability_id`, approval, atomic reservation/settlement და audit. თანხის ერთი და იგივე ერთეული ვერ დაირეზერვება ორჯერ; refund/chargeback იწვევს შესაბამის უკუქცევის ჩანაწერს და არა ისტორიის წაშლას.

## I05 · QR და შეკვეთის წყაროს უცვლელი მტკიცებულება

- Brand QR / Product QR / Social post tracked link ყველა მიბმულია **არსებულ QR resolver-სა და Attribution System-ზე**.
- შენახვადი მტკიცებულება: `source_house`, `destination_house`, `campaign_id`, `landing_product_id`, `attribution_event_id`, `timestamp`, allowed consent/context, policy version, eventual order link.
- დაუდასტურებელი `click`/`view` არ არის ფინანსური კავშირი. წყაროს არჩევა/lock სრულდება დასაშვები ბიზნეს-წესით და შემდგომმა ვიზიტმა უკვე ჩაკეტილი წყარო არ გადაწეროს.
- Default company gateway Source შეიძლება იყოს CORE QR მხოლოდ მოქმედი მტკიცებულებული პოლიტიკით; საწყისი წყაროს მითითება არ ნიშნავს საკომისიოს გამომუშავებას.
- ტესტები: duplicate scans, same House both roles, late click, tampered links, absent consent, private product, refund, changed campaign, source precedence, mobile deep link.

## I06 · 144-მილიონიანი სცენარის დათვლის პროტოკოლი

- `N_initial_houses × N_confirmed_requests_per_house` = რეალური პირველი ტალღის რაოდენობა მხოლოდ მაშინ, თუ მოთხოვნები CORE-ში არსებობს.
- `N_external_new_buyers × N_confirmed_requests_per_new_buyer` = ახალი შეკვეთების მოთხოვნები შესაბამისი რეალური მყიდველებისგან.
- `12,000 × 12 = 144,000` — 12,000 ახალ მყიდველზე 12-12 ახალი ოფიციალური მოთხოვნა.
- `12,000 × 12,000 = 144,000,000` — სხვა, **უფრო ძლიერი** მოცულობის სცენარი; მისი შეკვეთების ფაქტობრივი რაოდენობა მხოლოდ შესაბამისი უნიკალური order-request არსებობით დადასტურდება.
- 3 თვე — პროგნოზის ფანჯარა და არა შესრულების გარანტია. სიმულატორი იღებს timeframe, unique buyers, orders per buyer, funnel conversion, cancellation, payment conversion, lead-time და production capacity-ს.
- UI-ში ყოველთვის ცალ-ცალკეა `RECORDED REQUESTS / ACCEPTED ORDERS / DEFERRED ORDERS / VERIFIED PAID SALES / NET CASH RECEIVED / FULFILLED UNITS`. რეგისტრაციების, პოტენციური მოცულობისა და რეალური ბრუნვის გაერთიანება აკრძალულია.

## I07 · GOLD/SILVER პაკეტი და ერთეულების ზუსტი საზღვარი

- ერთი person → ერთი CORE ID → საბაზისო House → 12 Line → 12 შეძენისთვის წარსადგენი პროდუქტის მოთხოვნა. **12 Line ≠ 12 დაფინანსებული წარმოება.**
- GOLD: 1–12 დასამზადებელი ნივთის შესაძლო პაკეტი შესაბამისი დამტკიცებული პირობებით, საერთო MERGE 8K gold composite envelope `≤1000 g` პროდუქციასა და ქეისში (არ ნიშნავს 1000g სუფთა ოქროს). დანარჩენი მასალები ცალკე სპეციფიკაციით.
- SILVER: ერთი ფიზიკური ნივთის დამტკიცებული პაკეტი და შესაბამისი დამტკიცებული ქეისი; დარჩენილი შეკვეთები ცალკე დაფარვას საჭიროებს.
- MERGE COIN CASE არის მრგვალი გასახსნელი luxury ჩანთა/ქეისი; product case, commercial package და CORE-ის weight-based Coin quantity არის სამი განსხვავებული ცნება. არ გააერთიანო ერთმანეთის გარეშე. არ გამოიგონო Silver weight cap.
- მასალის `1:2` მასური თანაფარდობა და მისი Ag 999.9 კომპონენტის სისუფთავე არ ნიშნავს საბოლოო ნივთის ოფიციალურ სინჯს; საჭიროა პროდუქტის ბაზრის მიხედვით ნიშნადების შესაბამისობის შემოწმება.

## I08 · 3D მუზეუმის დადასტურებადი გამოცდილება

`CLOSED DOOR → SLOW PHYSICAL OPENING → OPEN DOOR → CONTINUOUS WALK-IN → 12 SECTORS / CENTRAL 13th MERGE SPACE → REAL PRODUCT EXHIBIT → BACK TO SAME POSITION`.

- გამოყენებული იყოს მოქმედი scene assets და ყველა 18 დამტკიცებული reference image; ახალი და ძველი asset-ის შესაბამისობა ჩაიწეროს asset manifest-ში.
- ოფიციალური MASTER CORE v2.2-ის ორიგინალი ლოგოს მასალა გამოყენებულ იქნას უცვლელი ფორმით, მთავარი შესასვლელის ზედა ნაწილში. Generic star არ ვარგა.
- `scene_id / node_id / camera pose / floor / selection / navigation history` შეინახე როგორც UX state, არა ფინანსური ან product truth.
- Three.js + actual GLTF/GLB მხოლოდ რეალური მოდელების შემთხვევაში; sprite/2D depth effect არ მონიშნო ნამდვილი 3D-დ. ხარისხის tier-ები და progressive load მოერგოს მობილურს.
- მხარდაჭერილი იყოს keyboard control, reduced-motion, Skip 3D, accessible text catalog/ordering, stable CTA. **Generated image text English only**, მაგრამ ცოცხალი UI-ს თარგმანები მომხმარებლის ენით მართე და შენახულ ქართულ ისტორიულ მონაცემებს არ შეეხო.

## I09 · Digital Twin-ის შეკვეთასთან კავშირი

- Fit Profile არის consent-based და არ იდება Social API-ში. სხეულის ზომები წინასწარ არ გამოიგონო ფოტოს მიხედვით.
- რეალური შეკვეთის წარდგენამდე მოითხოვე **მხოლოდ იმ პროდუქტის კატეგორიისთვის სავალდებულო ზომები**. დაუსრულებელ profile-ზე მიუთითე რომელიც ზუსტად აკლია.
- მორგება არ ცვლის წყაროს დიზაინს; ქმნის ვერსიას/კონფიგურაციას. Virtual Try-On, physical fit confirmation და manufacturing measurement სხვადასხვა მტკიცებულებებია.
- მორგების არასწორი მონაცემის ცვლილებისას verified offer შესაძლოა გახდეს stale და მოითხოვოს ხელახალი შემოწმება.

## I10 · AI და სოციალური ქსელები — ღია უფლებების ზღვარი

- ამოცანის რეჟიმები: `DRAFT_ONLY`, `NEEDS_APPROVAL`, `AUTHORIZED_AUTOPILOT`. Publisher/paid ad/financial operation იყენებს ცალკე უფლებას და scope-ს, არა ჩატის ზოგად ინსტრუქციას.
- Self Registration / AI Assisted Setup / Connect Existing არის მომხმარებლის არჩევანი. AI შეუძლია მხოლოდ შესაბამისი ოფიციალური provider-ის ნებადართული რეგისტრაციის ან connected-app მოქმედებები. Password/OTP/CAPTCHA/2FA გადის მომხმარებლის ოფიციალურ პროვაიდერულ ფანჯარაში.
- Connected არის provider-verified; user-entered handle არ არის connectivity proof. Social Gallery-ის ვიდეოები ნამდვილი public authorized embeds ან links; გადაღებული ფიზიკური ნივთი ≠ AI-ს მიერ გენერირებული product render.
- სოციალური პროვაიდერის capability registry: `signup_guidance`, `supported_connect`, `publish`, `analytics`, `public_embed`, `permissions_granted`, `expires_at`, `revoke_state`, `review_state`. ერთ პროვაიდერზე ფუნქცია შეიძლება იყოს მხოლოდ `SETUP_REQUIRED`; ეს არ არის სისტემის შეცდომის დამალვის საბაბი.
- MERGE AI ტექსტის პასუხს არ უნდა ჰქონდეს ხელმისაწვდომი სხვა მომხმარებლის private ზომები, გადასახადი, ელფოსტა ან ლოგები. Tool output არის untrusted data; Prompt Injection ვერ ცვლის owner/scope/amount-ს.

## I11 · წარმოება და საწარმოო მტკიცებულების ბილიკი

ამ კონკრეტული მიწოდების მოდელში CORE ერთმანეთთან აკავშირებს (არსებულ სახელებზე მოყვანით): customer order → manufacturer assignment → manufacturing PO → material procurement PO → versioned 1:2 material spec → approved filament factory → lot/batch passport & actual warranty → shipping manifest → partner factory receiving → required checks → authorized production → final QC/XRF → physical item passport → delivery & claim.

- `Factory document uploaded` არ ნიშნავს `factory certificate authentic` ან `QC passed`.
- Delivered quantity, received quantity, material consumed, scrap and returned quantity შედარდეს დამტკიცებული მასის ერთეულებით.
- პარტნიორის დადასტურებული ლოგო, role, license, patent or manufacturer status გამოიყენე მხოლოდ არსებულ ACTIVE შეთანხმებაზე. უფლების არქონისას `BLOCKED` და საჭირო რეალური დამტკიცება.
- ოპერაციულ კონტრაქტს ჰქონდეს lead time, risk transfer, shipping Incoterms only if agreed, cancellation policy, defect/remedy procedure and provenance.

## I12 · სისტემის ჯანმრთელობა, ხარჯი და აღდგენა

- LIVE PULSE ზომავს რეალურ ავთენტიფიკაციას, API latency, DB availability, QR resolver, PSP/ledger reconciliation, event queues, AI/chat, social adapters, 3D scene errors, production and passport service.
- ციფრები აჩვენე **timestamp/source/staleness label**-ით; ობსერვაბელობა არ ნიშნავს მუდმივ წარმატებას. Synthetic test logs არ მოხვდეს საჯარო LIVE მონაცემებში.
- SLO: შესათანხმებელი real baseline შემდეგ; საწყისი საცდელი მიზნები V23 G05-შია. P0 ფულად შეცდომაზე და data leak-ზე incident workflow + safe mode.
- სამუშაოებისა და ხარჯების ლიმიტები: 3D GPU usage, Meshy AI credits, video generation, social publishing rate limits, queue throughput, real PSP costs. ულიმიტო უფასო გამოთვლები არ დაპირდე.
- სარეზერვო ასლი და **restore drill-ის მტკიცებულება** სავალდებულოა; სარეზერვო ასლის არსებობა თავისთავად არ ნიშნავს აღდგენადობას.

## I13 · საერთაშორისო ტესტებისა და მტკიცებულებების საზომები

- OWASP ASVS v5.0.0-ის შესაბამისი **კონკრეტული versioned requirement ID**-ები დაუკავშირე კოდის ნაწილის დამცავ ტესტებს; OWASP API Security Top 10:2023 გამოიყენე ობიექტების/ფუნქციების უფლებებისთვის.
- NIST SSDF v1.1 final როგორც სამუშაო პრაქტიკა; Rev.1 (SSDF v1.2) **დოკუმენტის შედგენისას Initial Public Draft**; არ გამოიყენო draft როგორც approved final.
- WCAG 2.2 AA: keyboard-only checkout, meaningful focus, screen-reader status changes, contrast, error identification, authentication alternatives, reduced motion, non-3D path, target size.
- PCI DSS 4.0.1: scope/SAQ/ROC eligibility ზუსტად განსაზღვროს PSP + merchant assessor; hosted checkout არ ნიშნავს ავტომატურ PCI exemption-ს. არ მიიღოთ ბარათის PAN/CVV AI ჩატში ან CORE logs-ში.
- ISO/IEC 27001 და 42001: risk register, policy, owners, evidence/controls; NIST AI RMF: AI action register + monitoring and escalation. **არ აცხადოთ სერტიფიკაცია თვითშეფასების გარეშე**.
- ენა/დიზაინი: რეალური გამოსახულებების ინგლისური ტექსტი, ვერსიის მქონე ორიგინალი ლოგო, true product status. accessibility/3D/financial tests ცალ-ცალკე PASS/FAIL/BLOCKED/NOT RUN.

## I14 · საბოლოო წვდომა, release-ის გადაწყვეტილება და პასუხისმგებლობა

- Developer გუნდი აღწერს diff, migration, test proof, known blockers. Founder ამტკიცებს ვიზუალურ და საოპერაციო მიზანს. Finance+Legal ამტკიცებენ ფინანსურ contract/policy-ს, Tax Advisor—tax treatment-ს, Security/Tech Lead—security and reliability gates-ს, Production Lead—მასალა/წარმოება/QC-ს.
- Deploy მხოლოდ კონკრეტულ არსებულ `mergestars.com` რეპოზიტორიის ავტორიზებული წვდომით; private chatgpt.site reference არ უნდა გამოაცხადოთ production source-ად.
- გაიყოს `DOCUMENT FINALIZED` / `POLICY APPROVED` / `CODE IMPLEMENTED` / `INTEGRATION TESTED` / `STAGING PASSED` / `FOUNDER RELEASE APPROVED` / `LIVE DEPLOYED`. ერთი სტატუსი მეორეს არ ნიშნავს.
- გამოსვლის შემდეგაც აუცილებელია incident notification, monitoring, rollbacks, safe migrations, production reconciliation და periodic rights/security reviews.

# J. გლობალური ხარისხის მიღების კონტრაქტი (მიზნები, არა დეკლარირებული სერტიფიკაცია)

| Quality dimension | Review/acceptance evidence | Release severity |
|---|---|---|
| Correct money | Exact ledger reconciliation, policy_version, PSP evidence, refund and reverse test, 2% separate | P0 |
| Correct 12 orders | 12 unique IDs after explicit user confirmation; retry creates 0 duplicates; status truth | P0 |
| Cross-user isolation | Owner/non-owner tests for all House, media, Fit, finance and AI objects | P0 |
| Brand & IP lineage | Original product immutable; creator, source, buyer, owner and license distinguishable | P0 |
| Real-world production | Authorized funded PO, lot/batch receipt, manufacturer evidence and final QC/XRF | P0 |
| Accurate QR | Locked Source/Destination, real order-link, no views → commission | P0 |
| Honest external accounts | Real provider result for CREATED/CONNECTED/PUBLISHED, revocation enforced | P0 |
| Exact visual identity | Canonical MASTER CORE v2.2 logo and approved entry/museum assets | P1 |
| Working museum | Closed/open/walk/return real 3D, accessible fallback, mobile | P1 |
| Live Pulse | Real observed events, stale data indicator, no illustrative metrics masquerading as LIVE | P1 |
| International review | ASVS/WCAG/PCI/SSDF/AI risk checklists and evidence, no unsupported badges | P1 |
| Operational recovery | Restore drill, rollback, reprocessing, incident response and observability evidence | P0/P1 |

**საბოლოო აკრძალვები:** *არ გაააქტიურო დაუდასტურებელი ფინანსური პოლიტიკა, არ გამოაცხადო ხელმოუწერელი ხელშეკრულება მოქმედად, არ აურიო ვიზუალური პროტოტიპი ცოცხალ CORE-თან, არ წაშალო ისტორია და არ გამოაქვეყნო საჯაროდ დამფუძნებლის ცალკე ავტორიზაციის გარეშე.*

# APPENDIX 1 — ძველი V22.7-სა და V23-ის ურთიერთობა

თავდაპირველი **V22.7 01–71** ინახება ცალკე ARCHIVE ფაილად; არც ერთი ისტორიული claim/partner/material case არ იშლება. მისი მოქმედი ფინანსური **25/25/50** რჩება მხოლოდ მისი დამტკიცებული applicability/history-ს ფარგლებში. ახალი proposed allocation 33/33/33/1 და ახალი 12-order UX განიხილება ამ დოკუმენტის მმართველობის წესით. სოციალური SECTION 19 (წინა დამატება) **არ არის იგივე**, რაც საბაზისო 19-ე Pricing Section; საბოლოოდ ნუმერაცია ხდება სფეროებით (A–H), რომ აღარ დაეჯახოს ერთმანეთს. 12 მთავარი ინდუსტრიული ზონის / 12 პირადი Brand Line / 30 კატეგორიული House რიცხვები არის სამი სხვადასხვა განზომილება. `1kg weight → Coin` ძველი სააღრიცხვო წესი და პაკეტის 1kg GOLD 8K composite limit არც ერთიანად იგულისხმება: pricing/quantity ამომწურავად გაირკვეს ცალკე დამტკიცებულ policy registry-ში.

# APPENDIX 2 — ღია დამტკიცებები / OPEN DECISIONS

| ID | გადასაწყვეტი საკითხი | ვისგან მოითხოვება |
|---|---|---|
| D-01 | ახალი 33/33/33/1 + გარეთა 2% ბაზა, ეფექტური თარიღი, VAT/FX/rounding, ისტორიული legacy scope | Founder + Finance + Legal |
| D-02 | 12 `ORDER_REQUEST` და 12 `ORDER_ACCEPTED` განსხვავება: როდის დგება იურიდიული ვალდებულება | Founder + Legal + Product |
| D-03 | GOLD/SILVER packages: one invoice vs 12 order IDs, 1kg composite envelope, item/case bill of materials, exception and refund | Founder + Production + Legal |
| D-04 | პირველი 1,000-ის აქტიური ადგილის რაოდენობა და 33-day policy operational rules | Founder + Operations + Legal |
| D-05 | 144m სცენარის ზუსტი რეფერალური მექანიზმი, conversion assumptions, no downline reward | Founder + Analytics + Legal |
| D-06 | ფიზიკური მეგაპოლისის 1%-იანი ფონდის ბუღალტრული/სამართლებრივი სტატუსი | Founder + Finance + Legal |
| D-07 | დადასტურებული ლოგოს exact file, მუზეუმის სცენის და 18 სურათის asset registry | Founder + Design |
| D-08 | რომელ სოციალურ provider-ზე რეალურად არის signup/publish API-ს მოქმედი წვდომა | Engineering + Provider |
| D-09 | Factory/material agreements, jurisdiction, safety/QC claims, delivery and warranty | Legal + Production |
| D-10 | Existing repo, staging, keys, PSP, AI, Meshy and authorizations — REAL implementation boundary | CTO/Tech Lead |

# APPENDIX 3 — სტანდარტების ოფიციალური წყაროები (სარეკომენდაციო ჩარჩოები)

- OWASP ASVS 5.0.0 — https://owasp.org/www-project-application-security-verification-standard/
- OWASP API Security Top 10 (2023) — https://owasp.org/API-Security/
- NIST SP 800-218 SSDF 1.1 FINAL — https://csrc.nist.gov/pubs/sp/800/218/final
- WCAG 2.2 W3C Recommendation — https://www.w3.org/TR/WCAG22/
- PCI SSC official document library (PCI DSS 4.0.1) — https://www.pcisecuritystandards.org/document_library/
- ISO/IEC 27001:2022 — https://www.iso.org/standard/27001
- ISO/IEC 42001:2023 — https://www.iso.org/standard/42001
- NIST AI RMF — https://www.nist.gov/itl/ai-risk-management-framework

**THE FINAL CORE LAW:**
`REGISTER → DESIGN → EXPLICIT ORDER REQUEST → VERIFIED OFFER/ACCEPTANCE → PAY NOW OR DEFERRED → REAL ATTRIBUTED SALE → ELIGIBLE COMMISSION → FUNDED & AUTHORIZED PRODUCTION → QC → PASSPORT → LIVING MUSEUM → LEGACY`.

**ONE AUTHORITY · ONE HISTORY · THE USER OWNS THEIR ACCOUNTS · NO FAKE PAYMENTS OR LIVE DATA · ORIGINAL COMPANY LOGO ONLY · GENERATIVE IMAGE TEXT IN ENGLISH · CORE NEVER GETS REGENERATED.**

**END OF V23.1 DOCUMENTARY FINAL — FOUNDER APPROVAL AND ACTUAL ENGINEERING IMPLEMENTATION STILL REQUIRED.**
