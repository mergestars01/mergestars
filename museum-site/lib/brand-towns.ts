import {cityHouses,type CityHouseId} from './megapolis-domain';
import type {MuseumDestination} from './house-experience';

// Experience taxonomy, never CORE cities, partners, factories or entitlements.
type Quarter={id:string;title:string;description:string;house:CityHouseId;category:number};
export type BrandTown={id:string;title:string;short:string;description:string;color:string;x:number;y:number;quarters:readonly Quarter[]};
const q=(id:string,title:string,description:string,house:CityHouseId,category:number):Quarter=>({id,title,description,house,category});
export const brandTowns:readonly BrandTown[]=[
 {id:'fashion',title:'FASHION TOWN',short:'Fashion',color:'#d9a6bd',x:50,y:11,description:'A complete fashion world: couture, footwear, bags, textiles and the details that make a signature.',quarters:[
  q('couture','Couture Boulevard','Dresses, suits, coats, tailoring, sportswear and children’s clothing.','fashion',0),
  q('footwear','Footwear Quarter','Sneakers, boots, heels, sandals, lasts and your own footwear direction.','fashion',1),
  q('bags','Bag & Case Ateliers','Handbags, backpacks, travel bags, clutches and luxury Coin cases.','fashion',2),
  q('headwear','Headwear Studios','Hats, caps, berets and sculptural headpieces.','fashion',3),
  q('belts','Belt & Hardware Works','Belts, buckles and modular fashion hardware.','fashion',4),
  q('ties','Tie & Formalwear Salon','Ties, bow ties and finishing details.','fashion',5),
  q('scarves','Scarf & Textile Studios','Scarves, shawls, wraps and new textile directions.','fashion',6),
  q('accessories','Accessory Avenue','Gloves, cufflinks and coordinated accessories.','fashion',7),
  q('eyewear','Eyewear Atelier','Frames, sunglasses and permitted source components.','eyewear',0),
  q('mosaic-textile','Mosaic Textile Lab','Selective mosaic, yarn and textile surfaces for a collection.','mosaic',3),
 ]},
 {id:'smart',title:'SMART BRANDS TOWN',short:'Smart Brands',color:'#83d1eb',x:72,y:17,description:'Smart objects, personal AI concepts and connected accessories, with original electronics kept separate.',quarters:[
  q('devices','Smart Object Studios','Wearable housings, personal AI capsule concepts and connected objects.','robotics',6),
  q('connectivity','Sensors & Connectivity Lab','Sensor shells, removable modules and connectivity enclosures.','robotics',7),
  q('vision','Smart Vision Atelier','Optical frame designs; lenses and electronics need their own approval.','eyewear',0),
  q('time','Connected Time Studio','Watch exteriors and the integration of protected manufacturer mechanisms.','watches',0),
  q('smart-home','Smart Home Quarter','Service-robot shells, connected home objects and assistive concepts.','robotics',1),
  q('collectibles','Digital Object Gallery','Creator concepts and collectible technology exteriors.','art',2),
 ]},
 {id:'office',title:'OFFICE & STATIONERY TOWN',short:'Office & Stationery',color:'#e7c493',x:84,y:27,description:'A city for writing, drawing, planning and beautiful workspaces, from a signature pen to a complete office.',quarters:[
  q('writing','Writing Instrument Atelier','Pens, fountain pens, pencils and personal writing tools.','art',4),
  q('drawing','Drawing & Art Tools','Drawing tools, brush-handle concepts and artist accessories.','art',4),
  q('paper','Paper & Planner Studios','Notebook covers, planners, folders and presentation accessories.','art',5),
  q('desk','Desk Object Works','Organizers, paperweights, business-card cases and pen cases.','art',5),
  q('library','Library & Archive Quarter','Bookends, reading furniture, shelving and archive objects.','interior',0),
  q('workspace','Workspace Design House','Office furniture, task lighting and spatial design.','interior',5),
 ]},
 {id:'home',title:'HOME & LIVING TOWN',short:'Home & Living',color:'#d7d2b1',x:88,y:43,description:'Furniture, household objects, lighting, kitchens, bathrooms and textiles in one connected living world.',quarters:[
  q('furniture','Furniture Avenue','Chairs, tables, sofas, beds, storage and complete furniture collections.','interior',0),
  q('lighting','Lighting Atelier','Chandeliers, lamps, wall lights and architectural lighting concepts.','interior',1),
  q('curtains','Curtain & Drapery Works','Drapery, textile surfaces and decorative screens.','interior',2),
  q('carpets','Carpet & Rug Gallery','Rugs, carpets and decorative floor concepts.','interior',3),
  q('decor','Decorative Objects','Vases, mirrors, clocks and finishing objects.','interior',4),
  q('household','Everyday Living Studios','Organizers, storage and everyday household accessories.','interior',6),
  q('kitchen','Kitchen & Tableware Quarter','Serving objects, kitchen organizers and tableware concepts; contact safety requires approval.','interior',7),
  q('bathroom','Bathroom Collection House','Mirrors, organizers, soap dishes and towel accessories.','interior',8),
  q('rooms','Interior Design House','Bedroom, bathroom, living room and complete spatial design.','interior',5),
 ]},
 {id:'jewelry-time',title:'JEWELRY & TIME TOWN',short:'Jewelry & Time',color:'#e4bf72',x:84,y:61,description:'Jewelry houses and watch ateliers meet around the source, the mechanism and the maker’s signature.',quarters:[
  q('rings','Ring Atelier','Rings, signets and wedding designs with the applicable finger fit.','jewelry',0),
  q('earrings','Earring Salon','Studs, drops and hoops in your own approved design direction.','jewelry',1),
  q('necklaces','Necklace & Pendant Gallery','Chains, necklaces and pendants.','jewelry',2),
  q('bracelets','Bracelet Works','Bangles, cuffs and bracelets with wrist measurements.','jewelry',3),
  q('brooches','Brooch & Pin Studios','Pins, brooches and collectible accessories.','jewelry',4),
  q('watchmakers','Watchmakers’ Avenue','Cases, dials, straps and source-attributed mechanisms.','watches',0),
  q('clocks','Clock Gallery','Wall clocks, table clocks and sculptural timepieces.','watches',1),
  q('cases','Watch Case Atelier','Cases, bracelets and the protective object around the watch.','watches',2),
 ]},
 {id:'mosaic',title:'MOSAIC TOWN',short:'Mosaic',color:'#69bdb0',x:73,y:78,description:'The MERGE mosaic language across objects, architecture and textiles, from micro details to monumental surfaces.',quarters:[
  q('surfaces','Surface & Panel Studios','Panels, surfaces and precise ornamental fields.','mosaic',0),
  q('drapery','Mosaic Drapery House','Curtains and layered textile concepts.','mosaic',1),
  q('rugs','Mosaic Carpet Works','Carpets, rugs and large compositional patterns.','mosaic',2),
  q('yarn','Yarn & Textile Lab','Filament-to-yarn and textile research directions.','mosaic',3),
  q('objects','Object Mosaic Atelier','Selective mosaic for personal and decorative objects.','mosaic',4),
  q('architecture','Architectural Mosaic Quarter','Facades, interiors and architectural-scale concepts.','mosaic',5),
 ]},
 {id:'games',title:'GAME & TOY TOWN',short:'Games & Toys',color:'#dda1a8',x:50,y:85,description:'Games, dolls, models, textile toys and interactive concepts, organized by the object you want to create.',quarters:[
  q('chess','Chess & Classic Games House','Chess, draughts, backgammon and dominoes.','games',0),
  q('board','Board Game & Puzzle Works','Board games, strategy sets and mechanical puzzles.','games',1),
  q('dolls','Doll & Figure Studios','Dolls, dollhouses, figures and licensed characters with permission.','games',2),
  q('plush','Soft & Textile Toy Atelier','Plush toys, puppets, knitted and woven toy concepts.','games',3),
  q('construction','Construction & Model Works','Blocks, model kits and mechanical construction sets.','games',4),
  q('vehicles','Miniature Mobility House','Toy cars, boats, trains and aircraft.','games',5),
  q('flexible','Flexible Toy Lab','Sensory and elastomer-component concepts, subject to safety review.','games',6),
  q('outdoor','Outdoor Play Quarter','Water, beach and outdoor play concepts.','games',7),
  q('interactive','Interactive Toy Studios','Toy robots and interactive figures.','games',8),
  q('learning','Learning & Music House','Learning toys, activity sets and musical concepts.','games',9),
  q('yarn-toys','Yarn & New Textile House','Knitted, woven and new textile toy directions.','games',10),
  q('baby','Baby & Toddler Collection','Age-appropriate concepts; safety and material approval are mandatory.','games',11),
 ]},
 {id:'music',title:'MUSICAL INSTRUMENTS TOWN',short:'Music',color:'#e3b181',x:26,y:77,description:'Instrument makers, acoustic research and performance architecture in a city built around music.',quarters:[
  q('strings','String Instrument Atelier','Guitars, violins, cellos, harps and bowed instruments.','music',0),
  q('wind','Wind Instrument Studios','Flutes, clarinets, saxophones and brass instruments.','music',1),
  q('keys','Keyboard Makers’ House','Piano, organ and accordion concepts.','music',2),
  q('percussion','Percussion Works','Drums, cymbals and tuned or hand percussion.','music',3),
  q('electronic','Electronic Instrument Lab','Hybrid instruments and approved electronic housings.','music',4),
  q('folk','Georgian & World Instruments','Panduri, chonguri, salamuri, doli and world folk instruments.','music',5),
  q('accessories','Instrument Case & Accessory Atelier','Cases, stands and approved decorative components.','music',6),
 ]},
 {id:'robotics',title:'ROBOTICS TOWN',short:'Robotics',color:'#9ab9e6',x:16,y:59,description:'Humanoid, service and industrial robot concepts with visible separation of original technical components.',quarters:[
  q('humanoids','Humanoid Design House','Avatar bodies and humanoid exterior concepts.','robotics',0),
  q('service','Service Robot Studios','Companion and assistive robot housings.','robotics',1),
  q('education','Educational Robotics Lab','Learning kits and educational systems.','robotics',2),
  q('industrial','Industrial Prototype Quarter','Robot arms, approved housings and automation concepts.','robotics',3),
  q('kinetic','Kinetic Art Atelier','Interactive installations and robotic art.','robotics',4),
  q('performance','Automated Music Works','Self-playing instrument and performance mechanisms.','robotics',5),
 ]},
 {id:'nature',title:'NATURE & ECOLOGY TOWN',short:'Nature & Ecology',color:'#94cda3',x:13,y:40,description:'Botanical form, landscape design and material research, with environmental claims tied to evidence.',quarters:[
  q('trees','Tree Sculpture Gardens','Trees and monumental botanical forms.','nature',0),
  q('flowers','Flower Atelier','Flowers, bouquets and botanical ornament.','nature',1),
  q('shrubs','Botanical Collections','Shrubs and living-form studies.','nature',2),
  q('vertical','Vertical Garden House','Vertical-garden structures and decorative systems.','nature',3),
  q('sculptural','Sculptural Nature Studios','Botanical sculpture and nature-inspired objects.','nature',4),
  q('landscape','Landscape Design Quarter','Landscape installations and public-space concepts.','nature',5),
 ]},
 {id:'art-culture',title:'ART & CULTURE TOWN',short:'Art & Culture',color:'#d2b1df',x:17,y:25,description:'Galleries, sculpture, cultural memory and permitted reinterpretation, connected to source and rights.',quarters:[
  q('sculpture','Sculpture Gardens','Original sculpture, relief and sculptural objects.','art',0),
  q('installation','Installation Studios','Exhibitions, installations and public-art concepts.','art',1),
  q('collectibles','Collectors’ Museum','Collectibles and source-attributed objects.','art',2),
  q('creator','Creator Houses','Original art, creator collections and permitted new versions.','art',3),
  q('architecture','Cultural Architecture Atelier','Georgian church and cultural-space studies; no institutional affiliation is implied.','interior',5),
  q('heritage','Heritage Mosaic House','Permitted architectural ornament and cultural mosaic studies.','mosaic',5),
 ]},
 {id:'mobility',title:'MOBILITY TOWN',short:'Mobility',color:'#a7cbd4',x:30,y:14,description:'Transport design, vehicle interiors and approved MERGE components across land and water.',quarters:[
  q('automotive','Automotive Design House','Vehicle concepts and approved exterior components.','mobility',0),
  q('motorcycles','Motorcycle Atelier','Motorcycle forms, finishes and approved accessories.','mobility',1),
  q('cycles','Bicycle Works','Bicycle concepts and source-attributed components.','mobility',2),
  q('marine','Marine Design Quarter','Boats, yachts and approved interior details.','mobility',3),
  q('components','Material & Interior Lab','Interior finishes and approved material components; protected systems stay with their manufacturer.','mobility',4),
 ]},
];
export const brandTownArtwork='/assets/optimized/merge-twelve-brand-towns-20261019.webp';
export function findBrandTown(id:unknown){return typeof id==='string'?brandTowns.find(t=>t.id===id)??null:null;}
export function resolveTownQuarter(townId:unknown,quarterId:unknown,mode:unknown):MuseumDestination|null{
 const town=findBrandTown(townId),quarter=town?.quarters.find(q=>q.id===quarterId);
 if(!quarter||mode!=='browse'&&mode!=='create')return null;
 const house=cityHouses.find(h=>h.id===quarter.house),category=house?.categories[quarter.category];
 return category?{houseId:quarter.house,category,query:'',mode}:null;
}
