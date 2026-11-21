/** Navigation data only; CORE owns orders, House status and finances. */
export type Line = 'GOLD'|'SILVER';
export const CYCLES = [
{id:'fashion',ka:'მოდა და პერსონალური ფუფუნება',en:'Fashion & Luxury',examples:['ტანსაცმელი','სამკაული','საათი','ჩანთა']},
{id:'mobility',ka:'მობილობა და ტრანსპორტი',en:'Mobility & Transport',examples:['ავტომობილი','მოტოციკლი','იახტა','დრონი']},
{id:'architecture',ka:'არქიტექტურა და მშენებლობა',en:'Architecture & Construction',examples:['სახლი','კარი','ფასადი']},
{id:'furniture',ka:'ავეჯი და ინტერიერი',en:'Furniture & Interior',examples:['ავეჯი','სანათი']},
{id:'household',ka:'სახლი და საყოფაცხოვრებო ნივთები',en:'Home & Household',examples:['ჭურჭელი','საყოფაცხოვრებო ტექნიკა']},
{id:'engineering',ka:'ელექტრონიკა, რობოტიკა და მრეწველობა',en:'Electronics, Robotics & Industry',examples:['ტელეფონი','სმარტსათვალე','რობოტი','დანადგარი']},
{id:'office',ka:'კანცელარია, ოფისი და განათლება',en:'Stationery, Office & Education',examples:['კალამი','სასწავლო ნივთი']},
{id:'beauty',ka:'სილამაზე და პარფიუმერია',en:'Beauty & Perfumery',examples:['სუნამო','სავარცხელი']},
{id:'nature',ka:'ბუნება და მწვანე სამყარო',en:'Nature & Green World',examples:['ბაღი','გამწვანება']},
{id:'wedding',ka:'ქორწინება და დღესასწაულები',en:'Wedding & Celebrations',examples:['საქორწინო ბეჭედი','ცერემონიის დეკორი']},
{id:'children',ka:'ბავშვების სამყარო',en:"Children's World",examples:['სათამაშო','საბავშვო ავეჯი']},
{id:'heritage',ka:'ხელოვნება, კულტურა და სულიერი მემკვიდრეობა',en:'Art & Sacred Heritage',examples:['მოზაიკა','ჯვარი','ხატი']}
] as const;
export type CycleId = (typeof CYCLES)[number]['id'];
export const DESIGNS_PER_PORTAL_PER_LINE=12;
export const LINE_CAPACITY=CYCLES.length*DESIGNS_PER_PORTAL_PER_LINE;
export const HOUSE_CAPACITY=LINE_CAPACITY*2;
export const BRAND_HOUSE_PORTAL=13;
export function positionAtClock(index:number):{left:string;top:string}{
 if(!Number.isInteger(index)||index<1||index>12)throw new Error('Expected 1..12');
 const t=index*Math.PI/6;
 return {left:String(50+43*Math.sin(t))+'%',top:String(50-43*Math.cos(t))+'%'};
}
export function canPublish(e:{coreIdentity:boolean;ownedHouse:boolean;readyCatalog:boolean;consent:boolean;legalReview:boolean;coreApproval:boolean}):boolean{
 return e.coreIdentity&&e.ownedHouse&&e.readyCatalog&&e.consent&&e.legalReview&&e.coreApproval;
}
export function canProduce(e:{offerAccepted:boolean;paymentConfirmed:boolean;makerApproved:boolean;coreAuthorization:boolean}):boolean{
 return e.offerAccepted&&e.paymentConfirmed&&e.makerApproved&&e.coreAuthorization;
}
export function commissionEarned(e:{qualifyingSaleSettled:boolean;commissionVerified:boolean}):boolean{
 return e.qualifyingSaleSettled&&e.commissionVerified;
}