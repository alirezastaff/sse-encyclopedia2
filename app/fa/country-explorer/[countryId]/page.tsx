import CountryArticlePage from "@/components/country/CountryArticlePage";

export default async function PersianCountryArticlePage({ params }: { params: Promise<{ countryId: string }> }) {
  const { countryId } = await params;
  return <CountryArticlePage locale="fa" countryId={countryId} />;
}
