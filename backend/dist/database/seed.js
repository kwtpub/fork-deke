"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const category_orm_entity_1 = require("../modules/categories/infrastructure/typeorm/category.orm-entity");
const product_orm_entity_1 = require("../modules/products/infrastructure/typeorm/product.orm-entity");
const product_series_orm_entity_1 = require("../modules/products/infrastructure/typeorm/product-series.orm-entity");
const product_color_orm_entity_1 = require("../modules/products/infrastructure/typeorm/product-color.orm-entity");
const news_orm_entity_1 = require("../modules/news/infrastructure/typeorm/news.orm-entity");
const banner_orm_entity_1 = require("../modules/banners/infrastructure/typeorm/banner.orm-entity");
const document_orm_entity_1 = require("../modules/documents/infrastructure/typeorm/document.orm-entity");
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'deke_db',
    entities: [
        category_orm_entity_1.CategoryOrmEntity,
        product_orm_entity_1.ProductOrmEntity,
        product_series_orm_entity_1.ProductSeriesOrmEntity,
        product_color_orm_entity_1.ProductColorOrmEntity,
        news_orm_entity_1.NewsOrmEntity,
        banner_orm_entity_1.BannerOrmEntity,
        document_orm_entity_1.DocumentOrmEntity,
    ],
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('DB connected, seeding...');
    await AppDataSource.query('TRUNCATE TABLE product_colors, product_series, products, documents, news, banners, categories RESTART IDENTITY CASCADE');
    const categoryRepo = AppDataSource.getRepository(category_orm_entity_1.CategoryOrmEntity);
    const productRepo = AppDataSource.getRepository(product_orm_entity_1.ProductOrmEntity);
    const seriesRepo = AppDataSource.getRepository(product_series_orm_entity_1.ProductSeriesOrmEntity);
    const colorRepo = AppDataSource.getRepository(product_color_orm_entity_1.ProductColorOrmEntity);
    const newsRepo = AppDataSource.getRepository(news_orm_entity_1.NewsOrmEntity);
    const bannerRepo = AppDataSource.getRepository(banner_orm_entity_1.BannerOrmEntity);
    const documentRepo = AppDataSource.getRepository(document_orm_entity_1.DocumentOrmEntity);
    const siding = await categoryRepo.save(categoryRepo.create({
        name: 'Сайдинг', slug: 'siding', sortOrder: 1,
        description: 'Виниловый и металлический сайдинг для фасадов зданий',
        image: '/uploads/categories/siding.jpg',
    }));
    const roofing = await categoryRepo.save(categoryRepo.create({
        name: 'Кровля', slug: 'roofing', sortOrder: 2,
        description: 'Гибкая черепица и кровельные материалы Döcke',
        image: '/uploads/categories/roofing.jpg',
    }));
    const gutters = await categoryRepo.save(categoryRepo.create({
        name: 'Водосток', slug: 'gutters', sortOrder: 3,
        description: 'Водосточные системы для надёжного отвода воды',
        image: '/uploads/categories/gutters.jpg',
    }));
    const facade = await categoryRepo.save(categoryRepo.create({
        name: 'Фасадные панели', slug: 'facade', sortOrder: 4,
        description: 'Фиброцементные и виниловые фасадные панели',
        image: '/uploads/categories/facade.jpg',
    }));
    const attic = await categoryRepo.save(categoryRepo.create({
        name: 'Чердачные лестницы', slug: 'attic-stairs', sortOrder: 5,
        description: 'Складные чердачные лестницы DOLLE',
        image: '/uploads/categories/attic.jpg',
    }));
    const vinylSiding = await categoryRepo.save(categoryRepo.create({
        name: 'Виниловый сайдинг', slug: 'vinyl-siding', sortOrder: 1,
        parentId: siding.id,
        description: 'Классический виниловый сайдинг',
        image: '/uploads/categories/vinyl-siding.jpg',
    }));
    const metalSiding = await categoryRepo.save(categoryRepo.create({
        name: 'Металлический сайдинг', slug: 'metal-siding', sortOrder: 2,
        parentId: siding.id,
        description: 'Прочный металлический сайдинг',
        image: '/uploads/categories/metal-siding.jpg',
    }));
    const prodLux = await productRepo.save(productRepo.create({
        name: 'Döcke LUX', slug: 'docke-lux',
        categoryId: vinylSiding.id,
        description: 'Премиальный виниловый сайдинг с имитацией дерева. Повышенная жёсткость и насыщенные цвета, устойчивые к ультрафиолету.',
        images: ['/uploads/products/lux-1.jpg', '/uploads/products/lux-2.jpg', '/uploads/products/lux-3.jpg'],
        priceFrom: 450,
        isActive: true,
        isFeatured: true,
        specifications: {
            'Ширина панели': '230 мм',
            'Длина панели': '3660 мм',
            'Толщина': '1,1 мм',
            'Материал': 'ПВХ',
            'Гарантия': '50 лет',
        },
    }));
    const prodPremium = await productRepo.save(productRepo.create({
        name: 'Döcke PREMIUM', slug: 'docke-premium',
        categoryId: vinylSiding.id,
        description: 'Сайдинг с тиснением под дерево и особой системой замка, обеспечивающей отличный монтаж.',
        images: ['/uploads/products/premium-1.jpg', '/uploads/products/premium-2.jpg'],
        priceFrom: 380,
        isActive: true,
        isFeatured: true,
        specifications: {
            'Ширина панели': '205 мм',
            'Длина панели': '3660 мм',
            'Толщина': '1,05 мм',
            'Материал': 'ПВХ',
            'Гарантия': '30 лет',
        },
    }));
    await productRepo.save(productRepo.create({
        name: 'Döcke CLASSIC', slug: 'docke-classic',
        categoryId: vinylSiding.id,
        description: 'Базовый виниловый сайдинг с хорошим соотношением цена/качество.',
        images: ['/uploads/products/classic-1.jpg'],
        priceFrom: 290,
        isActive: true,
        isFeatured: false,
        specifications: {
            'Ширина панели': '200 мм',
            'Длина панели': '3660 мм',
            'Толщина': '0,9 мм',
            'Материал': 'ПВХ',
            'Гарантия': '20 лет',
        },
    }));
    await productRepo.save(productRepo.create({
        name: 'Döcke METAL', slug: 'docke-metal',
        categoryId: metalSiding.id,
        description: 'Металлический сайдинг из оцинкованной стали с полимерным покрытием.',
        images: ['/uploads/products/metal-1.jpg', '/uploads/products/metal-2.jpg'],
        priceFrom: 650,
        isActive: true,
        isFeatured: true,
        specifications: {
            'Ширина панели': '240 мм',
            'Длина панели': '3000 мм',
            'Толщина металла': '0,5 мм',
            'Материал': 'Оцинкованная сталь',
            'Гарантия': '25 лет',
        },
    }));
    const prodShingle = await productRepo.save(productRepo.create({
        name: 'Döcke SHINGLE', slug: 'docke-shingle',
        categoryId: roofing.id,
        description: 'Мягкая кровельная черепица с многослойным битумным покрытием.',
        images: ['/uploads/products/shingle-1.jpg', '/uploads/products/shingle-2.jpg'],
        priceFrom: 520,
        isActive: true,
        isFeatured: true,
        specifications: {
            'Размер листа': '1000×337 мм',
            'Количество листов в пачке': '20',
            'Площадь пачки': '3 м²',
            'Гарантия': '25 лет',
        },
    }));
    await productRepo.save(productRepo.create({
        name: 'Döcke STANDART', slug: 'docke-standart-gutter',
        categoryId: gutters.id,
        description: 'Надёжная водосточная система из ПВХ диаметром 100/75 мм.',
        images: ['/uploads/products/gutter-1.jpg'],
        priceFrom: 180,
        isActive: true,
        isFeatured: false,
        specifications: {
            'Диаметр желоба': '100 мм',
            'Диаметр трубы': '75 мм',
            'Длина желоба': '3000 мм',
            'Материал': 'ПВХ',
            'Гарантия': '25 лет',
        },
    }));
    await productRepo.save(productRepo.create({
        name: 'Döcke STONE', slug: 'docke-stone',
        categoryId: facade.id,
        description: 'Фасадные панели с имитацией натурального камня.',
        images: ['/uploads/products/stone-1.jpg', '/uploads/products/stone-2.jpg'],
        priceFrom: 890,
        isActive: true,
        isFeatured: true,
        specifications: {
            'Размер панели': '1130×480 мм',
            'Толщина': '25 мм',
            'Материал': 'Пенополистирол + декоративный слой',
            'Гарантия': '15 лет',
        },
    }));
    await productRepo.save(productRepo.create({
        name: 'DOLLE Atlanta', slug: 'dolle-atlanta',
        categoryId: attic.id,
        description: 'Деревянные складные чердачные лестницы с люком из массива сосны.',
        images: ['/uploads/products/stairs-1.jpg'],
        priceFrom: 12500,
        isActive: true,
        isFeatured: false,
        specifications: {
            'Размер люка': '70×120 см',
            'Максимальная нагрузка': '150 кг',
            'Высота помещения': '270–300 см',
            'Материал': 'Сосна',
            'Гарантия': '2 года',
        },
    }));
    const seriesLuxElegance = await seriesRepo.save(seriesRepo.create({
        name: 'LUX Elegance',
        slug: 'lux-elegance',
        productId: prodLux.id,
        description: 'Изысканная серия с текстурой под дерево',
        coverImage: '/uploads/series/lux-elegance.jpg',
        specs: [
            { key: 'width', label: 'Ширина', value: '230', unit: 'мм' },
            { key: 'length', label: 'Длина', value: '3660', unit: 'мм' },
            { key: 'thickness', label: 'Толщина', value: '1,1', unit: 'мм' },
        ],
    }));
    const seriesLuxNord = await seriesRepo.save(seriesRepo.create({
        name: 'LUX Nord',
        slug: 'lux-nord',
        productId: prodLux.id,
        description: 'Холодные скандинавские оттенки',
        coverImage: '/uploads/series/lux-nord.jpg',
        specs: [
            { key: 'width', label: 'Ширина', value: '230', unit: 'мм' },
            { key: 'length', label: 'Длина', value: '3660', unit: 'мм' },
        ],
    }));
    await colorRepo.save([
        colorRepo.create({ name: 'Белый', hex: '#FFFFFF', seriesId: seriesLuxElegance.id }),
        colorRepo.create({ name: 'Слоновая кость', hex: '#FFFFF0', seriesId: seriesLuxElegance.id }),
        colorRepo.create({ name: 'Бежевый', hex: '#F5F5DC', seriesId: seriesLuxElegance.id }),
        colorRepo.create({ name: 'Палевый', hex: '#CFAF84', seriesId: seriesLuxElegance.id }),
        colorRepo.create({ name: 'Серый', hex: '#808080', seriesId: seriesLuxElegance.id }),
        colorRepo.create({ name: 'Графит', hex: '#3B3B3B', seriesId: seriesLuxElegance.id }),
    ]);
    await colorRepo.save([
        colorRepo.create({ name: 'Арктический', hex: '#E8F4F8', seriesId: seriesLuxNord.id }),
        colorRepo.create({ name: 'Ледяной голубой', hex: '#B0D4E8', seriesId: seriesLuxNord.id }),
        colorRepo.create({ name: 'Северная ель', hex: '#4A7C6B', seriesId: seriesLuxNord.id }),
    ]);
    const seriesPremiumClassic = await seriesRepo.save(seriesRepo.create({
        name: 'PREMIUM Classic',
        slug: 'premium-classic',
        productId: prodPremium.id,
        description: 'Классическая серия с широкой цветовой палитрой',
        coverImage: '/uploads/series/premium-classic.jpg',
        specs: [
            { key: 'width', label: 'Ширина', value: '205', unit: 'мм' },
            { key: 'length', label: 'Длина', value: '3660', unit: 'мм' },
        ],
    }));
    await colorRepo.save([
        colorRepo.create({ name: 'Белый', hex: '#FFFFFF', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Кремовый', hex: '#FFFDD0', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Пшеничный', hex: '#F5DEB3', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Коричневый', hex: '#8B4513', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Вишнёвый', hex: '#8B0000', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Синий', hex: '#00008B', seriesId: seriesPremiumClassic.id }),
        colorRepo.create({ name: 'Зелёный', hex: '#006400', seriesId: seriesPremiumClassic.id }),
    ]);
    const seriesShingleCountry = await seriesRepo.save(seriesRepo.create({
        name: 'SHINGLE Country',
        slug: 'shingle-country',
        productId: prodShingle.id,
        description: 'Прямоугольная нарезка, классика для загородных домов',
        specs: [
            { key: 'size', label: 'Размер листа', value: '1000×337', unit: 'мм' },
            { key: 'warranty', label: 'Гарантия', value: '25', unit: 'лет' },
        ],
    }));
    await colorRepo.save([
        colorRepo.create({ name: 'Танзанит', hex: '#4B0082', seriesId: seriesShingleCountry.id }),
        colorRepo.create({ name: 'Сахара', hex: '#C2A35A', seriesId: seriesShingleCountry.id }),
        colorRepo.create({ name: 'Ирландия', hex: '#2D6A4F', seriesId: seriesShingleCountry.id }),
        colorRepo.create({ name: 'Рубин', hex: '#9B111E', seriesId: seriesShingleCountry.id }),
        colorRepo.create({ name: 'Мокко', hex: '#4A2C2A', seriesId: seriesShingleCountry.id }),
    ]);
    await bannerRepo.save([
        bannerRepo.create({
            title: 'Döcke — надёжность с немецким качеством',
            subtitle: 'Сайдинг, кровля, водостоки и фасадные решения для вашего дома',
            buttonText: 'Смотреть каталог',
            buttonLink: '/catalog',
            image: '/uploads/banners/banner-1.jpg',
            isActive: true,
            sortOrder: 1,
        }),
        bannerRepo.create({
            title: 'Калькулятор материалов',
            subtitle: 'Рассчитайте точное количество материалов за 2 минуты',
            buttonText: 'Рассчитать',
            buttonLink: '/calculator',
            image: '/uploads/banners/banner-2.jpg',
            isActive: true,
            sortOrder: 2,
        }),
        bannerRepo.create({
            title: 'Гибкая черепица Döcke SHINGLE',
            subtitle: 'Гарантия 25 лет. Богатая палитра 15 цветов.',
            buttonText: 'Подробнее',
            buttonLink: '/catalog/roofing',
            image: '/uploads/banners/banner-3.jpg',
            isActive: true,
            sortOrder: 3,
        }),
    ]);
    await newsRepo.save([
        newsRepo.create({
            title: 'Döcke LUX — обновлённая линейка 2024',
            slug: 'docke-lux-2024',
            excerpt: 'Представляем обновлённую линейку виниловых сайдинг-панелей Döcke LUX с расширенной палитрой и улучшенными техническими характеристиками.',
            content: `<p>Компания Döcke рада представить обновлённую линейку виниловых сайдинг-панелей <strong>Döcke LUX</strong> сезона 2024 года.</p>
<p>Основные изменения:</p>
<ul>
<li>Расширенная палитра — теперь 24 цвета, включая новые модные оттенки</li>
<li>Улучшенная формула ПВХ — повышенная стойкость к температурным перепадам</li>
<li>Новая система замка — ещё более быстрый монтаж</li>
<li>Увеличенная гарантия — 50 лет</li>
</ul>
<p>Панели доступны к заказу уже сейчас. Свяжитесь с нашими менеджерами для получения образцов.</p>`,
            isPublished: true,
            publishedAt: new Date('2024-03-15'),
            coverImage: '/uploads/news/lux-2024.jpg',
        }),
        newsRepo.create({
            title: 'Водосточные системы: как правильно выбрать?',
            slug: 'how-to-choose-gutters',
            excerpt: 'Разбираемся, как подобрать водосточную систему под ваш дом — диаметр желоба, материал, цвет и сопутствующие аксессуары.',
            content: `<p>Правильно выбранная водосточная система защищает фундамент, фасад и кровлю вашего дома от разрушительного воздействия воды.</p>
<h2>Диаметр желоба</h2>
<p>Диаметр зависит от площади кровли:</p>
<ul>
<li>До 50 м² — желоб 75 мм</li>
<li>50–100 м² — желоб 100 мм</li>
<li>Более 100 м² — желоб 125 или 150 мм</li>
</ul>
<h2>Материал</h2>
<p>ПВХ — оптимальное соотношение цена/качество. Металл — повышенная прочность и эстетика.</p>
<p>Водосточные системы Döcke STANDART и Döcke PREMIUM доступны в нашем каталоге.</p>`,
            isPublished: true,
            publishedAt: new Date('2024-02-10'),
            coverImage: '/uploads/news/gutters-guide.jpg',
        }),
        newsRepo.create({
            title: 'Участие в выставке MosBuild 2024',
            slug: 'mosbuild-2024',
            excerpt: 'Компания Döcke приняла участие в крупнейшей строительной выставке России MosBuild 2024 и представила новинки сезона.',
            content: `<p>С 2 по 5 апреля 2024 года компания Döcke участвовала в международной строительной выставке <strong>MosBuild 2024</strong> в Москве.</p>
<p>На стенде были представлены:</p>
<ul>
<li>Новая коллекция сайдинга Döcke LUX 2024</li>
<li>Обновлённая линейка гибкой черепицы SHINGLE</li>
<li>Система водостоков Döcke PREMIUM</li>
<li>Фасадные панели STONE новых форматов</li>
</ul>
<p>Выставка позволила познакомиться с тысячами архитекторов, строителей и дилеров со всей России.</p>`,
            isPublished: true,
            publishedAt: new Date('2024-04-06'),
            coverImage: '/uploads/news/mosbuild.jpg',
        }),
        newsRepo.create({
            title: 'Зимний монтаж сайдинга: советы от Döcke',
            slug: 'winter-installation-tips',
            excerpt: 'Как правильно монтировать виниловый сайдинг при отрицательных температурах — советы от специалистов Döcke.',
            content: `<p>Монтаж виниловых панелей зимой требует особого внимания. При температуре ниже +5°C ПВХ становится более хрупким.</p>
<h2>Ключевые правила</h2>
<ol>
<li>Хранить материал в тёплом месте до монтажа</li>
<li>Увеличить температурные зазоры на 20–30%</li>
<li>Работать в безветренную погоду</li>
<li>Не допускать ударов по панелям на морозе</li>
</ol>
<p>Следуя этим правилам, вы получите качественный результат даже в зимний период.</p>`,
            isPublished: true,
            publishedAt: new Date('2023-12-01'),
            coverImage: '/uploads/news/winter-install.jpg',
        }),
    ]);
    await documentRepo.save([
        documentRepo.create({
            name: 'Сертификат соответствия Döcke LUX',
            fileUrl: '/uploads/docs/cert-lux.pdf',
            type: document_orm_entity_1.DocumentType.CERTIFICATE,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Сертификат соответствия Döcke PREMIUM',
            fileUrl: '/uploads/docs/cert-premium.pdf',
            type: document_orm_entity_1.DocumentType.CERTIFICATE,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Инструкция по монтажу виниловых панелей',
            fileUrl: '/uploads/docs/install-vinyl.pdf',
            type: document_orm_entity_1.DocumentType.INSTRUCTION,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Инструкция по монтажу водостоков Döcke',
            fileUrl: '/uploads/docs/install-gutters.pdf',
            type: document_orm_entity_1.DocumentType.INSTRUCTION,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Инструкция по монтажу гибкой черепицы',
            fileUrl: '/uploads/docs/install-shingle.pdf',
            type: document_orm_entity_1.DocumentType.INSTRUCTION,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Технический паспорт Döcke LUX',
            fileUrl: '/uploads/docs/tech-lux.pdf',
            type: document_orm_entity_1.DocumentType.TECHNICAL,
            isPublished: true,
        }),
        documentRepo.create({
            name: 'Технический паспорт Döcke SHINGLE',
            fileUrl: '/uploads/docs/tech-shingle.pdf',
            type: document_orm_entity_1.DocumentType.TECHNICAL,
            isPublished: true,
        }),
    ]);
    console.log('Seed complete!');
    await AppDataSource.destroy();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map