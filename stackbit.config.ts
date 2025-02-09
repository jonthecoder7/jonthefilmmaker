// stackbit.config.ts
import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.5.0",

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "Page",
          type: "page",
          label: "Page",
          filePath: "content/pages/{slug}.json",
          urlPath: "/{slug}",
          fields: [
            { name: "title", type: "string", label: "Title", required: true },
            { name: "body", type: "markdown", label: "Body" }
          ]
        },
        {
          name: "Blog",
          type: "page",
          label: "Blog Post",
          filePath: "content/posts/{slug}.json",
          urlPath: "/blog/{slug}",
          fields: [
            { name: "title", type: "string", label: "Title", required: true },
            { name: "date", type: "date", label: "Date", required: true },
            { name: "summary", type: "string", label: "Summary" },
            { name: "body", type: "markdown", label: "Body" }
          ]
        },
        {
          name: "Project",
          type: "page",
          label: "Project",
          filePath: "content/projects/{slug}.json",
          urlPath: "/projects/{slug}",
          fields: [
            { name: "title", type: "string", label: "Title", required: true },
            { name: "summary", type: "string", label: "Summary" },
            { name: "body", type: "markdown", label: "Body" }
          ]
        }
      ]
    })
  ],

  siteMap: ({ documents, models }) => {
    // 1. Filter models that represent pages
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      // 2. Filter documents that match page models
      .filter((doc) => pageModels.some((m) => m.name === doc.modelName))
      // 3. Map each document to a SiteMapEntry
      .map((doc) => {
        // Determine URL structure based on model type
        const urlModel = (() => {
          switch (doc.modelName) {
            case "Page":
              return "";
            case "Blog":
              return "blog";
            case "Project":
              return "projects";
            default:
              return null;
          }
        })();

        return urlModel
          ? {
              stableId: doc.id,
              urlPath: `/${urlModel}/${doc.id}`,
              document: doc,
              isHomePage: doc.modelName === "Page" && doc.id === "home"
            }
          : null;
      })
      .filter(Boolean) as SiteMapEntry[];
  }
});
