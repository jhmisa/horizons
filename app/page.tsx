import CountryHome from "@/components/pages/CountryHome";

export const revalidate = 60;

export default function Page() {
  return <CountryHome country="nz" />;
}
