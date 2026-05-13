import { products } from '@/lib/data';
import MyOriginalPage from './ProductPageClient'; // We will rename your current file to this

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function Page({ params }: any) {
  return <MyOriginalPage params={params} />;
}