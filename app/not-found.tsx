import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center">
      <h1 className="text-3xl font-semibold">Страница не найдена</h1>
      <p className="mt-3 text-text-dim">Возможно, ссылка устарела.</p>
      <Link href="/" className="btn btn-primary mt-6">На главную</Link>
    </div>
  );
}
