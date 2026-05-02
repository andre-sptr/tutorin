import { getTutorials } from "@/lib/api";
import FeaturedTutorials from "./FeaturedTutorials";

export default async function FeaturedTutorialsContainer() {
    const dataTutorials = await getTutorials();
    const tutorials = dataTutorials.data || [];
    const recentTutorials = tutorials.slice(0, 5);

    return <FeaturedTutorials recentTutorials={recentTutorials} />;
}
