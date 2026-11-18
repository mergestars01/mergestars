import type { CatalogCategory } from './catalog-categories';

export const industryDestinations = [
  {
    code: 'FASHION_LUXURY',
    label: 'Fashion & Luxury',
    labelKa: 'მოდა და ლუქსი',
    categories: [
      'fashion',
      'jewelry',
      'watches',
      'eyewear',
      'shoes',
      'bags',
      'accessories',
    ],
  },
  {
    code: 'MOBILITY_ENGINEERING',
    label: 'Mobility & Engineering',
    labelKa: 'მობილობა და ინჟინერია',
    categories: ['transport'],
  },
  {
    code: 'HOME_FAMILY',
    label: 'Home & Family',
    labelKa: 'სახლი და ოჯახი',
    categories: ['furniture', 'children', 'strollers', 'sanitaryware'],
  },
  {
    code: 'ARCHITECTURE_CONSTRUCTION_DECOR',
    label: 'Architecture, Construction & Decor',
    labelKa: 'არქიტექტურა, მშენებლობა და დეკორი',
    categories: ['construction', 'decor', 'lighting'],
  },
  {
    code: 'KIDS_TOYS_GAMES',
    label: 'Kids, Toys & Games',
    labelKa: 'ბავშვები, სათამაშოები და თამაშები',
    categories: ['toys', 'dolls', 'children'],
  },
  {
    code: 'MUSIC_SOUND',
    label: 'Music & Sound',
    labelKa: 'მუსიკა და ხმა',
    categories: ['music'],
  },
  {
    code: 'STATIONERY_OFFICE_EDUCATION',
    label: 'Stationery, Office & Education',
    labelKa: 'საკანცელარიო ნივთები, ოფისი და განათლება',
    categories: ['stationery'],
  },
  {
    code: 'TECHNOLOGY_FUTURE',
    label: 'Technology & Future',
    labelKa: 'ტექნოლოგია და მომავალი',
    categories: ['technology'],
  },
  {
    code: 'ART_MOSAIC_CULTURE',
    label: 'Art, Mosaic & Culture',
    labelKa: 'ხელოვნება, მოზაიკა და კულტურა',
    categories: ['art', 'souvenirs'],
  },
  {
    code: 'SPORTS_OUTDOOR',
    label: 'Sports & Outdoor',
    labelKa: 'სპორტი და აქტივობები ღია ცის ქვეშ',
    categories: ['sports'],
  },
  {
    code: 'BEAUTY_WELLBEING',
    label: 'Beauty & Wellbeing',
    labelKa: 'სილამაზე და კეთილდღეობა',
    categories: ['beauty'],
  },
  {
    code: 'SACRED_ART_HERITAGE',
    label: 'Sacred Art & Heritage',
    labelKa: 'საეკლესიო ხელოვნება და მემკვიდრეობა',
    categories: ['sacred-art'],
  },
] as const satisfies readonly {
  code: string;
  label: string;
  labelKa: string;
  categories: readonly [CatalogCategory, ...CatalogCategory[]];
}[];
