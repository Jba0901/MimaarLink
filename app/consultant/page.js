import { redirect } from 'next/navigation';

export default function ConsultantPage() {
  redirect('/contractor?type=consultant');
}
