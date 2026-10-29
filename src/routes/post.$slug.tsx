import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { ARTICLES, getArticle } from "@/data/articles";
import izzy from "@/assets/trainer-izzy-boxing.jpg.asset.json";

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.article.title ?? "Article"} | The Workout Plant` },
      { name: "description", content: loaderData?.article.excerpt ?? "" },
      { property: "og:title", content: loaderData?.article.title ?? "Article" },
      { property: "og:description", content: loaderData?.article.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/post/${params.slug}` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `/post/${params.slug}` }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: loaderData.article.title,
              description: loaderData.article.excerpt,
              author: { "@type": "Person", name: loaderData.article.author },
              publisher: { "@type": "Organization", name: "The Workout Plant" },
            }),
          },
        ]
      : [],
  }),
  component: ArticleDetail,
  notFoundComponent: ArticleNotFound,
});

function ArticleNotFound() {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Article not found</h1>
      <p className="mt-4 text-muted-foreground">That article doesn't exist or may have been moved.</p>
      <Link
        to="/fitness-articles"
        className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
      >
        ← Back to All Articles
      </Link>
    </section>
  );
}

const mdComponents = {
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-10 text-2xl font-extrabold tracking-tight text-primary">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-5 leading-relaxed text-muted-foreground">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 rounded-r-lg border-l-4 border-primary bg-card p-5 italic text-foreground">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
      {children}
    </a>
  ),
  hr: () => <hr className="my-10 border-border" />,
};

function ArticleDetail() {
  const { article } = Route.useLoaderData();
  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/fitness-articles" className="text-sm font-bold text-primary hover:underline">
          ← Back to All Articles
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-bold text-primary">
            {article.category}
          </span>
          <span className="text-muted-foreground">
            {article.date} · {article.readTime}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">{article.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">By {article.author}</p>

        <div className="mt-10">
          <ReactMarkdown components={mdComponents}>{article.content}</ReactMarkdown>
        </div>

        <div className="card-surface mt-14 flex items-center gap-5 p-6">
          <img
            src={izzy.url}
            alt="Izzy Jacobus, Founder & Head Coach"
            width={160}
            height={160}
            loading="lazy"
            className="h-20 w-20 rounded-full object-cover object-top"
          />
          <div>
            <p className="font-extrabold">Izzy Jacobus</p>
            <p className="text-sm font-semibold text-primary">Founder & Head Coach</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Creator of THE PLAN. Strength, kickboxing and nutrition coaching at The Workout Plant, 139 Frost St,
              Brooklyn.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-primary/40 bg-primary/10 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight">Ready to Put This Into Practice?</h2>
          <p className="mt-2 text-muted-foreground">Train 1:1 with a Workout Plant coach in Greenpoint, Brooklyn.</p>
          <Link
            to="/book-a-session"
            className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
          >
            Claim Your BOGO 1:1 Intro Session
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl">
        <h2 className="text-2xl font-extrabold tracking-tight">More Articles</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {more.map((a) => (
            <article key={a.slug} className="card-surface flex flex-col p-6">
              <span className="self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {a.category}
              </span>
              <h3 className="mt-3 flex-1 font-extrabold tracking-tight">{a.title}</h3>
              <Link
                to="/post/$slug"
                params={{ slug: a.slug }}
                className="mt-4 self-start text-sm font-bold text-primary hover:underline"
              >
                Read Full Article →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </article>
  );
}
