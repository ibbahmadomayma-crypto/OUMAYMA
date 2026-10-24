import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-abaya-01',
    name: 'Royal Embroidered Silk Abaya',
    nameAr: 'عباية ملكية حريرية مطرزة بالذهب',
    category: 'abayas',
    description: 'Masterfully tailored black crepe-silk abaya adorned with intricate gold arabesque embroidery on the lapels and cuffs. Features an elegant draped cut and flowing silhouette.',
    descriptionAr: 'عباية فاخرة من حرير الكريب الأسود الراقي، مطرزة بتطريزات عربية ذهبية يدوية متقنة على الياقة والأكمام بقصة انسيابية ساحرة.',
    price: 185,
    originalPrice: 220,
    stock: 14,
    status: 'active',
    images: [
      '/src/assets/images/product_luxury_abaya_1792873602148.jpg'
    ],
    sizes: ['S (52)', 'M (54)', 'L (56)', 'XL (58)', 'Free Size'],
    colors: [
      { name: 'Onyx Black & Gold', nameAr: 'أسود ملكي وذهبي', hex: '#1c1917' },
      { name: 'Deep Midnight Navy', nameAr: 'كحلي ليلي', hex: '#1e293b' },
      { name: 'Desert Sand', nameAr: 'بيج رملي', hex: '#d6c7b2' }
    ],
    badge: 'Bestseller',
    fabric: 'Pure Mulberry Crepe Silk & Gold Thread',
    fabricAr: 'حرير كريب التوت الصافي وخيوط مذهبة',
    care: 'Dry clean only or delicate cold hand wash',
    careAr: 'تنظيف جاف فقط أو غسيل يدوي بماء بارد',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-dress-01',
    name: 'Emerald Pleated Satin Maxi Dress',
    nameAr: 'فستان ماكسي زمردي من الساتان الفاخر',
    category: 'dresses',
    description: 'An enchanting emerald green evening gown crafted in luminous heavyweight satin. Designed with a crossover V-neckline, gathered cummerbund waist, and an ethereal high front split.',
    descriptionAr: 'فستان سهرة ساحر بلون الزمرد الأخضر من الساتان اللامع الفاخر، يتميز بفتحة صدر متقاطعة وحزام خصر عريض مزموم مع شق أمامي راقٍ.',
    price: 210,
    originalPrice: 250,
    stock: 9,
    status: 'active',
    images: [
      '/src/assets/images/product_emerald_dress_1792873602067.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Green', nameAr: 'أخضر زمردي', hex: '#065f46' },
      { name: 'Ruby Wine', nameAr: 'عنابي ياقوتي', hex: '#881337' },
      { name: 'Champagne Gold', nameAr: 'ذهبي شامبين', hex: '#e2d5b8' }
    ],
    badge: 'Exclusive',
    fabric: 'Liquid Silk-Satin Blend with Soft Viscose Lining',
    fabricAr: 'مزيج حرير ساتان سائل مع بطانة فيسكوز ناعمة',
    care: 'Dry clean recommended to preserve satin luster',
    careAr: 'يُفضل التنظيف الجاف للحفاظ على بريق الساتان',
    createdAt: '2026-10-12T11:30:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-casual-01',
    name: 'Artisan Linen Two-Piece Casual Set',
    nameAr: 'طقم كتان يومي عصري مكون من قطعتين',
    category: 'casual',
    description: 'Effortless minimalism for modern living. Features a relaxed camp-collar short-sleeve shirt and matching pleated wide-leg trousers woven from organic unbleached Mediterranean linen.',
    descriptionAr: 'أناقة عملية يومية بلمسة مينيمالية، يتكون من قميص بأكمام قصيرة وبنطلون واسع ومريح منسوج من الكتان الطبيعي فائق النعومة والتنفس.',
    price: 135,
    originalPrice: 160,
    stock: 18,
    status: 'active',
    images: [
      '/src/assets/images/product_linen_casual_set_1792873602830.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural Sand', nameAr: 'بيج طبيعي', hex: '#d6cbb8' },
      { name: 'Olive Sage', nameAr: 'زيتي هادئ', hex: '#656d4a' },
      { name: 'Terracotta Clay', nameAr: 'طوبي دافئ', hex: '#a45a3f' }
    ],
    badge: 'New',
    fabric: '100% Certified Organic Breathable Linen',
    fabricAr: '100% كتان عضوي فاخر قابل للتنفس',
    care: 'Machine wash delicate cycle at 30°C, line dry in shade',
    careAr: 'غسيل خفيف بالغسالة عند 30 درجة، تجفيف في الظل',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-acc-01',
    name: 'Hammered Gold Cuff & Baroque Pearl Set',
    nameAr: 'طقم مجوهرات مطلية بالذهب ولؤلؤ باروك حر',
    category: 'accessories',
    description: 'Handcrafted artisan 18k gold-plated hammered cuff bracelet and drop earrings featuring genuine natural baroque freshwater pearls. Paired with a botanical floral silk twill scarf.',
    descriptionAr: 'طقم حلي يدوي الصنع مطلي بالذهب عيار 18 قيراط مع أقراط لؤلؤ باروك طبيعي فاخر، مرفق بوشاح حريري ناعم بنقشة نباتية أندلسية.',
    price: 95,
    originalPrice: 115,
    stock: 22,
    status: 'active',
    images: [
      '/src/assets/images/product_gold_accessories_1792873603176.jpg'
    ],
    sizes: ['One Size'],
    colors: [
      { name: '18K Warm Gold', nameAr: 'ذهب دافئ 18 قيراط', hex: '#d4af37' },
      { name: 'Rose Gold', nameAr: 'ذهب وردي', hex: '#b76e79' }
    ],
    badge: 'Exclusive',
    fabric: '18k Gold on Recycled Brass, Natural Pearls, 100% Silk Scarf',
    fabricAr: 'نحاس معاد تدويره مطلي بذهب 18، لؤلؤ طبيعي، وشاح حرير 100%',
    care: 'Avoid direct perfume contact; wipe gently with microfiber cloth',
    careAr: 'تجنب ملامسة العطور المباشرة والمسح بقطعة قماش ناعمة',
    createdAt: '2026-10-16T14:20:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-abaya-02',
    name: 'Minimalist Biscotti Linen Kimono Abaya',
    nameAr: 'عباية كيمونو كتان بيسكوتي هادئة',
    category: 'abayas',
    description: 'Contemporary open-front kimono abaya with wide batwing sleeves, subtle French seam detailing, and a removable self-tie waist sash. Versatile for morning to evening styling.',
    descriptionAr: 'عباية عصرية مفتوحة بقصة كيمونو فضفاضة وتفاصيل حياكة فرنسية دقيقة مع حزام خصر اختياري أنيق لمختلف المناسبات.',
    price: 155,
    originalPrice: 175,
    stock: 12,
    status: 'active',
    images: [
      '/src/assets/images/product_luxury_abaya_1792873602148.jpg'
    ],
    sizes: ['S (52)', 'M (54)', 'L (56)', 'XL (58)'],
    colors: [
      { name: 'Warm Biscotti', nameAr: 'بيسكوتي دافئ', hex: '#cbaf93' },
      { name: 'Dusty Rose', nameAr: 'وردي هادئ', hex: '#c59b97' },
      { name: 'Classic Black', nameAr: 'أسود كلاسيك', hex: '#1c1917' }
    ],
    badge: 'New',
    fabric: 'Lightweight Linen-Cotton Slub Blend',
    fabricAr: 'مزيج الكتان والقطن الخفيف والناعم',
    care: 'Cold hand wash or gentle machine wash',
    careAr: 'غسيل يدوي بارد أو غسيل لطيف بالغسالة',
    createdAt: '2026-10-18T08:45:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-dress-02',
    name: 'Ivory Architectural Fluted Midi Dress',
    nameAr: 'فستان عاجي ميدي بقصة معمارية راقية',
    category: 'dresses',
    description: 'Sculptural sleeveless midi dress in premium ivory crepe with structured shoulder accents, tapered waist seam, and an asymmetrical fluted hem.',
    descriptionAr: 'فستان ميدي عاجي بتصميم نحتي مميز وأكتاف عريضة وقصة خصر محددة مع تنورة منسدلة بأناقة استثنائية.',
    price: 190,
    originalPrice: 225,
    stock: 7,
    status: 'active',
    images: [
      '/src/assets/images/hero_womens_fashion_banner_1792873601726.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Warm Ivory', nameAr: 'عاجي دافئ', hex: '#f7f4ee' },
      { name: 'Midnight Charcoal', nameAr: 'فحمي داكن', hex: '#262626' }
    ],
    badge: 'Exclusive',
    fabric: 'Heavy Bonded Wool-Crepe with Smooth Satin Stretch Lining',
    fabricAr: 'كريب صوف متماسك مع بطانة ساتان مرنة',
    care: 'Professional dry clean',
    careAr: 'تنظيف جاف احترافي',
    createdAt: '2026-10-19T13:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  }
];

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_womens_fashion_banner_1792873601726.jpg';
