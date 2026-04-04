import type { MetadataRoute } from "next";
import { getTutorials, getCategories, SITE_URL } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [dataTutorials, dataCategories] = await Promise.all([
        getTutorials(),
        getCategories(),
    ]);

    const tutorialUrls: MetadataRoute.Sitemap = dataTutorials.data.map((tutorial) => ({
        url: `${SITE_URL}/tutorial/${tutorial.slug}`,
        lastModified: new Date(tutorial.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = dataCategories.data.map((cat) => ({
        url: `${SITE_URL}/kategori/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/tutorial`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/tentang`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/kontak`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ];

    return [...staticPages, ...tutorialUrls, ...categoryUrls];
}
