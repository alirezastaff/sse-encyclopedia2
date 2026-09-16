import CountryArticlePage from "@/components/country/CountryArticlePage";

export default async function EnglishCountryArticlePage({ params }: { params: Promise<{ countryId: string }> }) {
  const { countryId } = await params;
  return <CountryArticlePage locale="en" countryId={countryId} />;
}
