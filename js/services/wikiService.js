export async function getWikiSummary(term) {
  const t = (term ?? "").trim();
  if (!t) return null;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();
  return {
    title: data.title,
    extract: data.extract,
    url: data.content_urls?.desktop?.page,
  };
}
